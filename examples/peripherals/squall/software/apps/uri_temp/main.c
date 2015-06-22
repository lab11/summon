/* 
    Advertises using UriBeacon API with url-encoded temperature value
    Thomas Zachariah
    6/17/15
 */

#include <stdbool.h>
#include <stdint.h>
#include "nrf_gpio.h"
#include "ble_advdata.h"
#include "boards.h"
#include "nordic_common.h"
#include "softdevice_handler.h"
#include "ble_debug_assert_handler.h"
#include "led.h"
#include "nrf_temp.h"
#include "app_gpiote.h"
#include "app_timer.h"

#define IS_SRVC_CHANGED_CHARACT_PRESENT 0                                 /**< Include or not the service_changed characteristic. if not enabled, the server's database cannot be changed for the lifetime of the device*/

#define USE_LEDS                        1
#define ADVERTISING_LED                 LED_0                             /**< Is on when device is advertising. */

#define APP_CFG_NON_CONN_ADV_TIMEOUT    0                                 /**< Time for which the device must be advertising in non-connectable mode (in seconds). 0 disables timeout. */
#define NON_CONNECTABLE_ADV_INTERVAL    MSEC_TO_UNITS(1000, UNIT_0_625_MS)   /**< The advertising interval for non-connectable advertisement (100 ms). This value can vary between 100ms to 10.24s). */

#define ADVERTISE_DEV_NAME              1                                 /**< Whether to advertise device name (may not fit if APP_DATA_LENGTH too big). */
#define DEV_NAME                        "BBB"

// Some constants about timers
#define TIMER_PRESCALER              2                                  /**< Value of the RTC1 PRESCALER register. */
#define TIMER_MAX_TIMERS             4                                  /**< Maximum number of simultaneously created timers. */
#define TIMER_OP_QUEUE_SIZE          5                                  /**< Size of timer operation queues. */

// How long before the timer fires.
#define RATE     APP_TIMER_TICKS(500, TIMER_PRESCALER) // every 0.5 seconds

#define URIBEACON_SERVICE_ID            0xFED8                             /**< Service Short UUID ( Always FED8 for UriBeacon ) **/
#define URIBEACON_FLAGS                 0x00                               /**< Flags ( Bit 0: Request invisibility (at discretion of central device), Bit 1..7: reserved ) */
#define URIBEACON_TX_POWER              0xBA                               /**< TX Power ( -100dBm to +20dBm, determined by manually measuring at 1m and adding 41dBm; NOT the same as advertised TX power levels ) */
#define URIBEACON_URI_PREFIX            0x02                               /**< Prefix ( 0x00:"http://www.", 0x01:"https://www.", 0x02:"http://", 0x03:"https://", 0x04:"urn:uuid:", or first char of URI ) */
#define URIBEACON_URI                   "goo.gl/tFiI0l?00"                 /**< URI minus the prefix */
#define URIBEACON_LENGTH                0x13                               /**< Length ( 3 + <length of URIBEACON_URI> ) */

// Timer data structure
static app_timer_id_t  timer;                        /**< Battery timer. */

// information about the advertisement
static ble_gap_adv_params_t             m_adv_params;                     /**< Parameters to be passed to the stack when starting advertising. */

static uint8_t uri[URIBEACON_LENGTH-3] = {URIBEACON_URI};

/**@brief Function for error handling, which is called when an error has occurred.
 *
 * @warning This handler is an example only and does not fit a final product. You need to analyze
 *          how your product is supposed to react in case of error.
 *
 * @param[in] error_code  Error code supplied to the handler.
 * @param[in] line_num    Line number where the handler is called.
 * @param[in] p_file_name Pointer to the file name.
 */
void app_error_handler(uint32_t error_code, uint32_t line_num, const uint8_t * p_file_name)
{
    // This call can be used for debug purposes during application development.
    // @note CAUTION: Activating this code will write the stack to flash on an error.
    //                This function should NOT be used in a final product.
    //                It is intended STRICTLY for development/debugging purposes.
    //                The flash write will happen EVEN if the radio is active, thus interrupting
    //                any communication.
    //                Use with care. Un-comment the line below to use.
    // ble_debug_assert_handler(error_code, line_num, p_file_name);

    // On assert, the system can only recover on reset.
    NVIC_SystemReset();
}

// Timer callback
static void timer_handler (void* p_context) {
    volatile int32_t  temp = 0xDEADBEEF;

    NRF_TEMP->TASKS_START = 1; /** Start the temperature measurement. */

    /* Busy wait while temperature measurement is not finished, you can skip waiting if you enable interrupt for DATARDY event and read the result in the interrupt. */
    /*lint -e{845} // A zero has been given as right argument to operator '|'" */
    while (NRF_TEMP->EVENTS_DATARDY == 0)
    {
        // Do nothing.
    }
    NRF_TEMP->EVENTS_DATARDY = 0;

    //*@note Workaround for PAN_028 rev2.0A anomaly 29 - TEMP: Stop task clears the TEMP register. 
    temp = (nrf_temp_read() / 7);

    /**@note Workaround for PAN_028 rev2.0A anomaly 30 - TEMP: Temp module analog front end does not power down when DATARDY event occurs. */
    NRF_TEMP->TASKS_STOP = 1; /** Stop the temperature measurement. */

    sprintf(&uri[14], "%02X",(temp >>  0) & 0xFF);

    update_advertisement();
    // led_toggle(ADVERTISING_LED);
}

// Setup timer
static void timer_init(void)
{
    uint32_t err_code;

    // Initialize timer module.
    APP_TIMER_INIT(TIMER_PRESCALER,
                   TIMER_MAX_TIMERS,
                   TIMER_OP_QUEUE_SIZE,
                   false);

    // Create a timer
    err_code = app_timer_create(&timer,
                                APP_TIMER_MODE_REPEATED,
                                timer_handler);
    APP_ERROR_CHECK(err_code);
}

// Start the timer
static void timer_start(void) {
    uint32_t err_code;

    // Start application timers.
    err_code = app_timer_start(timer, RATE, NULL);
    APP_ERROR_CHECK(err_code);
}

/**@brief Callback function for asserts in the SoftDevice.
 *
 * @details This function will be called in case of an assert in the SoftDevice.
 *
 * @warning This handler is an example only and does not fit a final product. You need to analyze
 *          how your product is supposed to react in case of Assert.
 * @warning On assert from the SoftDevice, the system can only recover on reset.
 *
 * @param[in]   line_num   Line number of the failing ASSERT call.
 * @param[in]   file_name  File name of the failing ASSERT call.
 */
void assert_nrf_callback(uint16_t line_num, const uint8_t * p_file_name)
{
    app_error_handler(0xDEADBEEF, line_num, p_file_name);
}

// Setup TX power and the device name
static void gap_params_init(void)
{
    uint32_t                err_code;
    ble_gap_conn_sec_mode_t sec_mode;

    // Set the power. Using really low (-30) doesn't really work
    sd_ble_gap_tx_power_set(4);

    // Make the connection open (no security)
    BLE_GAP_CONN_SEC_MODE_SET_OPEN(&sec_mode);

    // Set the name of the device so its easier to find
    err_code = sd_ble_gap_device_name_set(&sec_mode,
                                          (const uint8_t *) DEV_NAME,
                                          strlen(DEV_NAME));
    APP_ERROR_CHECK(err_code);
}


/**@brief Function for initializing the Advertising functionality.
 *
 * @details Encodes the required advertising data and passes it to the stack.
 *          Also builds a structure to be passed to the stack when starting advertising.
 */
static void advertising_init(void)
{
    uint32_t                  err_code;
    ble_advdata_t advdata;
    // Use the simplest send adv packets only mode
    uint8_t                   flags = BLE_GAP_ADV_FLAG_BR_EDR_NOT_SUPPORTED;

    uint8_t                   m_uri_data[URIBEACON_LENGTH] = { URIBEACON_FLAGS, URIBEACON_TX_POWER, URIBEACON_URI_PREFIX };
    for (uint8_t i=3; i<(URIBEACON_LENGTH); i++) m_uri_data[i] = uri[i-3];


    ble_advdata_service_data_t  service_data;

    service_data.service_uuid = URIBEACON_SERVICE_ID;
    service_data.data.p_data  = (uint8_t *) m_uri_data;
    service_data.data.size    = URIBEACON_LENGTH;

    // Build and set advertising data.
    memset(&advdata, 0, sizeof(advdata));

    if (ADVERTISE_DEV_NAME) advdata.name_type = BLE_ADVDATA_FULL_NAME;
    advdata.flags.size              = sizeof(flags);
    advdata.flags.p_data            = &flags;
    advdata.p_service_data_array    = &service_data;
    advdata.service_data_count      = 1;

    err_code = ble_advdata_set(&advdata, NULL);
    APP_ERROR_CHECK(err_code);

    // Initialize advertising parameters (used when starting advertising).
    memset(&m_adv_params, 0, sizeof(m_adv_params));

    m_adv_params.type        = BLE_GAP_ADV_TYPE_ADV_NONCONN_IND;
    m_adv_params.p_peer_addr = NULL;                             // Undirected advertisement.
    m_adv_params.fp          = BLE_GAP_ADV_FP_ANY;
    m_adv_params.interval    = NON_CONNECTABLE_ADV_INTERVAL;
    m_adv_params.timeout     = APP_CFG_NON_CONN_ADV_TIMEOUT;
}

void update_advertisement() {
    uint32_t                  err_code;
    uint8_t                   flags = BLE_GAP_ADV_FLAG_BR_EDR_NOT_SUPPORTED;

    uint8_t                   m_uri_data[URIBEACON_LENGTH] = { URIBEACON_FLAGS, URIBEACON_TX_POWER, URIBEACON_URI_PREFIX };
    for (uint8_t i=3; i<(URIBEACON_LENGTH); i++) m_uri_data[i] = uri[i-3];


    ble_advdata_service_data_t  service_data;

    service_data.service_uuid = URIBEACON_SERVICE_ID;
    service_data.data.p_data  = (uint8_t *) m_uri_data;
    service_data.data.size    = URIBEACON_LENGTH;

    
    ble_advdata_t advdata;
    memset(&advdata, 0, sizeof(advdata));
    if (ADVERTISE_DEV_NAME) advdata.name_type = BLE_ADVDATA_FULL_NAME;
    advdata.flags.size              = sizeof(flags);
    advdata.flags.p_data            = &flags;
    // advdata.p_manuf_specific_data   = &manuf_specific_data;
    advdata.p_service_data_array    = &service_data;
    advdata.service_data_count      = 1;

    err_code = ble_advdata_set(&advdata, NULL);
    APP_ERROR_CHECK(err_code);
}

/**@brief Function for starting advertising.
 */
static void advertising_start(void)
{
    uint32_t err_code;

    err_code = sd_ble_gap_adv_start(&m_adv_params);
    APP_ERROR_CHECK(err_code);

    // if(USE_LEDS) led_toggle(ADVERTISING_LED);
}


/**@brief Function for initializing the BLE stack.
 *
 * @details Initializes the SoftDevice and the BLE event interrupt.
 */
static void ble_stack_init(void)
{

    // Initialize the SoftDevice handler module.
    // Use a really crappy clock because we want fast start
    SOFTDEVICE_HANDLER_INIT(NRF_CLOCK_LFCLKSRC_RC_250_PPM_8000MS_CALIBRATION, false);

    // Enable BLE stack
    uint32_t err_code;
    ble_enable_params_t ble_enable_params;
    memset(&ble_enable_params, 0, sizeof(ble_enable_params));
    ble_enable_params.gatts_enable_params.service_changed = IS_SRVC_CHANGED_CHARACT_PRESENT;
    err_code = sd_ble_enable(&ble_enable_params);
    APP_ERROR_CHECK(err_code);
}

/**@brief Function for doing power management.
 */
static void power_manage(void)
{
    uint32_t err_code = sd_app_evt_wait();
    APP_ERROR_CHECK(err_code);
}


/**
 * @brief Function for application main entry.
 */
int main(void)
{
    // Initialize.
    platform_init();

    nrf_temp_init();
    timer_init();

    APP_GPIOTE_INIT(1);

    ble_stack_init();

    gap_params_init();

    led_init(ADVERTISING_LED);
    led_off(ADVERTISING_LED);

    advertising_init();
    advertising_start();

    timer_start();

    while (1) {

        // advertising_start();
        // update_advertisement();
        power_manage();

    }
}

