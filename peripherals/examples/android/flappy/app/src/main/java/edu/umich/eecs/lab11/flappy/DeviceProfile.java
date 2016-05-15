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

    public static UUID BEACON_UUID = shortUUID("FEAA");
    //Service UUID to expose our time characteristics
    public static UUID SERVICE_UUID = shortUUID("B1D5");
    //Read-write characteristic for current offset timestamp
    public static UUID CHARACTERISTIC_UUID = shortUUID("B1DC");

    // URI of the UI
    public static byte[] URI_AD = uriAd("goo.gl/svHCUl");

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

    public static byte[] uriAd(String s) {
        StringBuilder str = new StringBuilder("10BA02");
        for (byte b : s.getBytes()) str.append(String.format("%02X", b));
        s = str.toString();
        int len = s.length();
        byte[] data = new byte[len / 2 + len % 2];
        for (int i = 0; i < len; i += 2)
            data[i / 2] = (byte) ((Character.digit(s.charAt(i), 16) << 4) + ((i+1)>=len ? 0 : Character.digit(s.charAt(i+1), 16)));
        return data;
    }
}