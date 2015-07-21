This is a cordova application for Summon.

Build system explanation:

while 'cordova build' usually builds applications, this requires us
to included built output in the repo - which breaks the first rule 
of version control.

It would also required the user to call 'cordova platform add [insert platform]'
and insert our custom platform files into the right location.

To get around this we decided to use a makefile that automates this for the
user.

The makefile:

1) makes sure all possible platforms are created
2) copies our source files into the right location in the platform
3) calls cordova build

Instructions:

1) add your platforms to 'TARGE_PLATFORMS'
2) make
