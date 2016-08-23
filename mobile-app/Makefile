#Summon Makefile

UNAME := $(shell uname)

#can be built on any system
TARGET_PLATFORMS += android

ifeq ($(UNAME), Darwin)
#can only be built on macs
TARGET_PLATFORMS += ios
endif




all: platform build link

platform:
	cordova platform add $(TARGET_PLATFORMS) || true

link:
	ln -fs $(PWD)/src/android/src/edu/umich/eecs/lab11/summon/* platforms/android/src/edu/umich/eecs/lab11/summon/.
	ln -fs $(PWD)/res/icon-ios-180.png platforms/android/res/drawable-mdpi/widget.png
	ln -fs $(PWD)/src/android/res/layout platforms/android/res/.
	ln -fs $(PWD)/src/ios/CordovaLib/Classes/Private/Plugins/CDVUIWebViewEngine/CsDVUIWebViewNavigationDelegate.m platforms/ios/CordovaLib/Classes/Private/Plugins/CDVUIWebViewEngine/.
	ln -fs $(PWD)/src/ios/widget platforms/ios/.

build:
	cordova build

clean:
	rm -r platforms plugins


