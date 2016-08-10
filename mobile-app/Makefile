#Summon Makefile

UNAME := $(shell uname)

#can be built on any system
TARGET_PLATFORMS += android

ifeq ($(UNAME), Darwin)
#can only be build on macs
TARGET_PLATFORMS += ios
endif




all: platform build link

platform:
	cordova platform add $(TARGET_PLATFORMS) || true

link:
	ln -fs $(PWD)/src/android/* platforms/android/src/edu/umich/eecs/lab11/summon/.
	ln -fs $(PWD)/src/ios/CordovaLib/Classes/Private/Plugins/CDVUIWebViewEngine/CDVUIWebViewNavigationDelegate.m platforms/ios/CordovaLib/Classes/Private/Plugins/CDVUIWebViewEngine/.

build:
	cordova build

clean:
	rm -r platforms plugins


