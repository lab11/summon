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
    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int i = 0; i < appWidgetIds.length; ++i) {
            Intent launchIntent = new Intent(context,AppWidget.class);
            PendingIntent launchPendingIntent = PendingIntent.getBroadcast(context, 0, launchIntent, PendingIntent.FLAG_UPDATE_CURRENT);

            RemoteViews rv = new RemoteViews(context.getPackageName(), R.layout.appwidget);
            rv.setPendingIntentTemplate(R.id.grid_view, launchPendingIntent);

            appWidgetManager.updateAppWidget(appWidgetIds[i], rv);
        }
        super.onUpdate(context, appWidgetManager, appWidgetIds);
    }
}
