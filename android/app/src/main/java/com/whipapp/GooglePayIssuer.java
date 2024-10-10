package com.whipapp;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.Promise;

import java.util.Map;
import java.util.HashMap;

import android.util.Log;
import androidx.annotation.NonNull;
import android.util.Base64;
import android.content.Intent;
import android.app.Activity;
import com.google.android.gms.tapandpay.TapAndPay;
import com.google.android.gms.tapandpay.TapAndPayClient;
import com.google.android.gms.tapandpay.issuer.UserAddress;
import com.google.android.gms.tapandpay.issuer.PushTokenizeRequest;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.tasks.Task;
import static com.google.android.gms.tapandpay.TapAndPayStatusCodes.TAP_AND_PAY_ATTESTATION_ERROR;
import static com.google.android.gms.tapandpay.TapAndPayStatusCodes.TAP_AND_PAY_INVALID_TOKEN_STATE;
import static com.google.android.gms.tapandpay.TapAndPayStatusCodes.TAP_AND_PAY_NO_ACTIVE_WALLET;
import static com.google.android.gms.tapandpay.TapAndPayStatusCodes.TAP_AND_PAY_TOKEN_NOT_FOUND;
import static com.google.android.gms.tapandpay.TapAndPayStatusCodes.TAP_AND_PAY_UNAVAILABLE;

import java.nio.charset.Charset;
import androidx.annotation.NonNull;

public class GooglePayIssuer extends ReactContextBaseJavaModule {
  private static final String TAG = "GooglePayIssuer";
  private static final int REQUEST_CODE_PUSH_TOKENIZE = 3;

  private TapAndPayClient tapAndPayClient;

  GooglePayIssuer(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return "GooglePayIssuer";
  }

  @ReactMethod
  public void config() {
      tapAndPayClient = TapAndPay.getClient(getCurrentActivity());
  }

  @ReactMethod
  public void getActiveWalletId(final Promise promise) {
    try {
      tapAndPayClient
        .getActiveWalletId()
        .addOnCompleteListener(
          new OnCompleteListener<String>() {
            @Override
            public void onComplete(@NonNull Task<String> task) {
              if (task.isSuccessful()) {
                promise.resolve(task.getResult());
              } else {
                ApiException apiException = (ApiException) task.getException();
                promise.reject(apiException.getMessage());
              }
            }
          }
        );
    } catch (Exception e) {
      promise.reject(e.getMessage());
    }
  }

  @ReactMethod
  public void getStableHardwareId(final Promise promise) {
    try {
      tapAndPayClient
        .getStableHardwareId()
        .addOnCompleteListener(
          new OnCompleteListener<String>() {
            @Override
            public void onComplete(@NonNull Task<String> task) {
              if (task.isSuccessful()) {
                promise.resolve(task.getResult());
              } else {
                ApiException apiException = (ApiException) task.getException();
                promise.reject(apiException.getMessage());
              }
            }
          }
        );
    } catch (Exception e) {
      promise.reject(e.getMessage());
    }
  }

  @ReactMethod
  public void getIntentData(final Promise promise) {
    try {
      String decodedData = "";
      Intent intent = getCurrentActivity().getIntent();
      if (intent != null) {
        String data = intent.getStringExtra(Intent.EXTRA_TEXT);
        if (data != null) {
          decodedData = new String(Base64.decode(data, Base64.DEFAULT));
        }
      }
      promise.resolve(decodedData);
    } catch (Exception e) {
      promise.reject(e.getMessage());
    }
  }

  @ReactMethod
  public void sendResult(String result, String code, final Promise promise) {
    try {
      Intent resultIntent = new Intent();
      resultIntent.putExtra("BANKING_APP_ACTIVATION_RESPONSE", result);
      if (code != null) {
        resultIntent.putExtra("BANKING_APP_ACTIVATION_CODE", code);
      }

      Activity activity = getCurrentActivity();
      activity.setResult(Activity.RESULT_OK, resultIntent);
      activity.finish();

      promise.resolve(true);
    } catch (Exception e) {
      promise.reject(e.getMessage());
    }
  }

  @ReactMethod
  public void pushProvision(String opc, String tsp, String clientName, String lastDigits, ReadableMap address, final Promise promise) {
    try {
      int cardNetwork = (tsp.equals("VISA")) ? TapAndPay.CARD_NETWORK_VISA : TapAndPay.CARD_NETWORK_MASTERCARD;
      int tokenServiceProvider = (tsp.equals("VISA")) ? TapAndPay.TOKEN_PROVIDER_VISA : TapAndPay.TOKEN_PROVIDER_MASTERCARD;

      UserAddress userAddress = UserAddress.newBuilder()
              .setName(address.getString("name"))
              .setAddress1(address.getString("address"))
              .setLocality(address.getString("locality"))
              .setAdministrativeArea(address.getString("administrativeArea"))
              .setCountryCode(address.getString("countryCode"))
              .setPostalCode(address.getString("postalCode"))
              .setPhoneNumber(address.getString("phoneNumber"))
              .build();

      PushTokenizeRequest pushTokenizeRequest = new PushTokenizeRequest.Builder()
              .setOpaquePaymentCard(opc.getBytes(Charset.forName("UTF-8")))
              .setNetwork(cardNetwork)
              .setTokenServiceProvider(tokenServiceProvider)
              .setDisplayName(clientName)
              .setLastDigits(lastDigits)
              .setUserAddress(userAddress)
              .build();

      tapAndPayClient.pushTokenize(getCurrentActivity(), pushTokenizeRequest, REQUEST_CODE_PUSH_TOKENIZE);
      promise.resolve(true);
    } catch (Exception e) {
      promise.reject(e.getMessage());
    }
  }
}
