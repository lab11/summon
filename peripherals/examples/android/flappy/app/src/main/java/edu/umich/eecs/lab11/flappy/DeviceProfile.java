package edu.umich.eecs.lab11.flappy;

import android.bluetooth.BluetoothGatt;
import android.bluetooth.BluetoothProfile;

import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.util.UUID;

/**
 * DeviceProfile
 * Service/Characteristic constant for our custom peripheral
 */
public class DeviceProfile {

    /* Unique ids generated for this device by 'uuidgen'. Doesn't conform to any SIG profile. */

    //
    public static UUID BEACON_UUID = shortUUID("FEAA");
    //Service UUID to expose our time characteristics
    public static UUID SERVICE_UUID = shortUUID("B1D5");
    //Read-only characteristic providing number of elapsed seconds since offset
    public static UUID CHARACTERISTIC_ELAPSED_UUID = UUID.fromString("275348FB-C14D-4FD5-B434-7C3F351DEA5F");
    //Read-write characteristic for current offset timestamp
    public static UUID CHARACTERISTIC_UUID = shortUUID("B1DC");

    public static String getStateDescription(int state) {
        switch (state) {
            case BluetoothProfile.STATE_CONNECTED:
                return "Connected";
            case BluetoothProfile.STATE_CONNECTING:
                return "Connecting";
            case BluetoothProfile.STATE_DISCONNECTED:
                return "Disconnected";
            case BluetoothProfile.STATE_DISCONNECTING:
                return "Disconnecting";
            default:
                return "Unknown State "+state;
        }
    }

    public static String getStatusDescription(int status) {
        switch (status) {
            case BluetoothGatt.GATT_SUCCESS:
                return "SUCCESS";
            default:
                return "Unknown Status "+status;
        }
    }

    public static byte[] getShiftedTimeValue(int timeOffset) {
        int value = Math.max(0,
                (int)(System.currentTimeMillis()/1000) - timeOffset);
        return bytesFromInt(value);
    }

    public static byte[] bytesFromInt(int value) {
        //Convert result into raw bytes. GATT APIs expect LE order
        return ByteBuffer.allocate(4)
                .order(ByteOrder.LITTLE_ENDIAN)
                .putInt(value)
                .array();
    }

    public static UUID shortUUID(String s) {
        return UUID.fromString("0000" + s + "-0000-1000-8000-00805F9B34FB");
    }
}