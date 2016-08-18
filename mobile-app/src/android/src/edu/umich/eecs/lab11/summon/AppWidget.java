package edu.umich.eecs.lab11.summon;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.widget.RemoteViews;
import android.widget.Toast;

public class AppWidget extends AppWidgetProvider {
    public static final String LAUNCH_ACTION = "edu.umich.eecs.lab11.summon.LAUNCH_ACTION";
    public static final String ITEM_EXTRA = "edu.umich.eecs.lab11.summon.ITEM_EXTRA";
    private Intent alarm;

    @Override
    public void onReceive(Context context, Intent intent) {
        AppWidgetManager mgr = AppWidgetManager.getInstance(context);
        if (intent.getAction().equals(LAUNCH_ACTION)) {
            String viewIndex = intent.getStringExtra(ITEM_EXTRA);
            context.startActivity(new Intent(context,MainActivity.class).setFlags(Intent.FLAG_ACTIVITY_NEW_TASK).putExtra(ITEM_EXTRA,viewIndex));
        } else if (intent.getAction().equals(ITEM_EXTRA)) {
            ComponentName aw = new ComponentName(context, AppWidget.class);
            mgr.updateAppWidget(aw,new RemoteViews(context.getPackageName(),R.layout.appwidget));
            int appWidgetIds[] = mgr.getAppWidgetIds(aw);
            mgr.notifyAppWidgetViewDataChanged(appWidgetIds,R.id.grid_view);
        }
        super.onReceive(context, intent);
    }

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int i = 0; i < appWidgetIds.length; ++i) {
            Intent intent = new Intent(context, AppWidgetService.class);
            intent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, appWidgetIds[i]);
            intent.setData(Uri.parse(intent.toUri(Intent.URI_INTENT_SCHEME)));

            RemoteViews rv = new RemoteViews(context.getPackageName(), R.layout.appwidget);
            rv.setRemoteAdapter(appWidgetIds[i], R.id.grid_view, intent);
            rv.setEmptyView(R.id.grid_view, R.id.empty_view);
            rv.setOnClickPendingIntent(R.id.empty_view,PendingIntent.getActivity(context,0,new Intent(context,MainActivity.class),0));

            Intent launchIntent = new Intent(context,AppWidget.class);
            launchIntent.setAction(AppWidget.LAUNCH_ACTION);
            launchIntent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, appWidgetIds[i]);
            launchIntent.setData(Uri.parse(launchIntent.toUri(Intent.URI_INTENT_SCHEME)));
            PendingIntent launchPendingIntent = PendingIntent.getBroadcast(context, 0, launchIntent, PendingIntent.FLAG_UPDATE_CURRENT);
            rv.setPendingIntentTemplate(R.id.grid_view, launchPendingIntent);

            appWidgetManager.updateAppWidget(appWidgetIds[i], rv);
        }
        super.onUpdate(context, appWidgetManager, appWidgetIds);
    }

    @Override
    public void onEnabled(Context context) {
        alarm = new Intent(context, AppWidget.class).setAction(ITEM_EXTRA); // Set appwidget update action
        ((AlarmManager) context.getSystemService(context.ALARM_SERVICE)).setRepeating(AlarmManager.RTC, System.currentTimeMillis()+20000, 60000, PendingIntent.getBroadcast(context, 0, alarm, PendingIntent.FLAG_UPDATE_CURRENT)); // set repeat alarm
        super.onEnabled(context);
    }

    @Override
    public void onDisabled(Context context) {
//        ((AlarmManager) context.getSystemService(context.ALARM_SERVICE)).cancel(alarm);
        super.onDisabled(context);
    }
}
