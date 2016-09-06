//
//  TodayViewCell.m
//  Summon
//


#import "TodayViewCell.h"

@implementation TodayViewCell

-(id)initWithCoder:(NSCoder *)aDecoder{
    if ((self = [super initWithCoder:aDecoder]) && self.subviews.count == 0) {
        UIView *xibView = [[[NSBundle mainBundle] loadNibNamed:@"TodayViewCell" owner:self options:nil] objectAtIndex:0];
        xibView.frame = self.frame;
        [self addSubview: xibView];
    }
    return self;
}

@end

