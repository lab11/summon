package edu.umich.eecs.lab11.eddystone;

import android.content.Context;
import android.util.AttributeSet;

public class ListPreference extends android.preference.ListPreference {

    public ListPreference(Context context, AttributeSet attrs, int defStyle) { super(context, attrs, defStyle); }

    public ListPreference(Context context, AttributeSet attrs) { super(context, attrs); }

    public ListPreference(Context context) { super(context); }

    @Override
    public CharSequence getSummary() {
        return (super.getSummary() != null) ? String.format(super.getSummary().toString(), getEntry()) : null;
    }

}
