//
//  TodayViewController.m
//  Summon Widget
//


#import "TodayViewController.h"
#import "TodayViewCell.h"
#import <NotificationCenter/NotificationCenter.h>

@interface TodayViewController () <NCWidgetProviding>

@end

@implementation TodayViewController

- (void)viewDidLoad {
    [super viewDidLoad];
//    [[NSUserDefaults standardUserDefaults] removeObjectForKey:@"Devices"];
    _centralManager = [[CBCentralManager alloc] initWithDelegate:self queue:nil];
}

-(void)viewWillDisappear:(BOOL)animated {
    [_centralManager stopScan];
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    [defaults setObject:[NSKeyedArchiver archivedDataWithRootObject:devices] forKey:@"Devices"];
    [defaults synchronize];
    [super viewWillDisappear:animated];
}

- (void)widgetPerformUpdateWithCompletionHandler:(void (^)(NCUpdateResult))completionHandler {
    // Perform any setup necessary in order to update the view.
    // If an error is encountered, use NCUpdateResultFailed
    // If there's no update required, use NCUpdateResultNoData
    // If there's an update, use NCUpdateResultNewData
    NSData *archive = [[NSUserDefaults standardUserDefaults] objectForKey:@"Devices"];
    if (devices == nil || devices.count==0) devices = [[NSMutableArray alloc] init];
    if (archive != nil) devices = [NSKeyedUnarchiver unarchiveObjectWithData:archive];
    [self.collectionView reloadData];
    completionHandler(NCUpdateResultNewData);
}

- (void)centralManagerDidUpdateState:(CBCentralManager *)central {
    if (central.state != CBCentralManagerStatePoweredOn) { if (_centralManager.isScanning) [_centralManager stopScan]; }
    else [_centralManager scanForPeripheralsWithServices:@[[CBUUID UUIDWithString:@"FEAA"]] options:nil];
}

- (void)centralManager:(CBCentralManager *)central didDiscoverPeripheral:(CBPeripheral *)peripheral advertisementData:(NSDictionary *)advertisementData RSSI:(NSNumber *)RSSI {
    NSLog(@"%@",peripheral);
    @try {
        NSData *data = advertisementData[CBAdvertisementDataServiceDataKey][[CBUUID UUIDWithString:@"FEAA"]];
        if (!data || data.length < 4) return;
        NSString *uri = [NSString stringWithFormat:@"%@%.*s",PREFIX[((char *)data.bytes)[2]],(uint)(data.length-3),((char *)data.bytes)+3];
        for (int i=0; i<((sizeof J2XUS)/(sizeof J2XUS[0])); i++) uri = [uri stringByReplacingOccurrencesOfString:[NSString stringWithFormat:@"goo.gl/%@",J2XUS[i]] withString:[NSString stringWithFormat:@"j2x.us/%@",J2XUS[i]]];
        if ([self itemExists:uri]) return;
        NSMutableURLRequest *request = [[NSMutableURLRequest alloc] initWithURL:[NSURL URLWithString:@"https://summon-caster.appspot.com/resolve-scan"]];
        [request setHTTPMethod:@"POST"];
        [request setValue:@"application/json" forHTTPHeaderField:@"Accept"];
        [request setValue:@"application/json" forHTTPHeaderField:@"Content-Type"];
        [request setHTTPBody:[[NSString stringWithFormat:@"{\"objects\":[{\"url\":\"%@\"}]}",uri] dataUsingEncoding:NSUTF8StringEncoding]];
        [[[NSURLSession sessionWithConfiguration:[NSURLSessionConfiguration defaultSessionConfiguration]] dataTaskWithRequest:request completionHandler:^(NSData *body, NSURLResponse *response, NSError *error) {
            NSDictionary *md = [NSJSONSerialization JSONObjectWithData:body options:0 error:nil][@"metadata"][0];
            if ([self itemExists:md[@"displayUrl"]]) return;
            [devices addObject:[@{@"id":peripheral.identifier, @"name":peripheral.name?peripheral.name:@"Unnamed", @"ico":md[@"icon"], @"title":md[@"title"], @"uri":@[md[@"displayUrl"],md[@"id"]]} mutableCopy]];
//            [self.collectionView setUserInteractionEnabled:YES];
            [self.collectionView reloadData];
        }] resume];
    } @catch(NSException *e){}
}

- (BOOL)itemExists:(NSString*)uri {
    for (NSMutableDictionary *d in devices) if ([(NSArray*)d[@"uri"] containsObject:uri]) return true;
    return false;
}

#pragma mark - UICollectionView Datasource

- (NSInteger)collectionView:(UICollectionView *)view numberOfItemsInSection:(NSInteger)section {
    return [devices count];
}

- (NSInteger)numberOfSectionsInCollectionView: (UICollectionView *)collectionView {
    return 1;
}

- (UICollectionViewCell *)collectionView:(UICollectionView *)cv cellForItemAtIndexPath:(NSIndexPath *)indexPath {
    TodayViewCell *cell = (TodayViewCell*)[cv dequeueReusableCellWithReuseIdentifier:@"TodayViewCell" forIndexPath:indexPath];
    if (cell.icon.image != nil) return cell;
    NSMutableDictionary *d = devices[indexPath.item]; NSLog(@"Peripheral: %@",d);
    cell.name.text = d[@"title"];
    cell.icon.image = (d[@"icoData"]!=nil) ? [UIImage imageWithData:d[@"icoData"]] : [UIImage imageNamed:@"icon-ios-152.png"];
    [NSURLConnection sendAsynchronousRequest:[NSURLRequest requestWithURL:[NSURL URLWithString:d[@"ico"]]] queue:[NSOperationQueue mainQueue] completionHandler:^(NSURLResponse *response, NSData *data, NSError *error) {
        cell.icon.image = [UIImage imageWithData:data];
        d[@"icoData"] = data;
    }];
    return cell;
    
}

- (UICollectionReusableView *)collectionView:(UICollectionView *)collectionView viewForSupplementaryElementOfKind:(NSString *)kind atIndexPath:(NSIndexPath *)indexPath {
    return [[UICollectionReusableView alloc] init];
}

/*
#pragma mark – UICollectionViewDelegateFlowLayout

- (CGSize)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout *)collectionViewLayout sizeForItemAtIndexPath:(NSIndexPath *)indexPath {
    return self.collectionView.frame.size;
}

- (UIEdgeInsets)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout*)collectionViewLayout insetForSectionAtIndex:(NSInteger)section {
    return UIEdgeInsetsMake(5, 5, 5, 5);
}

- (void)collectionView:(UICollectionView *)collectionView didSelectItemAtIndexPath:(NSIndexPath *)indexPath{
    [self performSegueWithIdentifier:@"detail" sender:self];
}
*/

@end
