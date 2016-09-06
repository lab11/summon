//
//  TodayViewController.h
//  Summon Widget
//


#import <UIKit/UIKit.h>

@interface TodayViewController : UIViewController <UICollectionViewDataSource, UICollectionViewDelegateFlowLayout>

@property(nonatomic, weak) IBOutlet UICollectionView *collectionView;
@property (nonatomic, strong) NSArray *dataArray;

@end
