package edu.umich.eecs.lab11.summon;

import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothManager;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.nsd.NsdManager;
import android.net.nsd.NsdServiceInfo;
import android.os.AsyncTask;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.widget.RemoteViews;
import android.widget.RemoteViewsService;

import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class AppWidgetService extends RemoteViewsService {
    @Override public RemoteViewsFactory onGetViewFactory(Intent intent) { return new AppRemoteViewsFactory(this.getApplicationContext()); }
}

class AppRemoteViewsFactory implements RemoteViewsService.RemoteViewsFactory {
    private List<WidgetItem> mWidgetItems = new ArrayList<WidgetItem>();
    private List<String> J2XUS  = Arrays.asList(new String[]{"6EKY8W","WRzp2g","qtn9V9","WRKqIy","2W2FTt","BA1zPM","8685Uw","hWTo8W","nCQV8C","sbMMHT","9aD6Wi","2ImXWJ","dbhGnF","3YACnH","449K5X","jEKPu9","xWppj1","Edukt0"});
    private String[] PRTCOL = {"","","aaa:","aaas:","about:","acap:","acct:","cap:","cid:","coap:","coaps:","crid:","data:","dav:","dict:","dns:","file:","ftp:","geo:","go:","gopher:","h323:","http:","https:","iax:","icap:","im:","imap:","info:","ipp:","ipps:","iris:","iris.beep:","iris.xpc:","iris.xpcs:","iris.lwz:","jabber:","ldap:","mailto:","mid:","msrp:","msrps:","mtqp:","mupdate:","news:","nfs:","ni:","nih:","nntp:","opaquelocktoken:","pop:","pres:","reload:","rtsp:","rtsps:","rtspu:","service:","session:","shttp:","sieve:","sip:","sips:","sms:","snmp:","soap.beep:","soap.beeps:","stun:","stuns:","tag:","tel:","telnet:","tftp:","thismessage:","tn3270:","tip:","turn:","turns:","tv:","urn:","vemmi:","ws:","wss:","xcon:","xcon-userid:","xmlrpc.beep:","xmlrpc.beeps:","xmpp:","z39.50r:","z39.50s:","acr:","adiumxtra:","afp:","afs:","aim:","apt:","attachment:","aw:","barion:","beshare:","bitcoin:","bolo:","callto:","chrome:","chrome-extension:","com-eventbrite-attendee:","content:","cvs:","dlna-playsingle:","dlna-playcontainer:","dtn:","dvb:","ed2k:","facetime:","feed:","feedready:","finger:","fish:","gg:","git:","gizmoproject:","gtalk:","ham:","hcp:","icon:","ipn:","irc:","irc6:","ircs:","itms:","jar:","jms:","keyparc:","lastfm:","ldaps:","magnet:","maps:","market:","message:","mms:","ms-help:","ms-settings-power:","msnim:","mumble:","mvn:","notes:","oid:","palm:","paparazzi:","pkcs11:","platform:","proxy:","psyc:","query:","res:","resource:","rmi:","rsync:","rtmfp:","rtmp:","secondlife:","sftp:","sgn:","skype:","smb:","smtp:","soldat:","spotify:","ssh:","steam:","submit:","svn:","teamspeak:","teliaeid:","things:","udp:","unreal:","ut2004:","ventrilo:","view-source:","webcal:","wtai:","wyciwyg:","xfire:","xri:","ymsgr:","example:","ms-settings-cloudstorage:"};
    private String[] PREFIX = {"http://www.","https://www.","http://","https://","urn:uuid:"};
    private BluetoothAdapter mBluetoothAdapter;
    private NsdManager mNsdManager;
    private Context mContext;

    public AppRemoteViewsFactory(Context context) { mContext = context; }

    public void onCreate() { }

    public void onDestroy() {
        mWidgetItems.clear();
        try { mBluetoothAdapter.stopLeScan(mLeScanCallback); } catch(Exception e) { e.printStackTrace(); }
        try { mNsdManager.stopServiceDiscovery(mDiscoveryListener); } catch (Exception e) { e.printStackTrace(); }
    }

    public int getCount() { return mWidgetItems.size(); }

    public RemoteViews getViewAt(int position) {
        if (position >= mWidgetItems.size()) return null;
        WidgetItem wi = mWidgetItems.get(position);
        if (wi!=null) {
            RemoteViews rv = new RemoteViews(mContext.getPackageName(), R.layout.item);
            rv.setTextViewText(R.id.widget_item_name, wi.title);
            if (wi.ico.length() > 0) try {
                Bitmap b = BitmapFactory.decodeStream(new URL(wi.ico).openConnection().getInputStream());
                System.out.println("BITMAP " + b.getWidth() + "x" + b.getHeight() + " " + b.getDensity() + " (" + wi.ico + ")");
                rv.setImageViewBitmap(R.id.widget_item_app_icon,b);
            } catch (Exception e) { rv.setImageViewBitmap(R.id.widget_item_app_icon,BitmapFactory.decodeResource(mContext.getResources(), R.drawable.widget)); }
            try {
                Bundle extras = new Bundle();
                extras.putString(AppWidget.ITEM_EXTRA, "{'id':'" + wi.id + "','name':'" + wi.name + "','uri':'" + wi.uri.get(0) + "'}");
                rv.setOnClickFillInIntent(R.id.widget_item, new Intent().putExtras(extras));
            } catch (Exception e) { e.printStackTrace(); }
            return rv;
        } else return null;
    }

    public RemoteViews getLoadingView() { return null; }

    public int getViewTypeCount() { return 1; }

    public long getItemId(int position) { return position; }

    public boolean hasStableIds() { return true; }

    public void onDataSetChanged() {
        mBluetoothAdapter = ((BluetoothManager) mContext.getSystemService(Context.BLUETOOTH_SERVICE)).getAdapter();
        if (mBluetoothAdapter != null && mBluetoothAdapter.isEnabled()) {
            mBluetoothAdapter.startLeScan(mLeScanCallback);
            new Handler(Looper.getMainLooper()).postDelayed(new Runnable() { @Override public void run() { mBluetoothAdapter.stopLeScan(mLeScanCallback); } }, 15000);
        }
        mNsdManager = (NsdManager) mContext.getSystemService(Context.NSD_SERVICE);
        try{mNsdManager.discoverServices("_http._tcp.", NsdManager.PROTOCOL_DNS_SD, mDiscoveryListener);} catch (Exception e) { e.printStackTrace(); }
        new Handler(Looper.getMainLooper()).postDelayed(new Runnable() { @Override public void run() { try {mNsdManager.stopServiceDiscovery(mDiscoveryListener);} catch(Exception e) { e.printStackTrace(); } } }, 15000);
    }

    private BluetoothAdapter.LeScanCallback mLeScanCallback = new BluetoothAdapter.LeScanCallback() {
        @Override public void onLeScan(final BluetoothDevice device, int rssi, byte[] scanRecord) {
            try {
                String uri = "";
                int index = 0;
                while (index < scanRecord.length) {
                    int length = scanRecord[index++];
                    if (length == 0) break;
                    int type = scanRecord[index];
                    if (type == 0) break;
                    byte[] data = Arrays.copyOfRange(scanRecord, index + 1, index + length);
                    if (type==0x16 && (data[0]==(byte)0xAA||data[0]==(byte)0xD8) && data[1]==(byte)0xFE) uri = PREFIX[data[4]] + new String(Arrays.copyOfRange(data,5,data.length));
                    else if (type==0x24) uri = PRTCOL[data[0]] + new String(Arrays.copyOfRange(data,1,data.length));
                    index += length;
                }
                int gref = uri.indexOf("goo.gl/");
                if (gref>=0 && J2XUS.contains(uri.substring(gref+7,gref+13))) {
                    uri = uri.replace("goo.gl","j2x.us");
                    if (uri.substring(gref+7,gref+13).equals("2ImXWJ")) uri = "http://googledrive.com/host/0B15ruEDqdKuBZDdYcDh3Y2RpaDA"; //"https://rawgit.com/lab11/summon/master/user-interfaces/examples/blees-list/www/index.html";
                }
                if (uri.length()>0 && !itemExists(uri)) new DataFetch().execute(uri,device);
            } catch (Exception e) {e.printStackTrace();}
        }
    };

    public class DataFetch extends AsyncTask<Object, Void, WidgetItem> {
        protected WidgetItem doInBackground(Object... o) {
            WidgetItem wi = null;
            try {
                URL url = new URL("https://summon-caster.appspot.com/resolve-scan");
                BluetoothDevice device = (BluetoothDevice) o[1];

                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestProperty("Content-Type", "application/json");
                conn.setRequestProperty("Accept", "application/json");
                conn.setRequestMethod("POST");
                conn.setDoInput(true);
                conn.setDoOutput(true);
                conn.connect();

                OutputStreamWriter writer = new OutputStreamWriter(conn.getOutputStream());
                writer.write("{\"objects\":[{\"url\":\"" + o[0] + "\"}]}");
                writer.close();

                int responseCode=conn.getResponseCode();

                if (responseCode == HttpURLConnection.HTTP_OK) {
                    BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
                    StringBuffer sb = new StringBuffer("");
                    String line="";
                    while((line = in.readLine()) != null) sb.append(line);
                    in.close();
                    JSONObject meta = new JSONObject(sb.toString()).getJSONArray("metadata").getJSONObject(0);
                    if (!mWidgetItems.contains(meta.getString("url")) && !mWidgetItems.contains(o[0]))
                        wi = new WidgetItem(device.getAddress(),meta.getString("icon"),device.getName(),meta.getString("title"),new String[]{meta.getString("url"),(String)o[0]});
                    else if (!mWidgetItems.contains(o[0])) mWidgetItems.get(mWidgetItems.indexOf(meta.getString("url"))).uri.add((String)o[0]);
                }
                conn.disconnect();
            } catch(Exception e) { e.printStackTrace(); }
            return wi;
        }

        protected void onPostExecute(WidgetItem wi) {
            if (wi!=null) mWidgetItems.add(wi);
        }

    }
    private NsdManager.DiscoveryListener mDiscoveryListener = new NsdManager.DiscoveryListener() {
        @Override public void onServiceFound(NsdServiceInfo service) { try { mNsdManager.resolveService(service, new mResolveListener()); } catch (Exception e) {e.printStackTrace();} }
        @Override public void onStartDiscoveryFailed(String serviceType, int errorCode) { mNsdManager.stopServiceDiscovery(this); }
        @Override public void onStopDiscoveryFailed(String serviceType, int errorCode) { }
        @Override public void onServiceLost(NsdServiceInfo serviceInfo) { }
        @Override public void onDiscoveryStarted(String serviceType) { }
        @Override public void onDiscoveryStopped(String serviceType) { }
    };

    private class mResolveListener implements NsdManager.ResolveListener {
        @Override public void onServiceResolved(NsdServiceInfo nsi) {
            String uri = "http:/" + nsi.getHost().toString() + ":" + nsi.getPort();
            if (!itemExists(uri))
                mWidgetItems.add(new WidgetItem(nsi.getServiceName()+nsi.getServiceType()+".local",uri+"/favicon.ico",nsi.getServiceName(),nsi.getServiceName(),new String[]{uri}));
        }
        @Override public void onResolveFailed(NsdServiceInfo serviceInfo, int errorCode) { System.out.println("Failed to resolve " + serviceInfo.toString()); }
    };

    private boolean itemExists(String uri) {
        for(WidgetItem o : mWidgetItems) if(o != null && o.uri.contains(uri)) return true;
        return false;
    }
}

class WidgetItem {
    public String id="";
    public String ico="";
    public String name="";
    public String title="";
    public List<String> uri;
    public WidgetItem(String id, String ico, String name, String title, String[] uri) {
        this.id = id;
        this.ico = ico;
        this.uri = Arrays.asList(uri);
        this.name = (name==null) ? "Unnamed" : name;
        this.title = title;
    }
}