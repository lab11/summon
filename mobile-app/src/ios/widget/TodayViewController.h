//
//  TodayViewController.h
//  Summon Widget
//


#import <UIKit/UIKit.h>
#import <CoreBluetooth/CoreBluetooth.h>

NSMutableArray *devices;

@interface TodayViewController : UIViewController <UICollectionViewDataSource, UICollectionViewDelegateFlowLayout, CBCentralManagerDelegate, CBPeripheralDelegate>

@property(nonatomic, weak) IBOutlet UICollectionView *collectionView;
@property (nonatomic, strong) NSArray *dataArray;
@property (nonatomic, strong) CBCentralManager *centralManager;

@end
