#This is the cordova makefile

UNAME := $(shell uname)

#can be built on any system
TARGET_PLATFORMS += android

ifeq ($(UNAME), Darwin)
#can only be build on macs
TARGET_PLATFORMS += ios@3.8.0
endif




all: platforms plat_files cordova

cordova:
	cordova build

platform:
	cordova platform add $(TARGET_PLATFORMS) || true

plat_files: platform src/android/MainActivity.java
	cp src/android/MainActivity.java platforms/android/src/edu/umich/eecs/lab11/summon/.
	cp -r src/ios/* platforms/ios/Summon/.

clean:
	cordova platform remove $(TARGET_PLATFORMS) || true


