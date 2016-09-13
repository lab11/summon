//
//  TodayViewController.h
//  Summon Widget
//


#import <UIKit/UIKit.h>
#import <CoreBluetooth/CoreBluetooth.h>

NSMutableArray *devices;
NSString * const PREFIX[] = {@"http://www.",@"https://www.",@"http://",@"https://",@"urn:uuid:"};
NSString * const J2XUS[] = {@"6EKY8W",@"WRzp2g",@"qtn9V9",@"WRKqIy",@"2W2FTt",@"BA1zPM",@"8685Uw",@"hWTo8W",@"nCQV8C",@"sbMMHT",@"9aD6Wi",@"2ImXWJ",@"dbhGnF",@"3YACnH",@"449K5X",@"jEKPu9",@"xWppj1",@"Edukt0"};

@interface TodayViewController : UIViewController <UICollectionViewDataSource, UICollectionViewDelegateFlowLayout, CBCentralManagerDelegate, CBPeripheralDelegate>

@property(nonatomic, weak) IBOutlet UICollectionView *collectionView;
@property (nonatomic, strong) NSArray *dataArray;
@property (nonatomic, strong) CBCentralManager *centralManager;

@end
