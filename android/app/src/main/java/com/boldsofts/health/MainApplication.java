package com.boldsofts.health;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.tkporter.sendsms.SendSMSPackage;
import com.b8ne.RNPusherPushNotifications.RNPusherPushNotificationsPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.jadsonlourenco.RNShakeEvent.RNShakeEventPackage;
import com.sensors.RNSensorsPackage;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.rex.rnlocation.RNLocation;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import android.content.Intent; // <-- include if not already there
import com.tkporter.sendsms.SendSMSPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            SendSMSPackage.getInstance(),
            new RNPusherPushNotificationsPackage(),
            new VectorIconsPackage(),
            new RNLocation(),
            new RNShakeEventPackage(),
            new RNSensorsPackage(),
            new ReactNativeConfigPackage(),
            new MapsPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
