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

//
//  MainViewController.h
//  Summon
//
//  Created by ___FULLUSERNAME___ on ___DATE___.
//  Copyright ___ORGANIZATIONNAME___ ___YEAR___. All rights reserved.
//

#import "MainViewController.h"

@implementation MainViewController

NSString *deviceId = @"";
NSString *deviceName = @"";
UINavigationBar *navbar;
int cacheSizeMemory = 8 * 1024 * 1024; // 8MB
int cacheSizeDisk = 32 * 1024 * 1024; // 32MB
bool caching = true;

- (id)initWithNibName:(NSString*)nibNameOrNil bundle:(NSBundle*)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Uncomment to override the CDVCommandDelegateImpl used
        // _commandDelegate = [[MainCommandDelegate alloc] initWithViewController:self];
        // Uncomment to override the CDVCommandQueue used
        // _commandQueue = [[MainCommandQueue alloc] initWithViewController:self];
    }
    return self;
}

- (id)init
{
    self = [super init];
    if (self) {
        // Uncomment to override the CDVCommandDelegateImpl used
        // _commandDelegate = [[MainCommandDelegate alloc] initWithViewController:self];
        // Uncomment to override the CDVCommandQueue used
        // _commandQueue = [[MainCommandQueue alloc] initWithViewController:self];
    }
    return self;
}

- (void)didReceiveMemoryWarning
{
    // Releases the view if it doesn't have a superview.
    [super didReceiveMemoryWarning];

    // Release any cached data, images, etc that aren't in use.
}

#pragma mark View lifecycle

- (void)viewWillAppear:(BOOL)animated
{
    // View defaults to full size.  If you want to customize the view's size, or its subviews (e.g. webView),
    // you can do so here.

    [super viewWillAppear:animated];
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    navbar = [[UINavigationBar alloc]initWithFrame:CGRectMake(0, 0, [UIScreen mainScreen].bounds.size.width, 20)];
    navbar.tag=101;
    navbar.translucent=NO;
    navbar.barTintColor = [UIColor colorWithRed:0.94901960784 green:0.64705882352 blue:0.02745098039 alpha:1];
    navbar.titleTextAttributes = [NSDictionary dictionaryWithObjectsAndKeys:[UIFont systemFontOfSize:12 weight:UIFontWeightSemibold],NSFontAttributeName, [UIColor whiteColor], NSForegroundColorAttributeName, nil];
    [navbar setTitleVerticalPositionAdjustment:10.5 forBarMetrics:UIBarMetricsDefault];
    [self.view addSubview:navbar];
    // Do any additional setup after loading the view from its nib.
}

- (void)viewDidUnload
{
    [super viewDidUnload];
    // Release any retained subviews of the main view.
    // e.g. self.myOutlet = nil;
}

- (BOOL)shouldAutorotateToInterfaceOrientation:(UIInterfaceOrientation)interfaceOrientation
{
    // Return YES for supported orientations
    return [super shouldAutorotateToInterfaceOrientation:interfaceOrientation];
}

/* Comment out the block below to over-ride */


- (UIWebView*) newCordovaViewWithFrame:(CGRect)bounds
{
    return[super newCordovaViewWithFrame:CGRectMake(0,20,bounds.size.width,bounds.size.height-20)];
}

#pragma mark UIWebDelegate implementation

- (void)webViewDidFinishLoad:(UIWebView*)theWebView
{
    theWebView.backgroundColor = [UIColor blackColor];
    theWebView.scrollView.showsHorizontalScrollIndicator = NO;
    theWebView.scrollView.showsVerticalScrollIndicator = NO;
    [theWebView stringByEvaluatingJavaScriptFromString:[NSString stringWithFormat:@"window.gateway={getDeviceId:function(){return '%@'},getDeviceName:function(){return '%@'},cache:function(e){t.setAttribute('src','gateway:'+JSON.stringify({'cache':e}))},setDeviceAdvertisement:function(e){t.setAttribute('src','gateway:'+JSON.stringify(e))}}; t=document.createElement('iframe'); t.setAttribute('style','display:none'); document.documentElement.appendChild(t);",deviceId,deviceName]];
    if ([theWebView.request.URL.absoluteString hasPrefix:@"file:"]&&[theWebView.request.URL.absoluteString hasSuffix:@".app/www/index.html"]) self.view.window.windowLevel = UIWindowLevelStatusBar-1;
    else [theWebView stringByEvaluatingJavaScriptFromString:[NSString stringWithContentsOfFile:[[NSBundle mainBundle] pathForResource:@"www/cordova" ofType:@"js"] encoding:NSUTF8StringEncoding error:nil]];
    [self setNavTitle:[NSString stringWithFormat:@"%@ (%@)",[theWebView stringByEvaluatingJavaScriptFromString:@"document.title"],deviceName]];
    return [super webViewDidFinishLoad:theWebView];
}

/* Comment out the block below to over-ride */

/*

- (void) webViewDidStartLoad:(UIWebView*)theWebView
{
    return [super webViewDidStartLoad:theWebView];
}
*/
- (void) webView:(UIWebView*)theWebView didFailLoadWithError:(NSError*)error
{
    if ([theWebView.request.URL.absoluteString hasPrefix:@"file:"]&&[theWebView.request.URL.absoluteString hasSuffix:@".app/www/index.html"]) self.view.window.windowLevel = UIWindowLevelStatusBar-1;
    return [super webView:theWebView didFailLoadWithError:error];
}


- (BOOL) webView:(UIWebView*)theWebView shouldStartLoadWithRequest:(NSURLRequest*)request navigationType:(UIWebViewNavigationType)navigationType
{
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
        [self setNavTitle:urlString];
        self.view.window.windowLevel = UIWindowLevelStatusBar+1;
    }
    theWebView.tag=100;
    theWebView.scalesPageToFit = YES;
    if (!caching) request = [NSURLRequest requestWithURL:request.URL cachePolicy:NSURLRequestReloadIgnoringLocalCacheData timeoutInterval:60000];
    [self.view bringSubviewToFront:theWebView];
    return [super webView:theWebView shouldStartLoadWithRequest:request navigationType:navigationType];
}

- (void) setNavTitle:(NSString*)title {
    UIBarButtonItem *button = [[UIBarButtonItem alloc] initWithTitle:@"\u25C0\uFE0E Back" style:UIBarButtonItemStylePlain target:self action:@selector(back)];
    [navbar pushNavigationItem:[[UINavigationItem alloc] initWithTitle:title] animated:NO];
    navbar.topItem.leftBarButtonItem = button;
    [button setTitleTextAttributes:[NSDictionary dictionaryWithObjectsAndKeys:[UIFont systemFontOfSize:12 weight:UIFontWeightRegular],NSFontAttributeName, [UIColor whiteColor], NSForegroundColorAttributeName, nil] forState:UIControlStateNormal];
    [button setTitlePositionAdjustment:UIOffsetMake(0, 10.5) forBarMetrics:UIBarMetricsDefault];
}

-(void) back {
    [(UIWebView *) [self.view viewWithTag:100] goBack];
}


@end

@implementation MainCommandDelegate

/* To override the methods, uncomment the line in the init function(s)
   in MainViewController.m
 */

#pragma mark CDVCommandDelegate implementation

- (id)getCommandInstance:(NSString*)className
{
    return [super getCommandInstance:className];
}

- (NSString*)pathForResource:(NSString*)resourcepath
{
    return [super pathForResource:resourcepath];
}

@end

@implementation MainCommandQueue

/* To override, uncomment the line in the init function(s)
   in MainViewController.m
 */
- (BOOL)execute:(CDVInvokedUrlCommand*)command
{
    return [super execute:command];
}

@end
