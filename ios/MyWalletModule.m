//
//  WalletManager.m
//  whipapp
//
//  Created by Christian Spilhere on 10/01/24.
//

#import "MyWalletModule.h"
#import <React/RCTBridgeModule.h>
#import <WatchConnectivity/WatchConnectivity.h>
#import <ExternalAccessory/ExternalAccessory.h>

@implementation MyWalletModule {
    RCTPromiseResolveBlock resolveBlock;
    RCTPromiseRejectBlock rejectBlock;
    PKAddPaymentPassViewController *addPaymentPassController;
    NSString *currentCardId;
    BOOL hasListeners;
}

- (NSArray<NSString *> *)supportedEvents {
    return @[@"walletPresentation", @"walletDismissal"];
}

// Will be called when this module's first listener is added.
-(void)startObserving {
    hasListeners = YES;
}

// Will be called when this module's last listener is removed, or on dealloc.
-(void)stopObserving {
    hasListeners = NO;
}

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(provisionCardToDevice:(NSDictionary *)cardData resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {

    resolveBlock = resolve;
    rejectBlock = reject;
    currentCardId = cardData[@"cardId"];

    if (![PKAddPaymentPassViewController canAddPaymentPass]) {
        reject(@"wallet_error", @"Device does not support adding cards to Apple Wallet.", nil);
        return;
    }

    PKAddPaymentPassRequestConfiguration *configuration = [[PKAddPaymentPassRequestConfiguration alloc] initWithEncryptionScheme:PKEncryptionSchemeECC_V2];
  
    configuration.cardholderName = cardData[@"cardholderName"];
    configuration.primaryAccountSuffix = cardData[@"cardSuffix"];
    configuration.localizedDescription = cardData[@"description"];
    configuration.paymentNetwork = PKPaymentNetworkVisa;
  
    addPaymentPassController = [[PKAddPaymentPassViewController alloc] initWithRequestConfiguration:configuration delegate:self];

    if (!addPaymentPassController) {
        reject(@"wallet_error", @"Cannot initialize PKAddPaymentPassViewController.", nil);
        return;
    }

    dispatch_async(dispatch_get_main_queue(), ^{
        UIViewController *rootViewController = [UIApplication sharedApplication].delegate.window.rootViewController;
        [rootViewController presentViewController:self->addPaymentPassController animated:YES completion:nil];
    });
}

RCT_EXPORT_METHOD(provisionCardToDeviceWithPrimaryAccountIdentifier:(NSString *)primaryAccountIdentifier cardData:(NSDictionary *)cardData resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {

    resolveBlock = resolve;
    rejectBlock = reject;
    currentCardId = cardData[@"cardId"];

    if (![PKAddPaymentPassViewController canAddPaymentPass]) {
        reject(@"wallet_error", @"Device does not support adding cards to Apple Wallet.", nil);
        return;
    }

    PKAddPaymentPassRequestConfiguration *configuration = [[PKAddPaymentPassRequestConfiguration alloc] initWithEncryptionScheme:PKEncryptionSchemeECC_V2];
    
    configuration.primaryAccountIdentifier = primaryAccountIdentifier;
    configuration.cardholderName = cardData[@"cardholderName"];
    configuration.primaryAccountSuffix = cardData[@"last4Digits"];
    configuration.localizedDescription = cardData[@"description"];
    configuration.paymentNetwork = PKPaymentNetworkVisa;

    addPaymentPassController = [[PKAddPaymentPassViewController alloc] initWithRequestConfiguration:configuration delegate:self];
    if (!addPaymentPassController) {
        reject(@"wallet_error", @"Cannot initialize PKAddPaymentPassViewController.", nil);
        return;
    }

    dispatch_async(dispatch_get_main_queue(), ^{
        UIViewController *rootViewController = [UIApplication sharedApplication].delegate.window.rootViewController;
        [rootViewController presentViewController:self->addPaymentPassController animated:YES completion:nil];
    });
}

RCT_EXPORT_METHOD(activatePaymentPass:(NSString *)deviceAccountIdentifier activationData:(NSString *)activationData resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    if (![PKPassLibrary isPassLibraryAvailable]) {
        reject(@"wallet_error", @"Pass Library not available", nil);
        return;
    }

    PKPassLibrary *passLibrary = [[PKPassLibrary alloc] init];
    PKPaymentPass *targetPaymentPass = nil;

    // First, try to find the pass among payment passes
    NSArray<PKPass *> *paymentPasses = [passLibrary passesOfType:PKPassTypePayment];
    for (PKPass *pass in paymentPasses) {
        if ([pass isKindOfClass:[PKPaymentPass class]]) {
            PKPaymentPass *paymentPass = (PKPaymentPass *)pass;
            if ([paymentPass.deviceAccountIdentifier isEqualToString:deviceAccountIdentifier]) {
                targetPaymentPass = paymentPass;
                break;
            }
        }
    }

    // If not found, and if iOS 13.4 or later, try to find among secure element passes
    if (targetPaymentPass == nil && @available(iOS 13.4, *)) {
        NSArray<PKSecureElementPass *> *secureElementPasses = [passLibrary remoteSecureElementPasses];
        for (PKSecureElementPass *pass in secureElementPasses) {
            if ([pass isKindOfClass:[PKSecureElementPass class]] && [pass.deviceAccountIdentifier isEqualToString:deviceAccountIdentifier]) {
                targetPaymentPass = (PKPaymentPass *)pass; // Casting since PKSecureElementPass inherits from PKPaymentPass
                break;
            }
        }
    }

    if (targetPaymentPass == nil) {
        reject(@"no_pass", @"The specified pass was not found in Apple Wallet.", nil);
        return;
    }

    NSData *activationDataBytes = [[NSData alloc] initWithBase64EncodedString:activationData options:0];
    if (activationDataBytes == nil) {
        reject(@"invalid_data", @"Activation data is invalid.", nil);
        return;
    }

    [passLibrary activatePaymentPass:targetPaymentPass withActivationData:activationDataBytes completion:^(BOOL success, NSError * _Nullable error) {
        if (success) {
            resolve(@(YES));
        } else {
            reject(@"activation_failed", @"Failed to activate the payment pass.", error);
        }
    }];
}

RCT_EXPORT_METHOD(getAllPaymentPassesBySuffix:(NSString *)accountNumberSuffix resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    if (![PKPassLibrary isPassLibraryAvailable]) {
        reject(@"wallet_error", @"Pass Library not available", nil);
        return;
    }

    PKPassLibrary *passLibrary = [[PKPassLibrary alloc] init];
    NSMutableArray *allPasses = [NSMutableArray array];
    
    // Include payment passes
    NSArray<PKPaymentPass *> *paymentPasses = [passLibrary passesOfType:PKPassTypePayment];
    [allPasses addObjectsFromArray:paymentPasses];
    
    // Include remote secure element passes, if available (iOS 13.4+)
    if (@available(iOS 13.4, *)) {
        NSArray<PKSecureElementPass *> *secureElementPasses = [passLibrary remoteSecureElementPasses];
        [allPasses addObjectsFromArray:secureElementPasses];
    }
    
    // Include all passes (optional, based on your requirement)
    NSArray<PKPass *> *genericPasses = [passLibrary passes];
    [allPasses addObjectsFromArray:genericPasses];
    
    NSMutableArray *matchingCardDetails = [NSMutableArray array];
    
    for (PKPass *pass in allPasses) {
        NSString *accountNumberSuffixToCompare = @"";
        
        // Determine the type of pass and extract the account number suffix accordingly
        if ([pass isKindOfClass:[PKPaymentPass class]]) {
            PKPaymentPass *paymentPass = (PKPaymentPass *)pass;
            accountNumberSuffixToCompare = paymentPass.primaryAccountNumberSuffix;
        } else if ([pass isKindOfClass:[PKSecureElementPass class]] && [pass respondsToSelector:@selector(primaryAccountNumberSuffix)]) {
            PKSecureElementPass *secureElementPass = (PKSecureElementPass *)pass;
            accountNumberSuffixToCompare = secureElementPass.primaryAccountNumberSuffix;
        }
        
        // Add matching passes to the results
        if ([accountNumberSuffixToCompare isEqualToString:accountNumberSuffix]) {
            NSDictionary *cardDetails = [self extractDetailsFromPass:pass];
            [matchingCardDetails addObject:cardDetails];
        }
    }

    if (matchingCardDetails.count > 0) {
        resolve(matchingCardDetails);
    } else {
        resolve([NSNull null]);
    }
}

RCT_EXPORT_METHOD(getAllPaymentPassesRequiringActivation:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    if (![PKPassLibrary isPassLibraryAvailable]) {
        reject(@"wallet_error", @"Pass Library not available", nil);
        return;
    }

    PKPassLibrary *passLibrary = [[PKPassLibrary alloc] init];
    NSMutableArray *allPasses = [NSMutableArray array];
    
    // Include payment passes
    NSArray<PKPaymentPass *> *paymentPasses = [passLibrary passesOfType:PKPassTypePayment];
    [allPasses addObjectsFromArray:paymentPasses];
    
    // Include remote secure element passes, if available (iOS 13.4+)
    if (@available(iOS 13.4, *)) {
        NSArray<PKSecureElementPass *> *secureElementPasses = [passLibrary remoteSecureElementPasses];
        [allPasses addObjectsFromArray:secureElementPasses];
    }
    
    // Include all passes (optional, based on your requirement)
    NSArray<PKPass *> *genericPasses = [passLibrary passes];
    [allPasses addObjectsFromArray:genericPasses];
    
    NSMutableArray *matchingCardDetails = [NSMutableArray array];
    
    for (PKPass *pass in allPasses) {
        // Filter PKSecureElementPass instances by activation state
        if ([pass isKindOfClass:[PKSecureElementPass class]]) {
            PKSecureElementPass *secureElementPass = (PKSecureElementPass *)pass;
            if (secureElementPass.passActivationState == PKSecureElementPassActivationStateRequiresActivation) {
                NSDictionary *cardDetails = [self extractDetailsFromPass:secureElementPass];
                [matchingCardDetails addObject:cardDetails];
            }
        }
    }

    if (matchingCardDetails.count > 0) {
        resolve(matchingCardDetails);
    } else {
        resolve([NSNull null]);
    }
}

RCT_EXPORT_METHOD(isAppleWatchPaired:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    if ([WCSession isSupported]) {
        WCSession *session = [WCSession defaultSession];
        [session setDelegate:self];
        [session activateSession];
        
        if (session.isPaired) {
            // Apple Watch is paired
            resolve(@YES);
        } else {
            // Apple Watch is not paired
            resolve(@NO);
        }
    } else {
        // Watch Connectivity is not supported
        reject(@"error", @"Watch Connectivity not supported on this device", nil);
    }
}

- (void)sessionDidBecomeInactive:(WCSession *)session {
}

- (void)sessionDidDeactivate:(WCSession *)session {
}

- (void)sessionWatchStateDidChange:(WCSession *)session {
}

// Helper method to extract details from a pass
- (NSDictionary *)extractDetailsFromPass:(PKPass *)pass {
    NSDictionary *cardDetails = @{};
    if ([pass isKindOfClass:[PKPaymentPass class]]) {
        PKPaymentPass *paymentPass = (PKPaymentPass *)pass;
        cardDetails = @{
            @"deviceAccountIdentifier": paymentPass.deviceAccountIdentifier ?: @"",
            @"deviceAccountNumberSuffix": paymentPass.deviceAccountNumberSuffix ?: @"",
            @"deviceName": paymentPass.deviceName ?: @"Unknown Device",
            // Wrap the enum in NSNumber
            @"passActivationState": @(paymentPass.passActivationState),
            @"primaryAccountIdentifier": paymentPass.primaryAccountIdentifier ?: @"",
            @"primaryAccountNumberSuffix": paymentPass.primaryAccountNumberSuffix ?: @"",
            @"serialNumber": paymentPass.serialNumber,
        };
    } else if ([pass isKindOfClass:[PKSecureElementPass class]]) {
        PKSecureElementPass *secureElementPass = (PKSecureElementPass *)pass;
        cardDetails = @{
            @"deviceAccountIdentifier": secureElementPass.deviceAccountIdentifier ?: @"",
            @"deviceAccountNumberSuffix": secureElementPass.deviceAccountNumberSuffix ?: @"",
            @"deviceName": secureElementPass.deviceName ?: @"Unknown Device",
            // Wrap the enum in NSNumber
            @"passActivationState": @(secureElementPass.passActivationState),
            @"primaryAccountIdentifier": secureElementPass.primaryAccountIdentifier ?: @"",
            @"primaryAccountNumberSuffix": secureElementPass.primaryAccountNumberSuffix ?: @"",
            @"serialNumber": secureElementPass.serialNumber,
        };
    }
    return cardDetails;
}

#pragma mark - PKAddPaymentPassViewControllerDelegate

- (void)addPaymentPassViewController:(PKAddPaymentPassViewController *)controller
        generateRequestWithCertificateChain:(NSArray<NSData *> *)certificates
        nonce:(NSData *)nonce
        nonceSignature:(NSData *)nonceSignature
        completionHandler:(void (^)(PKAddPaymentPassRequest *))completionHandler {

    @try {
        NSString *urlString = [NSString stringWithFormat:@"https://addcardtoapplewallet-qsezx5zk6a-nw.a.run.app"];

        NSURL *url = [NSURL URLWithString:urlString];
      
        NSURL *absoluteURL = [url absoluteURL];
      
        NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:absoluteURL];

        [request setHTTPMethod:@"POST"];

        NSString *nonceHex = [self hexadecimalStringFromData:nonce];
        NSString *nonceSignatureHex = [self hexadecimalStringFromData:nonceSignature];

        NSDictionary *bodyData = @{
            @"cardId": currentCardId,
            @"certificates": [self convertDataArrayToJSONArray:certificates],
            @"nonce": nonceHex,
            @"nonceSignature": nonceSignatureHex
        };
      
        NSError *jsonError;
        NSData *jsonData = [NSJSONSerialization dataWithJSONObject:bodyData options:0 error:&jsonError];

        if (!jsonData) {
            rejectBlock(@"json_error", @"Error creating JSON payload", jsonError);
            return;
        }

        [request setHTTPBody:jsonData];
        [request setValue:@"application/json" forHTTPHeaderField:@"Content-Type"];
    
        NSLog(@"jsonData: %@", jsonData);

        NSURLSession *session = [NSURLSession sharedSession];
        NSURLSessionDataTask *dataTask = [session dataTaskWithRequest:request completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {
        
            if (error) {
                self->rejectBlock(@"api_error", @"Failed to call API", error);
                return;
            }

            NSError *jsonParsingError = nil;
            NSDictionary *responseDict = [NSJSONSerialization JSONObjectWithData:data options:0 error:&jsonParsingError];
        
            if (jsonParsingError) {
                self->rejectBlock(@"json_parsing_error", @"Failed to parse JSON", jsonParsingError);
                return;
            }

            NSLog(@"responseDict: %@", responseDict);
          
            PKAddPaymentPassRequest *addRequest = [[PKAddPaymentPassRequest alloc] init];

            NSData *activationDataBytes = [[NSData alloc] initWithBase64EncodedString:responseDict[@"activationData"] options:0];
            addRequest.activationData = activationDataBytes;

            NSData *ephemeralPublicKeyBytes = [[NSData alloc] initWithBase64EncodedString:responseDict[@"ephemeralPublicKey"] options:0];
            addRequest.ephemeralPublicKey = ephemeralPublicKeyBytes;

            NSData *encryptedPassDataBytes = [[NSData alloc] initWithBase64EncodedString:responseDict[@"encryptedPassData"] options:0];
            addRequest.encryptedPassData = encryptedPassDataBytes;

            completionHandler(addRequest);

        }];
        [dataTask resume];
        NSLog(@"end!!");
    }
    @catch (NSError *exception) {
        NSLog(@"Exception: %@", exception);
        self->rejectBlock(@"general_error", @"Error adding card to Apple Wallet", exception);
    }
}

- (NSArray *)convertDataArrayToJSONArray:(NSArray<NSData *> *)dataArray {
    NSMutableArray *jsonArray = [NSMutableArray arrayWithCapacity:dataArray.count];
    for (NSData *data in dataArray) {
        [jsonArray addObject:[data base64EncodedStringWithOptions:0]];
    }
    return jsonArray;
}

- (NSString *)hexadecimalStringFromData:(NSData *)data {
    const unsigned char *dataBytes = (const unsigned char *)[data bytes];
    NSMutableString *hexStr = [NSMutableString stringWithCapacity:[data length] * 2];
    for (int i = 0; i < [data length]; i++) {
        [hexStr appendFormat:@"%02x", dataBytes[i]];
    }
    return [hexStr copy];
}

- (void)addPaymentPassViewController:(PKAddPaymentPassViewController *)controller didFinishAddingPaymentPass:(PKPaymentPass *)pass error:(NSError *)error {
    if (error) {
        NSLog(@"didFinishAddingPaymentPass error: %@", error);
        rejectBlock(@"wallet_error", @"Error in adding card to Apple Wallet", error);
    } else {
        resolveBlock(@"Card added to wallet successfully");
    }
    [controller dismissViewControllerAnimated:YES completion:nil];
}

@end
