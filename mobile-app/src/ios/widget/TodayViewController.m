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
}

-(void)viewWillAppear:(BOOL)animated {
    [super viewWillAppear:animated];
    _centralManager = [[CBCentralManager alloc] initWithDelegate:self queue:nil];
    devices = [[NSMutableArray alloc] init];
}

-(void)viewWillDisappear:(BOOL)animated {
    [_centralManager stopScan];
    [super viewWillDisappear:animated];
}

- (void)widgetPerformUpdateWithCompletionHandler:(void (^)(NCUpdateResult))completionHandler {
    // Perform any setup necessary in order to update the view.
    // If an error is encountered, use NCUpdateResultFailed
    // If there's no update required, use NCUpdateResultNoData
    // If there's an update, use NCUpdateResultNewData
    completionHandler(NCUpdateResultNewData);
}

- (void)centralManagerDidUpdateState:(CBCentralManager *)central {
    if (central.state != CBCentralManagerStatePoweredOn) return;
    if (central.state == CBCentralManagerStatePoweredOn) [_centralManager scanForPeripheralsWithServices:nil options:@{ CBCentralManagerScanOptionAllowDuplicatesKey : @NO }];
}

- (void)centralManager:(CBCentralManager *)central didDiscoverPeripheral:(CBPeripheral *)peripheral advertisementData:(NSDictionary *)advertisementData RSSI:(NSNumber *)RSSI {
    NSLog(@"%@",peripheral);
    for (int i=0; i<[devices count]; i++)
        if ([devices[i] isEqual:(peripheral)]) {
            [[self collectionView] reloadData];
            return;
        }
    [devices addObject:peripheral];
    [self.collectionView setUserInteractionEnabled:YES];
    [self.collectionView reloadData];
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
    CBPeripheral *peripheral = devices[indexPath.item];
    cell.name.text = peripheral.name;
    cell.icon.image = [UIImage imageNamed:@"icon-ios-152.png"];
    [NSURLConnection sendAsynchronousRequest:[NSURLRequest requestWithURL:[NSURL URLWithString:@"https://googledrive.com/host/0B15ruEDqdKuBZDdYcDh3Y2RpaDA/img/blees.ico"]] queue:[NSOperationQueue mainQueue] completionHandler:^(NSURLResponse *response, NSData *data, NSError *error) { cell.icon.image = [UIImage imageWithData:data]; }];
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
