/**
 * See LICENSE for more.
 *
 * Some Android specific magic came from here:
 * https://code.google.com/p/boxeeremote/wiki/AndroidUDP
 */
package com.ionicsdk.discovery;

import java.util.TimeZone;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;

import org.apache.cordova.CordovaWebView;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaInterface;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.provider.Settings;

import android.net.nsd.NsdManager;
import android.net.nsd.NsdServiceInfo;
import android.util.Log;
import android.content.Context;
import android.os.AsyncTask;
import android.net.wifi.WifiManager;
import android.net.DhcpInfo;

public class Discovery extends CordovaPlugin {
  public static final String TAG = "Discovery";

  public static final String SERVICE_TYPE = "_http._tcp.";
  public static final String mServiceName = "ionicview";


  public static String platform;                            // Device OS
  public static String uuid;                                // Device UUID

  public static int PORT = 41235;

  NsdManager mNsdManager;
  NsdManager.ResolveListener mResolveListener;
  NsdManager.DiscoveryListener mDiscoveryListener;
  NsdManager.RegistrationListener mRegistrationListener;
  Context mContext;
  

  private static final String ANDROID_PLATFORM = "Android";

  /**
   * Constructor.
   */
  public Discovery() {
  }

  InetAddress getBroadcastAddress() throws Exception {
    WifiManager wifi = (WifiManager) mContext.getSystemService(Context.WIFI_SERVICE);
    DhcpInfo dhcp = wifi.getDhcpInfo();
    // handle null somehow

    int broadcast = (dhcp.ipAddress & dhcp.netmask) | ~dhcp.netmask;
    byte[] quads = new byte[4];
    for (int k = 0; k < 4; k++)
      quads[k] = (byte) ((broadcast >> k * 8) & 0xFF);
    InetAddress addr = InetAddress.getByAddress(quads);

    Log.d(TAG, "Got broadcast addr:" + addr);
    return addr;
  }

  /**
   * Sets the context of the Command. This can then be used to do things like
   * get file paths associated with the Activity.
   *
   * @param cordova The context of the main Activity.
   * @param webView The CordovaWebView Cordova is running in.
   */
  public void initialize(CordovaInterface cordova, CordovaWebView webView) {
    super.initialize(cordova, webView);

    Log.d(TAG, "Discovery plugin initializing");

    mContext = webView.getContext();


    /*
    NsdServiceInfo serviceInfo  = new NsdServiceInfo();
    serviceInfo.setServiceName("NsdChat");
    serviceInfo.setServiceType("_http._tcp.");
    serviceInfo.setPort();
    */

    //mNsdManager = (NsdManager) webView.getContext().getSystemService(Context.NSD_SERVICE);

    /*
    mNsdManager.registerService(
        serviceInfo, NsdManager.PROTOCOL_DNS_SD, mRegistrationListener);
    */

    //initializeDiscoveryListener();
    //mNsdManager.discoverServices(SERVICE_TYPE, NsdManager.PROTOCOL_DNS_SD, mDiscoveryListener);
  }

  public void doIdentify(final JSONObject opts, final CallbackContext callbackContext) {
    new AsyncTask<Integer, Void, Void>() {

      @Override
      protected Void doInBackground(Integer...params) {
        try {
          DatagramSocket socket = new DatagramSocket();
          socket.setBroadcast(true);

          String data = opts.toString();

          DatagramPacket packet = new DatagramPacket(data.getBytes(), data.length(),
              getBroadcastAddress(), opts.getInt("port"));
          socket.send(packet);
          Log.d(TAG, "Sent packet");

          byte[] buf = new byte[1024];
          packet = new DatagramPacket(buf, buf.length);
          socket.receive(packet);

          String result = new String(buf, 0, packet.getLength());

          Log.d(TAG, "Got response packet of " + packet.getLength() + " bytes: " + result);
           
          callbackContext.success(result);

        } catch(Exception e) {
          callbackContext.error(e.getMessage());
          Log.e(TAG, "Exception while listening for server broadcast");
          e.printStackTrace();
        }
        return null;
      }
    }.execute();

  }

  /**
   * Executes the request and returns PluginResult.
   *
   * @param action            The action to execute.
   * @param args              JSONArry of arguments for the plugin.
   * @param callbackContext   The callback id used when calling back into JavaScript.
   * @return                  True if the action was valid, false if not.
   */

  @Override
  public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
    if (action.equals("identify")) {
      JSONObject opts = args.getJSONObject(0);
      Log.d(TAG, "Doing identify");
      Log.d(TAG, opts.toString());

      doIdentify(opts, callbackContext);
      return true;
    }
     
    return false;
  }


  /*
  New features? Didn't try any of the below.
  public void initializeDiscoveryListener() {
    mResolveListener = new NsdManager.ResolveListener() {

      @Override
      public void onResolveFailed(NsdServiceInfo serviceInfo, int errorCode) {
        // Called when the resolve fails.  Use the error code to debug.
        Log.e(TAG, "Resolve failed" + errorCode);
      }

      @Override
      public void onServiceResolved(NsdServiceInfo serviceInfo) {
        Log.e(TAG, "Resolve Succeeded. " + serviceInfo);

        if (serviceInfo.getServiceName().equals(mServiceName)) {
          Log.d(TAG, "Same IP.");
          return;
        }
      }
    };

    // Instantiate a new DiscoveryListener
    mDiscoveryListener = new NsdManager.DiscoveryListener() {

      //  Called as soon as service discovery begins.
      @Override
      public void onDiscoveryStarted(String regType) {
        Log.d(TAG, "Service discovery started");
      }

      @Override
      public void onServiceFound(NsdServiceInfo service) {
        // A service was found!  Do something with it.
        Log.d(TAG, "Service discovery success" + service);
        if (!service.getServiceType().equals(SERVICE_TYPE)) {
          // Service type is the string containing the protocol and
          // transport layer for this service.
          Log.d(TAG, "Unknown Service Type: " + service.getServiceType());
        } else if (service.getServiceName().equals(mServiceName)) {
          // The name of the service tells the user what they'd be
          // connecting to. It could be "Bob's Chat App".
          Log.d(TAG, "Same machine: " + mServiceName);
          mNsdManager.resolveService(service, mResolveListener);
        } else if (service.getServiceName().contains("NsdChat")){
          mNsdManager.resolveService(service, mResolveListener);
        }
      }

      @Override
      public void onServiceLost(NsdServiceInfo service) {
        // When the network service is no longer available.
        // Internal bookkeeping code goes here.
        Log.e(TAG, "service lost" + service);
      }

      @Override
      public void onDiscoveryStopped(String serviceType) {
        Log.i(TAG, "Discovery stopped: " + serviceType);
      }

      @Override
      public void onStartDiscoveryFailed(String serviceType, int errorCode) {
        Log.e(TAG, "Discovery failed: Error code:" + errorCode);
        mNsdManager.stopServiceDiscovery(this);
      }

      @Override
      public void onStopDiscoveryFailed(String serviceType, int errorCode) {
        Log.e(TAG, "Discovery failed: Error code:" + errorCode);
        mNsdManager.stopServiceDiscovery(this);
      }
    };
  }
  */
}
