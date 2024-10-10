//
//  WalletManager.h
//  whipapp
//
//  Created by Christian Spilhere on 10/01/24.
//

#import <React/RCTBridgeModule.h>
#import <PassKit/PassKit.h>
#import "RCTEventEmitter.h"
#import <WatchConnectivity/WatchConnectivity.h>

@interface MyWalletModule : RCTEventEmitter <RCTBridgeModule, PKAddPaymentPassViewControllerDelegate, WCSessionDelegate>

@end
