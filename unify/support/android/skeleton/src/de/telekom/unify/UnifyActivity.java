package de.telekom.unify;

import android.os.Bundle;

import com.phonegap.DroidGap;

public class UnifyActivity extends DroidGap {
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		super.loadUrl("file:///android_asset/www/phonegap.html");
	}
}
