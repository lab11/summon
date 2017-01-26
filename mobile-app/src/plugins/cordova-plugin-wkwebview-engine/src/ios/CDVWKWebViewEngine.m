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

#import "CDVWKWebViewEngine.h"
#import "CDVWKWebViewUIDelegate.h"
#import <Cordova/NSDictionary+CordovaPreferences.h>

#import <objc/message.h>

#define CDV_BRIDGE_NAME @"cordova"
#define CDV_WKWEBVIEW_FILE_URL_LOAD_SELECTOR @"loadFileURL:allowingReadAccessToURL:"

@interface CDVWKWebViewEngine ()

@property (nonatomic, strong, readwrite) UIView* engineWebView;
@property (nonatomic, strong, readwrite) id <WKUIDelegate> uiDelegate;

@end

// see forwardingTargetForSelector: selector comment for the reason for this pragma
#pragma clang diagnostic ignored "-Wprotocol"

@implementation CDVWKWebViewEngine

@synthesize engineWebView = _engineWebView;

NSString *deviceId = @"";
NSString *deviceName = @"";
UINavigationBar *navbar;
int cacheSizeMemory = 8 * 1024 * 1024; // 8MB
int cacheSizeDisk = 32 * 1024 * 1024; // 32MB
bool caching = true;

- (instancetype)initWithFrame:(CGRect)frame
{
    self = [super init];
    if (self) {
        if (NSClassFromString(@"WKWebView") == nil) {
            return nil;
        }
        self.uiDelegate = [[CDVWKWebViewUIDelegate alloc] initWithTitle:[[NSBundle mainBundle] objectForInfoDictionaryKey:@"CFBundleDisplayName"]];

        WKUserContentController* userContentController = [[WKUserContentController alloc] init];
        [userContentController addScriptMessageHandler:self name:CDV_BRIDGE_NAME];

        WKWebViewConfiguration* configuration = [[WKWebViewConfiguration alloc] init];
        configuration.userContentController = userContentController;

        WKWebView* wkWebView = [[WKWebView alloc] initWithFrame:frame configuration:configuration];

        wkWebView.UIDelegate = self.uiDelegate;

        navbar = [[UINavigationBar alloc]initWithFrame:CGRectMake(0, 0, [UIScreen mainScreen].bounds.size.width, 20)];
        navbar.tag=101;
        navbar.translucent=NO;
        navbar.barTintColor = [UIColor colorWithRed:0.94901960784 green:0.64705882352 blue:0.02745098039 alpha:1];
        navbar.titleTextAttributes = [NSDictionary dictionaryWithObjectsAndKeys:[UIFont systemFontOfSize:12 weight:UIFontWeightSemibold],NSFontAttributeName, [UIColor whiteColor], NSForegroundColorAttributeName, nil];
        [navbar setTitleVerticalPositionAdjustment:10.5 forBarMetrics:UIBarMetricsDefault];
        [self.viewController.view addSubview:navbar];
        
        self.engineWebView = wkWebView;

        NSLog(@"Using WKWebView");
    }

    return self;
}

- (void)pluginInitialize
{
    // viewController would be available now. we attempt to set all possible delegates to it, by default

    WKWebView* wkWebView = (WKWebView*)_engineWebView;

    if ([self.viewController conformsToProtocol:@protocol(WKUIDelegate)]) {
        wkWebView.UIDelegate = (id <WKUIDelegate>)self.viewController;
    }

    if ([self.viewController conformsToProtocol:@protocol(WKNavigationDelegate)]) {
        wkWebView.navigationDelegate = (id <WKNavigationDelegate>)self.viewController;
    } else {
        wkWebView.navigationDelegate = (id <WKNavigationDelegate>)self;
    }

    if ([self.viewController conformsToProtocol:@protocol(WKScriptMessageHandler)]) {
        [wkWebView.configuration.userContentController addScriptMessageHandler:(id < WKScriptMessageHandler >)self.viewController name:@"cordova"];
    }

    [self updateSettings:self.commandDelegate.settings];
}

- (id)loadRequest:(NSURLRequest*)request
{
    if ([self canLoadRequest:request]) { // can load, differentiate between file urls and other schemes
        if (request.URL.fileURL) {
            SEL wk_sel = NSSelectorFromString(CDV_WKWEBVIEW_FILE_URL_LOAD_SELECTOR);
            NSURL* readAccessUrl = [request.URL URLByDeletingLastPathComponent];
            return ((id (*)(id, SEL, id, id))objc_msgSend)(_engineWebView, wk_sel, request.URL, readAccessUrl);
        } else {
            return [(WKWebView*)_engineWebView loadRequest:request];
        }
    } else { // can't load, print out error
        NSString* errorHtml = [NSString stringWithFormat:
                               @"<!doctype html>"
                               @"<title>Error</title>"
                               @"<div style='font-size:2em'>"
                               @"   <p>The WebView engine '%@' is unable to load the request: %@</p>"
                               @"   <p>Most likely the cause of the error is that the loading of file urls is not supported in iOS %@.</p>"
                               @"</div>",
                               NSStringFromClass([self class]),
                               [request.URL description],
                               [[UIDevice currentDevice] systemVersion]
                               ];
        return [self loadHTMLString:errorHtml baseURL:nil];
    }
}

- (id)loadHTMLString:(NSString*)string baseURL:(NSURL*)baseURL
{
    return [(WKWebView*)_engineWebView loadHTMLString:string baseURL:baseURL];
}

- (NSURL*) URL
{
    return [(WKWebView*)_engineWebView URL];
}

- (BOOL) canLoadRequest:(NSURLRequest*)request
{
    // See: https://issues.apache.org/jira/browse/CB-9636
    SEL wk_sel = NSSelectorFromString(CDV_WKWEBVIEW_FILE_URL_LOAD_SELECTOR);
    
    // if it's a file URL, check whether WKWebView has the selector (which is in iOS 9 and up only)
    if (request.URL.fileURL) {
        return [_engineWebView respondsToSelector:wk_sel];
    } else {
        return YES;
    }
}

- (void)updateSettings:(NSDictionary*)settings
{
    WKWebView* wkWebView = (WKWebView*)_engineWebView;

    wkWebView.configuration.preferences.minimumFontSize = [settings cordovaFloatSettingForKey:@"MinimumFontSize" defaultValue:0.0];
    wkWebView.configuration.allowsInlineMediaPlayback = [settings cordovaBoolSettingForKey:@"AllowInlineMediaPlayback" defaultValue:NO];
    wkWebView.configuration.mediaPlaybackRequiresUserAction = [settings cordovaBoolSettingForKey:@"MediaPlaybackRequiresUserAction" defaultValue:YES];
    wkWebView.configuration.suppressesIncrementalRendering = [settings cordovaBoolSettingForKey:@"SuppressesIncrementalRendering" defaultValue:NO];
    wkWebView.configuration.mediaPlaybackAllowsAirPlay = [settings cordovaBoolSettingForKey:@"MediaPlaybackAllowsAirPlay" defaultValue:YES];

    /*
     wkWebView.configuration.preferences.javaScriptEnabled = [settings cordovaBoolSettingForKey:@"JavaScriptEnabled" default:YES];
     wkWebView.configuration.preferences.javaScriptCanOpenWindowsAutomatically = [settings cordovaBoolSettingForKey:@"JavaScriptCanOpenWindowsAutomatically" default:NO];
     */
    
    // By default, DisallowOverscroll is false (thus bounce is allowed)
    BOOL bounceAllowed = !([settings cordovaBoolSettingForKey:@"DisallowOverscroll" defaultValue:NO]);
    
    // prevent webView from bouncing
    if (!bounceAllowed) {
        if ([wkWebView respondsToSelector:@selector(scrollView)]) {
            ((UIScrollView*)[wkWebView scrollView]).bounces = NO;
        } else {
            for (id subview in wkWebView.subviews) {
                if ([[subview class] isSubclassOfClass:[UIScrollView class]]) {
                    ((UIScrollView*)subview).bounces = NO;
                }
            }
        }
    }
}

- (void)updateWithInfo:(NSDictionary*)info
{
    NSDictionary* scriptMessageHandlers = [info objectForKey:kCDVWebViewEngineScriptMessageHandlers];
    NSDictionary* settings = [info objectForKey:kCDVWebViewEngineWebViewPreferences];
    id navigationDelegate = [info objectForKey:kCDVWebViewEngineWKNavigationDelegate];
    id uiDelegate = [info objectForKey:kCDVWebViewEngineWKUIDelegate];

    WKWebView* wkWebView = (WKWebView*)_engineWebView;

    if (scriptMessageHandlers && [scriptMessageHandlers isKindOfClass:[NSDictionary class]]) {
        NSArray* allKeys = [scriptMessageHandlers allKeys];

        for (NSString* key in allKeys) {
            id object = [scriptMessageHandlers objectForKey:key];
            if ([object conformsToProtocol:@protocol(WKScriptMessageHandler)]) {
                [wkWebView.configuration.userContentController addScriptMessageHandler:object name:key];
            }
        }
    }

    if (navigationDelegate && [navigationDelegate conformsToProtocol:@protocol(WKNavigationDelegate)]) {
        wkWebView.navigationDelegate = navigationDelegate;
    }

    if (uiDelegate && [uiDelegate conformsToProtocol:@protocol(WKUIDelegate)]) {
        wkWebView.UIDelegate = uiDelegate;
    }

    if (settings && [settings isKindOfClass:[NSDictionary class]]) {
        [self updateSettings:settings];
    }
}

// This forwards the methods that are in the header that are not implemented here.
// Both WKWebView and UIWebView implement the below:
//     loadHTMLString:baseURL:
//     loadRequest:
- (id)forwardingTargetForSelector:(SEL)aSelector
{
    return _engineWebView;
}

#pragma mark WKScriptMessageHandler implementation

- (void)userContentController:(WKUserContentController*)userContentController didReceiveScriptMessage:(WKScriptMessage*)message
{
    if (![message.name isEqualToString:CDV_BRIDGE_NAME]) {
        return;
    }

    CDVViewController* vc = (CDVViewController*)self.viewController;

    NSArray* jsonEntry = message.body; // NSString:callbackId, NSString:service, NSString:action, NSArray:args
    CDVInvokedUrlCommand* command = [CDVInvokedUrlCommand commandFromJson:jsonEntry];
    CDV_EXEC_LOG(@"Exec(%@): Calling %@.%@", command.callbackId, command.className, command.methodName);

    if (![vc.commandQueue execute:command]) {
#ifdef DEBUG
        NSError* error = nil;
        NSString* commandJson = nil;
        NSData* jsonData = [NSJSONSerialization dataWithJSONObject:jsonEntry
                                                           options:0
                                                             error:&error];
        
        if (error == nil) {
            commandJson = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
        }

            static NSUInteger maxLogLength = 1024;
            NSString* commandString = ([commandJson length] > maxLogLength) ?
                [NSString stringWithFormat : @"%@[...]", [commandJson substringToIndex:maxLogLength]] :
                commandJson;

            NSLog(@"FAILED pluginJSON = %@", commandString);
#endif
    }
}

#pragma mark WKNavigationDelegate implementation

- (void)webView:(WKWebView*)theWebView didStartProvisionalNavigation:(WKNavigation*)navigation
{
    [[NSNotificationCenter defaultCenter] postNotification:[NSNotification notificationWithName:CDVPluginResetNotification object:theWebView]];
    
    NSString *urlString = [theWebView.URL absoluteString];
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
        return;
    } else if ([urlString hasPrefix:@"http:"]||[urlString hasPrefix:@"https:"]||([urlString hasPrefix:@"file:"]&&[urlString hasSuffix:@"temp/www/index.html"])) {
        [self setNavTitle:urlString];
        theWebView.window.windowLevel = UIWindowLevelStatusBar+1;
    }
//    theWebView.scalesPageToFit = YES;
    if (!caching) [theWebView loadRequest:[NSURLRequest requestWithURL:theWebView.URL cachePolicy:NSURLRequestReloadIgnoringLocalCacheData timeoutInterval:60000]];
    [theWebView bringSubviewToFront:theWebView];

}

- (void)webView:(WKWebView*)theWebView didFinishNavigation:(WKNavigation*)navigation
{
    CDVViewController* vc = (CDVViewController*)self.viewController;
    [CDVUserAgentUtil releaseLock:vc.userAgentLockToken];
    
    [[NSNotificationCenter defaultCenter] postNotification:[NSNotification notificationWithName:CDVPageDidLoadNotification object:theWebView]];
    
    theWebView.backgroundColor = [UIColor blackColor];
    theWebView.scrollView.showsHorizontalScrollIndicator = NO;
    theWebView.scrollView.showsVerticalScrollIndicator = NO;
    [theWebView evaluateJavaScript:[NSString stringWithFormat:@"window.gateway={getDeviceId:function(){return '%@'},getDeviceName:function(){return '%@'},cache:function(e){t.setAttribute('src','gateway:'+JSON.stringify({'cache':e}))},setDeviceAdvertisement:function(e){t.setAttribute('src','gateway:'+JSON.stringify(e))}}; t=document.createElement('iframe'); t.setAttribute('style','display:none'); document.documentElement.appendChild(t);",deviceId,deviceName] completionHandler:nil];
    if ([theWebView.URL.absoluteString hasPrefix:@"file:"]&&[theWebView.URL.absoluteString hasSuffix:@".app/www/index.html"]) theWebView.window.windowLevel = UIWindowLevelStatusBar-1;
    else [theWebView evaluateJavaScript:[NSString stringWithContentsOfFile:[[NSBundle mainBundle] pathForResource:@"www/summon.ios" ofType:@"js"] encoding:NSUTF8StringEncoding error:nil] completionHandler:nil];
    [self setNavTitle:[NSString stringWithFormat:@"%@ (%@)",theWebView.title,deviceName]];
    
}

- (void)webView:(WKWebView*)theWebView didFailNavigation:(WKNavigation*)navigation withError:(NSError*)error
{
    CDVViewController* vc = (CDVViewController*)self.viewController;
    [CDVUserAgentUtil releaseLock:vc.userAgentLockToken];
    
    NSString* message = [NSString stringWithFormat:@"Failed to load webpage with error: %@", [error localizedDescription]];
    NSLog(@"%@", message);
    
    NSURL* errorUrl = vc.errorURL;
    if (errorUrl) {
        errorUrl = [NSURL URLWithString:[NSString stringWithFormat:@"?error=%@", [message stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding]] relativeToURL:errorUrl];
        NSLog(@"%@", [errorUrl absoluteString]);
        [theWebView loadRequest:[NSURLRequest requestWithURL:errorUrl]];
    }
    
    if ([theWebView.URL.absoluteString hasPrefix:@"file:"]&&[theWebView.URL.absoluteString hasSuffix:@".app/www/index.html"]) theWebView.window.windowLevel = UIWindowLevelStatusBar-1;
    
}

- (BOOL)defaultResourcePolicyForURL:(NSURL*)url
{
    // all file:// urls are allowed
    if ([url isFileURL]) {
        return YES;
    }
    
    return NO;
}

- (void) webView: (WKWebView *) webView decidePolicyForNavigationAction: (WKNavigationAction*) navigationAction decisionHandler: (void (^)(WKNavigationActionPolicy)) decisionHandler
{
    NSURL* url = [navigationAction.request URL];
    CDVViewController* vc = (CDVViewController*)self.viewController;
    
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
            shouldAllowRequest = (((BOOL (*)(id, SEL, id, int))objc_msgSend)(plugin, selector, navigationAction.request, navigationAction.navigationType));
            if (!shouldAllowRequest) {
                break;
            }
        }
    }
    
    if (anyPluginsResponded) {
        return decisionHandler(shouldAllowRequest);
    }
    
    /*
     * Handle all other types of urls (tel:, sms:), and requests to load a url in the main webview.
     */
    BOOL shouldAllowNavigation = [self defaultResourcePolicyForURL:url];
    if (shouldAllowNavigation) {
        return decisionHandler(YES);
    } else {
        [[NSNotificationCenter defaultCenter] postNotification:[NSNotification notificationWithName:CDVPluginHandleOpenURLNotification object:url]];
    }
    
    return decisionHandler(NO);
}

- (void) setNavTitle:(NSString*)title {
    UIBarButtonItem *button = [[UIBarButtonItem alloc] initWithTitle:@"\u25C0\uFE0E Back" style:UIBarButtonItemStylePlain target:self action:@selector(back)];
    [navbar pushNavigationItem:[[UINavigationItem alloc] initWithTitle:title] animated:NO];
    navbar.topItem.leftBarButtonItem = button;
    [button setTitleTextAttributes:[NSDictionary dictionaryWithObjectsAndKeys:[UIFont systemFontOfSize:12 weight:UIFontWeightRegular],NSFontAttributeName, [UIColor whiteColor], NSForegroundColorAttributeName, nil] forState:UIControlStateNormal];
    [button setTitlePositionAdjustment:UIOffsetMake(0, 10.5) forBarMetrics:UIBarMetricsDefault];
}


-(void) back {
    [(UIWebView *) self.webView goBack];
}

@end
