package edu.umich.eecs.lab11.eddystone;

import android.content.Context;
import android.text.TextUtils;
import android.util.AttributeSet;

public class EditTextPreference extends android.preference.EditTextPreference {

    public EditTextPreference(Context context, AttributeSet attrs, int defStyle) { super(context, attrs, defStyle); }

    public EditTextPreference(Context context, AttributeSet attrs) { super(context, attrs); }

    public EditTextPreference(Context context) { super(context); }

    @Override
    public CharSequence getSummary() {
        String text = getText();
        if (TextUtils.isEmpty(text)) return getEditText().getHint();
        else {
            CharSequence summary = super.getSummary();
            return (summary != null) ? String.format(summary.toString(), text) : null;
        }
    }

}
