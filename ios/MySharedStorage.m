//
//  MySharedStorage.m
//  whipapp
//
//  Created by Christian Spilhere on 28/02/24.
//

#import "MySharedStorage.h"

@implementation MySharedStorage

RCT_EXPORT_MODULE();

// Gets value for key
RCT_EXPORT_METHOD(getValueForKey:(NSString *)key
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
  NSUserDefaults *userDefaults = [[NSUserDefaults alloc] initWithSuiteName:@"group.org.whipapp"];
  id value = [userDefaults objectForKey:key];
  
  if (value) {
    resolve(value);
  } else {
    NSError *error = [NSError errorWithDomain:@"MySharedStorage"
                                         code:1
                                     userInfo:@{NSLocalizedDescriptionKey: [NSString stringWithFormat:@"No value found for key %@", key]}];
    reject(@"no_value", @"No value found for key.", error);
  }
}

// Sets value for key
RCT_EXPORT_METHOD(setValue:(id)value
                  forKey:(NSString *)key
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    NSUserDefaults *userDefaults = [[NSUserDefaults alloc] initWithSuiteName:@"group.org.whipapp"];
    if (!userDefaults) {
        NSError *error = [NSError errorWithDomain:@"MySharedStorage"
                                             code:3
                                         userInfo:@{NSLocalizedDescriptionKey: @"Unable to access shared user defaults."}];
        reject(@"error_accessing_userDefaults", @"Unable to access shared user defaults.", error);
        return;
    }

    // Attempt to set the object
    @try {
        [userDefaults setObject:value forKey:key];
        // Assuming success as there's no direct method to validate save success for setObject:forKey:
        resolve(@(YES));
    }
    @catch (NSException *exception) {
        NSError *error = [NSError errorWithDomain:@"MySharedStorage"
                                             code:2
                                         userInfo:@{NSLocalizedDescriptionKey: [NSString stringWithFormat:@"Could not save value for key %@. Exception: %@", key, exception.reason]}];
        reject(@"error_saving", @"Could not save value for key.", error);
    }
}

RCT_EXPORT_METHOD(getAllValues:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    NSUserDefaults *userDefaults = [[NSUserDefaults alloc] initWithSuiteName:@"group.org.whipapp"];
    NSDictionary *allValues = [userDefaults dictionaryRepresentation];
    
    if (allValues) {
        resolve(allValues);
    } else {
        NSError *error = [NSError errorWithDomain:@"MySharedStorage"
                                             code:4
                                         userInfo:@{NSLocalizedDescriptionKey:@"Could not retrieve the storage data"}];
        reject(@"error_retrieving", @"Could not retrieve the storage data.", error);
    }
}

// Clears all values from the storage
RCT_EXPORT_METHOD(clearStorage:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
  NSUserDefaults *userDefaults = [[NSUserDefaults alloc] initWithSuiteName:@"group.org.whipapp"];
  
  NSDictionary *dict = [userDefaults dictionaryRepresentation];
  for (id key in dict) {
    [userDefaults removeObjectForKey:key];
  }
  BOOL didClear = [userDefaults synchronize]; // synchronize is deprecated and not needed, but added for clarity

  if (didClear) {
    resolve(@(YES));
  } else {
    NSError *error = [NSError errorWithDomain:@"MySharedStorage"
                                         code:3
                                     userInfo:@{NSLocalizedDescriptionKey:@"Could not clear the storage"}];
    reject(@"error_clearing", @"Could not clear the storage.", error);
  }
}

+ (BOOL)requiresMainQueueSetup {
  return YES;
}

@end

