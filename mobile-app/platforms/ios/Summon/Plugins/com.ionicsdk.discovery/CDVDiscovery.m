/*
 Licensed to Drifty Co. under one
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

#include <sys/types.h>
#include <sys/sysctl.h>
#include <ifaddrs.h>
#include <arpa/inet.h>

#import "GCDAsyncUdpSocket.h"
#import <Cordova/CDV.h>
#import "CDVDiscovery.h"

@interface CDVDiscovery () {}
@end

@implementation CDVDiscovery

NSString* callback;

- (NSString*) getBroadcastAddress {
  NSString* address = @"error";
  struct ifaddrs *interface = NULL, *interfaceList;
  int success;
  
  success = getifaddrs(&interfaceList);
  if ( success == 0 ) {
    for ( interface = interfaceList; interface != NULL; interface = interface->ifa_next ) {
      if ( interface->ifa_addr->sa_family == AF_INET ) {
        if ( [[NSString stringWithUTF8String:interface->ifa_name] isEqualToString:@"en0"] ) {
          address = [NSString stringWithUTF8String:inet_ntoa(((struct sockaddr_in *)interface->ifa_dstaddr)->sin_addr)];
        }
      }
    }
      
  }
  freeifaddrs(interfaceList);
  return address;
}

- (void)identify:(CDVInvokedUrlCommand*)command
{
    callback = command.callbackId;
    NSError* error = nil;
    NSDictionary* jsonData = [command.arguments objectAtIndex:0];
    int port;
  
    port = [[jsonData objectForKey:@"port"] intValue];

    GCDAsyncUdpSocket* udpSocket = [[GCDAsyncUdpSocket alloc] initWithDelegate:self delegateQueue:dispatch_get_main_queue()];
  
  
    if (![udpSocket enableBroadcast:YES error: &error]) {
      NSLog(@"Error enabling broadcast: %@", error);
      return;
    }
    if (![udpSocket beginReceiving:&error]) {
      NSLog(@"Error beginning receiving: %@", error);
      return;
    }

    NSString *host = [self getBroadcastAddress];
    NSString *msg = @"{\"clientName\":\"blah\"}";
    long tag = 0;
    NSData *data = [msg dataUsingEncoding:NSUTF8StringEncoding];
    [udpSocket sendData:data toHost:host port:port withTimeout:-1 tag:tag];

}

- (void)udpSocket:(GCDAsyncUdpSocket *)sock didReceiveData:(NSData *)data
                                               fromAddress:(NSData *)address
                                         withFilterContext:(id)filterContext
{

    NSString *msg = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];

    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:msg];

    [self.commandDelegate sendPluginResult:pluginResult callbackId:callback];
}






@end
