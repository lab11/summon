PROJECT_NAME = $(shell basename "$(realpath ./)")

APPLICATION_SRCS = $(notdir $(wildcard ./*.c))
APPLICATION_SRCS += softdevice_handler.c
APPLICATION_SRCS += ble_advdata.c
APPLICATION_SRCS += ble_debug_assert_handler.c
APPLICATION_SRCS += ble_srv_common.c
APPLICATION_SRCS += led.c
APPLICATION_SRCS += app_error.c simple_uart.c ble_conn_params.c
APPLICATION_SRCS += app_timer.c app_gpiote.c

DEVICE = NRF51

ifndef TARGET
	TARGET = SQUALL
endif

TARGET_UPPER = $(shell echo $(TARGET) | tr a-z A-Z)
BOARD = BOARD_$(TARGET_UPPER)

USE_SOFTDEVICE = s110

SDK_VERSION = 7
SDK_PATH ?= $(HOME)/workspace/nrf51822/nrf51822_sdk/sdk7/
TEMPLATE_PATH ?= ../../nrf51-pure-gcc-setup/template/
SOFTDEVICE ?= $(HOME)/workspace/nrf51822/softdevices/s110_7.1.0/s110_nrf51822_7.1.0_softdevice.hex

LIBRARY_PATHS += ./
LIBRARY_PATHS += ../../include
SOURCE_PATHS += ../../src

CFLAGS = -Os
CFLAGS += $(MFLAGS)
GDB_PORT_NUMBER = 2331

include $(TEMPLATE_PATH)Makefile
