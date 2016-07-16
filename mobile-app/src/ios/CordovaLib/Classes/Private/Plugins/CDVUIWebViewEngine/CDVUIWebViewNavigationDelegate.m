/*
 Licensed to the Apache Software Foundation (ASF) under one
 or more contributor license agreements.  See the NOTICE file
 distributed with this work for additional information
 regarding copyright ownership.  The ASF licenses this file
 to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance
 with the License.  You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License.
 */

#import "CDVUIWebViewNavigationDelegate.h"
#import <Cordova/CDVViewController.h>
#import <Cordova/CDVCommandDelegateImpl.h>
#import <Cordova/CDVUserAgentUtil.h>
#import <objc/message.h>

@implementation CDVUIWebViewNavigationDelegate

NSString *deviceId = @"";
NSString *deviceName = @"";
UINavigationBar *navbar;
UIWebView *wv;
int cacheSizeMemory = 8 * 1024 * 1024; // 8MB
int cacheSizeDisk = 32 * 1024 * 1024; // 32MB
bool caching = true;

- (instancetype)initWithEnginePlugin:(CDVPlugin*)theEnginePlugin
{
    self = [super init];
    if (self) {
        self.enginePlugin = theEnginePlugin;
    }

    navbar = [[UINavigationBar alloc]initWithFrame:CGRectMake(0, 0, [UIScreen mainScreen].bounds.size.width, 20)];
    navbar.translucent = NO;
    navbar.barTintColor = [UIColor colorWithRed:0.94901960784 green:0.64705882352 blue:0.02745098039 alpha:1];
    navbar.titleTextAttributes = [NSDictionary dictionaryWithObjectsAndKeys:[UIFont systemFontOfSize:12 weight:UIFontWeightSemibold],NSFontAttributeName, [UIColor whiteColor], NSForegroundColorAttributeName, nil];
    [navbar setTitleVerticalPositionAdjustment:10.5 forBarMetrics:UIBarMetricsDefault];

    return self;
}

/**
 When web application loads Add stuff to the DOM, mainly the user-defined settings from the Settings.plist file, and
 the device's data such as device ID, platform version, etc.
 */
- (void)webViewDidStartLoad:(UIWebView*)theWebView
{
    NSLog(@"Resetting plugins due to page load.");
    CDVViewController* vc = (CDVViewController*)self.enginePlugin.viewController;

    [vc.commandQueue resetRequestId];
    [[NSNotificationCenter defaultCenter] postNotification:[NSNotification notificationWithName:CDVPluginResetNotification object:self.enginePlugin.webView]];
}

/**
 Called when the webview finishes loading.  This stops the activity view.
 */
- (void)webViewDidFinishLoad:(UIWebView*)theWebView
{
    NSLog(@"Finished load of: %@", theWebView.request.URL);
    CDVViewController* vc = (CDVViewController*)self.enginePlugin.viewController;

    // It's safe to release the lock even if this is just a sub-frame that's finished loading.
    [CDVUserAgentUtil releaseLock:vc.userAgentLockToken];

    /*
     * Hide the Top Activity THROBBER in the Battery Bar
     */
    [[UIApplication sharedApplication] setNetworkActivityIndicatorVisible:NO];

    [[NSNotificationCenter defaultCenter] postNotification:[NSNotification notificationWithName:CDVPageDidLoadNotification object:self.enginePlugin.webView]];

    theWebView.backgroundColor = [UIColor blackColor];
    theWebView.scrollView.showsHorizontalScrollIndicator = NO;
    theWebView.scrollView.showsVerticalScrollIndicator = NO;
    [theWebView stringByEvaluatingJavaScriptFromString:[NSString stringWithFormat:@"window.gateway={getDeviceId:function(){return '%@'},getDeviceName:function(){return '%@'},cache:function(e){t.setAttribute('src','gateway:'+JSON.stringify({'cache':e}))},setDeviceAdvertisement:function(e){t.setAttribute('src','gateway:'+JSON.stringify(e))}}; t=document.createElement('iframe'); t.setAttribute('style','display:none'); document.documentElement.appendChild(t);",deviceId,deviceName]];
    if ([theWebView.request.URL.absoluteString hasPrefix:@"file:"]&&[theWebView.request.URL.absoluteString hasSuffix:@".app/www/index.html"]) {
        navbar.window.windowLevel = UIWindowLevelStatusBar-1;
        [navbar removeFromSuperview];
    } else [theWebView stringByEvaluatingJavaScriptFromString:[NSString stringWithContentsOfFile:[[NSBundle mainBundle] pathForResource:@"www/summon.ios" ofType:@"js"] encoding:NSUTF8StringEncoding error:nil]];
    [self setNavTitle:[NSString stringWithFormat:@"%@ (%@)",[theWebView stringByEvaluatingJavaScriptFromString:@"document.title"],deviceName]];
}

- (void)webView:(UIWebView*)theWebView didFailLoadWithError:(NSError*)error
{
    CDVViewController* vc = (CDVViewController*)self.enginePlugin.viewController;

    [CDVUserAgentUtil releaseLock:vc.userAgentLockToken];

    NSString* message = [NSString stringWithFormat:@"Failed to load webpage with error: %@", [error localizedDescription]];
    NSLog(@"%@", message);

    NSURL* errorUrl = vc.errorURL;
    if (errorUrl) {
        errorUrl = [NSURL URLWithString:[NSString stringWithFormat:@"?error=%@", [message stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding]] relativeToURL:errorUrl];
        NSLog(@"%@", [errorUrl absoluteString]);
        [theWebView loadRequest:[NSURLRequest requestWithURL:errorUrl]];
    }
    
    if ([theWebView.request.URL.absoluteString hasPrefix:@"file:"]&&[theWebView.request.URL.absoluteString hasSuffix:@".app/www/index.html"]) {
        navbar.window.windowLevel = UIWindowLevelStatusBar-1;
        [navbar removeFromSuperview];
    }
}

- (BOOL)defaultResourcePolicyForURL:(NSURL*)url
{
    /*
     * If a URL is being loaded that's a file url, just load it internally
     */
    if ([url isFileURL]) {
        return YES;
    }
    
    return NO;
}

- (BOOL)webView:(UIWebView*)theWebView shouldStartLoadWithRequest:(NSURLRequest*)request navigationType:(UIWebViewNavigationType)navigationType
{
    wv = theWebView;
    NSString *urlString = [[request URL] absoluteString];
    if ([urlString hasPrefix:@"gateway:"]) {
        NSString *jsonString = [[[urlString componentsSeparatedByString:@"gateway:"] lastObject] stringByReplacingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
        NSData *jsonData = [jsonString dataUsingEncoding:NSUTF8StringEncoding];
        NSError *error;
        id parameters = [NSJSONSerialization JSONObjectWithData:jsonData options:NSJSONReadingMutableContainers error:&error];
        if (!error) {
            if (parameters[@"cache"]!=nil) {
                caching =[parameters[@"cache"] boolValue];
                if (caching) [NSURLCache setSharedURLCache:[[NSURLCache alloc] initWithMemoryCapacity:cacheSizeMemory diskCapacity:cacheSizeDisk diskPath:@"nsurlcache"]];
                else [NSURLCache setSharedURLCache:[[NSURLCache alloc] initWithMemoryCapacity:0 diskCapacity:0 diskPath:nil]];
            } else {
                deviceId = [parameters valueForKey:@"id"];
                deviceName = [parameters valueForKey:@"name"];
            }
        }
        return NO;
    } else if ([urlString hasPrefix:@"http:"]||[urlString hasPrefix:@"https:"]||([urlString hasPrefix:@"file:"]&&[urlString hasSuffix:@"temp/www/index.html"])) {
        [[[UIApplication sharedApplication] keyWindow] addSubview:navbar];
        [self setNavTitle:urlString];
        navbar.window.windowLevel = UIWindowLevelStatusBar+1;
    }
    theWebView.scalesPageToFit = YES;
    if (!caching) request = [NSURLRequest requestWithURL:request.URL cachePolicy:NSURLRequestReloadIgnoringLocalCacheData timeoutInterval:60000];
    [theWebView.window.rootViewController.view bringSubviewToFront:theWebView];
    
    NSURL* url = [request URL];
    CDVViewController* vc = (CDVViewController*)self.enginePlugin.viewController;

    /*
     * Execute any commands queued with cordova.exec() on the JS side.
     * The part of the URL after gap:// is irrelevant.
     */
    if ([[url scheme] isEqualToString:@"gap"]) {
        [vc.commandQueue fetchCommandsFromJs];
        // The delegate is called asynchronously in this case, so we don't have to use
        // flushCommandQueueWithDelayedJs (setTimeout(0)) as we do with hash changes.
        [vc.commandQueue executePending];
        return NO;
    }

    /*
     * Give plugins the chance to handle the url
     */
    BOOL anyPluginsResponded = NO;
    BOOL shouldAllowRequest = NO;
    
    for (NSString* pluginName in vc.pluginObjects) {
        CDVPlugin* plugin = [vc.pluginObjects objectForKey:pluginName];
        SEL selector = NSSelectorFromString(@"shouldOverrideLoadWithRequest:navigationType:");
        if ([plugin respondsToSelector:selector]) {
            anyPluginsResponded = YES;
            shouldAllowRequest = (((BOOL (*)(id, SEL, id, int))objc_msgSend)(plugin, selector, request, navigationType));
            if (!shouldAllowRequest) {
                break;
            }
        }
    }
    
    if (anyPluginsResponded) {
        return shouldAllowRequest;
    }

    /*
     * Handle all other types of urls (tel:, sms:), and requests to load a url in the main webview.
     */
    BOOL shouldAllowNavigation = [self defaultResourcePolicyForURL:url];
    if (shouldAllowNavigation) {
        return YES;
    } else {
        [[NSNotificationCenter defaultCenter] postNotification:[NSNotification notificationWithName:CDVPluginHandleOpenURLNotification object:url]];
    }
    
    return NO;
}

- (void) setNavTitle:(NSString*)title {
    UIBarButtonItem *button = [[UIBarButtonItem alloc] initWithTitle:@" \u25C0\uFE0E Back" style:UIBarButtonItemStylePlain target:self action:@selector(back)];
    [navbar pushNavigationItem:[[UINavigationItem alloc] initWithTitle:title] animated:NO];
    navbar.topItem.leftBarButtonItem = button;
    [button setTitleTextAttributes:[NSDictionary dictionaryWithObjectsAndKeys:[UIFont systemFontOfSize:12 weight:UIFontWeightRegular],NSFontAttributeName, [UIColor whiteColor], NSForegroundColorAttributeName, nil] forState:UIControlStateNormal];
    [button setTitlePositionAdjustment:UIOffsetMake(0, 10.5) forBarMetrics:UIBarMetricsDefault];
}

-(void) back {
    [wv goBack];
}


@end
