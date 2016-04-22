package edu.umich.eecs.lab11.eddystone;

import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothManager;
import android.bluetooth.le.AdvertiseCallback;
import android.bluetooth.le.AdvertiseData;
import android.bluetooth.le.AdvertiseSettings;
import android.bluetooth.le.BluetoothLeAdvertiser;
import android.content.Context;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.os.ParcelUuid;
import android.preference.PreferenceActivity;
import android.preference.PreferenceFragment;
import android.preference.PreferenceManager;
import android.widget.Toast;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;

public class MainActivity extends PreferenceActivity implements SharedPreferences.OnSharedPreferenceChangeListener {

    private SharedPreferences cur_settings;
    private BluetoothAdapter bleAdapter;
    private BluetoothLeAdvertiser bleAdvertiser;
    private AdvertiseSettings.Builder settingsBuilder;
    private AdvertiseData.Builder dataBuilder;
    private String fullUrl="";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        cur_settings = PreferenceManager.getDefaultSharedPreferences(this);
        cur_settings.registerOnSharedPreferenceChangeListener(this);
        getFragmentManager().beginTransaction().replace(android.R.id.content, new MainFragment()).commit();

        // Use this check to determine whether BLE is supported on the device.  Then you can
        // selectively disable BLE-related features.
        if (!getPackageManager().hasSystemFeature(PackageManager.FEATURE_BLUETOOTH_LE)) {
            Toast.makeText(this, "BLE not supported", Toast.LENGTH_SHORT).show();
            finish();
        }

        // Initializes a Bluetooth adapter.  For API level 18 and above, get a reference to
        // BluetoothAdapter through BluetoothManager.
        final BluetoothManager bluetoothManager = (BluetoothManager) getSystemService(Context.BLUETOOTH_SERVICE);
        bleAdapter = bluetoothManager.getAdapter();

        // Checks if Bluetooth is supported on the device.
        if (bleAdapter == null) {
            Toast.makeText(this, "Bluetooth not supported", Toast.LENGTH_SHORT).show();
            finish();
        }
    }

    protected void onResume() {
        super.onResume();
        cur_settings = PreferenceManager.getDefaultSharedPreferences(this);
        cur_settings.registerOnSharedPreferenceChangeListener(this);

        // Ensures Bluetooth is enabled on the device.
        if (!bleAdapter.isEnabled()) bleAdapter.enable();

        bleAdvertiser = bleAdapter.getBluetoothLeAdvertiser();
        advertise();
    }

    protected void onPause() {
        super.onPause();
        cur_settings.unregisterOnSharedPreferenceChangeListener(this);
    }

    private void advertise() {
        runOnUiThread( new Runnable() { public void run() { setTitle("Advertise: " + cur_settings.getString("final_url","http://umich.edu")); }});
        bleAdvertiser.stopAdvertising(advertiseCallback);
        settingsBuilder = new AdvertiseSettings.Builder()
                .setAdvertiseMode(AdvertiseSettings.ADVERTISE_MODE_BALANCED)
                .setTxPowerLevel(AdvertiseSettings.ADVERTISE_TX_POWER_HIGH)
                .setConnectable(true).setTimeout(0);
        dataBuilder = new AdvertiseData.Builder()
                .addServiceUuid(shortUUID("FEAA"))
                .addServiceData(shortUUID("FEAA"), toByteArray(cur_settings.getString("ad_value","0000")));

        if (cur_settings.getBoolean("advertise_switch",false))
            bleAdvertiser.startAdvertising(settingsBuilder.build(), dataBuilder.build(), advertiseCallback);
    }

    private AdvertiseCallback advertiseCallback = new AdvertiseCallback() {
        @Override
        public void onStartSuccess(AdvertiseSettings settingsInEffect) {
            super.onStartSuccess(settingsInEffect);
        }
        @Override
        public void onStartFailure(int errorCode) {
            super.onStartFailure(errorCode);
            toastNotify("Failed to Advertise");
            cur_settings.edit().putBoolean("advertise_switch",false).commit();
            getFragmentManager().beginTransaction().replace(android.R.id.content, new MainFragment()).commit();
        }

    };

    /**
     * Settings Fragment: Pulls information from preference xml & automatically updates on change
     */
    public static class MainFragment extends PreferenceFragment {
        @Override
        public void onCreate(Bundle savedInstanceState) {
            super.onCreate(savedInstanceState);
            addPreferencesFromResource(R.xml.preferences);
            getPreferenceScreen().removePreference(getPreferenceManager().findPreference("ad_value"));
            getPreferenceScreen().removePreference(getPreferenceManager().findPreference("final_url"));
            getPreferenceScreen().removePreference(getPreferenceManager().findPreference("uid"));
            getPreferenceScreen().removePreference(getPreferenceManager().findPreference("tlm"));
        }
    }

    @Override
    public void onSharedPreferenceChanged(SharedPreferences sharedPreferences, String key) {
        new Thread( new Runnable(){ public void run() {

            String pre = cur_settings.getString("protocol","http://");
            String url = cur_settings.getString("ip_text","umich.edu");
            if (!fullUrl.equals(pre + url))
                try {
                    if (url.length() > 17) {
                        HttpURLConnection huc = (HttpURLConnection) (new URL("https://www.googleapis.com/urlshortener/v1/url?key=" + BuildConfig.API_KEY)).openConnection();
                        huc.setRequestMethod("POST");
                        huc.setDoOutput(true);
                        huc.setRequestProperty("Content-Type", "application/json");
                        OutputStreamWriter wr = new OutputStreamWriter(huc.getOutputStream());
                        wr.write("{\"longUrl\": \"" + pre + url + "\"}");
                        wr.flush();
                        BufferedReader rd = new BufferedReader(new InputStreamReader(huc.getInputStream()));
                        String line, json = "";
                        while ((line = rd.readLine()) != null) json += line;
                        url = json.substring(json.indexOf(pre)+pre.length(), json.indexOf("\"",json.indexOf(pre)));
                    }
                    fullUrl = pre + cur_settings.getString("ip_text","umich.edu");
                    cur_settings.edit().putString("final_url", pre + url).commit();
                    cur_settings.edit().putString("ad_value", "10BA" + (pre.equals("http://")?"02":"03") + toHex(url.getBytes())).commit();
                } catch (Exception e) { e.printStackTrace(); }

            if (cur_settings.getBoolean("advertise_switch", false)) {
                advertise();
            } else {
                if (bleAdvertiser != null) bleAdvertiser.stopAdvertising(advertiseCallback);
                runOnUiThread( new Runnable() { public void run() { setTitle("Advertise: Off"); }});
            }
        }}).start();
    }

    /*
     * HELPER FUNCTIONS
     */

    public byte[] toByteArray(String s) {
        int len = s.length();
        byte[] data = new byte[len / 2 + len % 2];
        for (int i = 0; i < len; i += 2) {
            data[i / 2] = (byte) ((Character.digit(s.charAt(i), 16) << 4) + ((i+1)>=len ? 0 : Character.digit(s.charAt(i+1), 16)));
        }
        return data;
    }

    public ParcelUuid shortUUID(String s) {
        return ParcelUuid.fromString("0000" + s + "-0000-1000-8000-00805F9B34FB");
    }

    public String toHex(byte[] ba) {
        StringBuilder str = new StringBuilder();
        for (int i = 0; i<ba.length; i++) str.append(String.format("%02X", ba[i]));
        return str.toString();
    }

    public void toastNotify(String m) {
        Toast.makeText(this, m, Toast.LENGTH_SHORT).show();
    }


}
