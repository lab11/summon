/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
 */

package edu.umich.eecs.lab11.summon;

import android.app.ActivityManager.TaskDescription;
import android.content.ComponentName;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.graphics.drawable.BitmapDrawable;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.util.Base64;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;

import org.apache.cordova.CordovaActivity;
import org.json.JSONArray;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.util.Arrays;
import java.util.List;

public class MainActivity extends CordovaActivity {
    private String deviceAdvertisement = "";
    private String js = "";
    private WebView wv;

    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        super.init();
        wv = ((WebView) appView.getEngine().getView());
        wv.addJavascriptInterface(new JavaScriptInterface(getPackageManager()), "gateway");
        wv.getSettings().setJavaScriptEnabled(true);
        wv.getSettings().setSupportMultipleWindows(false);
        wv.getSettings().setNeedInitialFocus(false);
        wv.getSettings().setSupportZoom(false);
        wv.getSettings().setAllowFileAccess(true);
        wv.getSettings().setAppCacheEnabled(true);
        wv.getSettings().setCacheMode(WebSettings.LOAD_DEFAULT);
        wv.getSettings().setAppCachePath(wv.getContext().getCacheDir().getAbsolutePath());
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) setTaskDescription(new TaskDescription(null, null, Color.parseColor("#FFC107")));
        loadUrl(launchUrl);
        try {
            InputStream is = getAssets().open("www/summon.android.js");
            byte[] buffer = new byte[is.available()];
            is.read(buffer);
            is.close();
            js = "javascript:(function(){ " +
                    "s=document.createElement('script');" +
                    "s.innerHTML = atob('" + Base64.encodeToString(buffer,Base64.NO_WRAP) + "'); " +
                    "document.querySelector('head').appendChild(s); " +
                    "summon.gateway = gateway;" +
                "})()";
        } catch(Exception e){e.printStackTrace();}
    }

    @Override
    public Object onMessage(String id, Object data) {
        if ("onPageFinished".equals(id) && !((WebView) appView.getEngine().getView()).getUrl().startsWith("file://")) loadUrl(js);
        return super.onMessage(id, data);
    }

    public class JavaScriptInterface {
        private PackageManager pm;
        private List<String> browsers = Arrays.asList("com.android.browser","com.android.chrome","com.android.google.browser","org.mozilla.firefox","com.opera.mini.android");

        JavaScriptInterface(PackageManager p) { pm = p; }

        @JavascriptInterface
        public String getDeviceId(){ try {return (new JSONObject(deviceAdvertisement).getString("id"));} catch (Exception e) {return "";} }

        @JavascriptInterface
        public String getDeviceUri(){ try {return (new JSONObject(deviceAdvertisement).getString("uri"));} catch (Exception e) {return "";} }

        @JavascriptInterface
        public String getDeviceName() { try {return (new JSONObject(deviceAdvertisement).getString("name"));} catch (Exception e) {return "";} }

        @JavascriptInterface
        public String getDeviceAdvertisement() { return deviceAdvertisement;  }

        @JavascriptInterface
        public void setDeviceAdvertisement(String s) { deviceAdvertisement = s; }

        @JavascriptInterface
        public void cache(final String s) { wv.post(new Runnable(){@Override public void run(){ wv.getSettings().setCacheMode(s.equals("true") ? WebSettings.LOAD_DEFAULT : WebSettings.LOAD_NO_CACHE); }}); }

        @JavascriptInterface
        public void go(String s, String p, String n) {
            Intent intent = new Intent(Intent.ACTION_VIEW,Uri.parse(s));
            try { intent.setComponent(new ComponentName(p,n)); } catch (Exception e) {}
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            startActivity(intent);
        }

        @JavascriptInterface
        public String checkApps(String s) {
            JSONArray apps = new JSONArray();
            for (ResolveInfo ri : pm.queryIntentActivities(new Intent(Intent.ACTION_VIEW, Uri.parse(s)), 0))
                if (!browsers.contains(ri.activityInfo.packageName))
                    try {
                        ByteArrayOutputStream baos = new ByteArrayOutputStream();
                        ((BitmapDrawable) ri.activityInfo.loadIcon(pm)).getBitmap().compress(Bitmap.CompressFormat.PNG, 100, baos);
                        JSONObject jo = new JSONObject("{'package':'"+ri.activityInfo.packageName+"','activity':'"+ri.activityInfo.name+"','name':'"+ri.loadLabel(pm)+"'}");
                        jo.put("icon", "data:image/png;base64," + Base64.encodeToString(baos.toByteArray(),Base64.DEFAULT));
                        apps.put(jo);
                    } catch (Exception e) {}
            return apps.toString();
        }
    }
}
