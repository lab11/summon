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

import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ResolveInfo;
import android.net.Uri;
import android.os.Bundle;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;

import org.apache.cordova.CordovaActivity;
import org.json.JSONArray;
import org.json.JSONObject;

import java.util.Arrays;
import java.util.List;

public class MainActivity extends CordovaActivity
{
    private String deviceAdvertisement = "";
    private WebView wv;
//    private float lat;
//    private float lon;

    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        super.init();
        wv = ((WebView) appView.getEngine().getView());
        wv.addJavascriptInterface(new JavaScriptInterface(this), "gateway");
        wv.getSettings().setJavaScriptEnabled(true);
        wv.getSettings().setSupportMultipleWindows(false);
        wv.getSettings().setNeedInitialFocus(false);
        wv.getSettings().setSupportZoom(false);
        wv.getSettings().setAllowFileAccess(true);
        wv.getSettings().setAppCacheEnabled(true);
        wv.getSettings().setCacheMode(WebSettings.LOAD_DEFAULT);
        String cachePath = wv.getContext().getCacheDir().getAbsolutePath();
        wv.getSettings().setAppCachePath(cachePath);
//        lat=0;lon=0;
        // Set by <content src="index.html" /> in config.xml
        loadUrl(launchUrl);
    }

    public class JavaScriptInterface {
        private Context mContext;
        private List<String> browsers = Arrays.asList("com.android.browser","com.android.chrome","com.android.google.browser","org.mozilla.firefox","com.opera.mini.android");

        JavaScriptInterface(Context c) { mContext = c; }

        @JavascriptInterface
        public String getDeviceId(){
//            wv.post(new Runnable() { @Override public void run() { loadUrl("javascript:a=document.createElement('div');t=document.createTextNode('Bob & Betty Beyster Building ("+lat+","+lon+")'); a.appendChild(t); a.setAttribute('style','padding:5px; margin:0; background:#eee;color:#666;font-size:20px !important;font-family:sans-serif-thin !important;position:fixed;bottom:0;text-align:center;vertical-align:middle;width:100%; white-space: nowrap; overflow: hidden; text-overflow:ellipsis;'); document.body.appendChild(a);"); } });
            try {return (new JSONObject(deviceAdvertisement).getString("id"));} catch (Exception e) {return "";} }

        @JavascriptInterface
        public String getDeviceName() { try {return (new JSONObject(deviceAdvertisement).getString("name"));} catch (Exception e) {return "";} }

        @JavascriptInterface
        public String getDeviceAdvertisement() { return deviceAdvertisement;  }

        @JavascriptInterface
        public void setDeviceAdvertisement(String s) { deviceAdvertisement = s; }

//        @JavascriptInterface
//        public void setLocation(float t, float n) {lat=t; lon=n; }

        @JavascriptInterface
        public void go(String s) { loadUrl(s); }

        @JavascriptInterface
        public void cache(final String s) { wv.post(new Runnable() {
            @Override
            public void run() {
                wv.getSettings().setCacheMode(s.equals("true") ? WebSettings.LOAD_DEFAULT : WebSettings.LOAD_NO_CACHE);
            }
        }); }

        @JavascriptInterface
        public void go(String s, String p, String n) {
            Intent intent = new Intent(Intent.ACTION_VIEW,Uri.parse(s));
            try { intent.setComponent(new ComponentName(p,n)); } catch (Exception e) {}
            startActivity(intent);
        }

        @JavascriptInterface
        public String checkApps(String s) {
            String apps = "";
            for (ResolveInfo ri : mContext.getPackageManager().queryIntentActivities(new Intent(Intent.ACTION_VIEW,Uri.parse(s)),0))
                if (!browsers.contains(ri.activityInfo.packageName))
                    apps += ",{\"package\":\"" + ri.activityInfo.packageName + "\",\"activity\":\"" + ri.activityInfo.name + "\",\"name\":\"" + ri.activityInfo.applicationInfo.loadLabel(mContext.getPackageManager()) + "\",\"icon\":\"" + ri.activityInfo.applicationInfo.loadIcon(mContext.getPackageManager()).toString() + "\"}";
            return "[" + (apps.length()>0 ? apps.substring(1) : "") + "]";
        }
    }

}
