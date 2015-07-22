#This is the cordova makefile

UNAME := $(shell uname)

#can be built on any system
TARGET_PLATFORMS += android

ifeq ($(UNAME), Darwin)
#can only be build on macs
TARGET_PLATFORMS += ios
endif




all: plat_files platforms cordova

cordova:
	cordova build

platform:
	cordova platform add $(TARGET_PLATFORMS) || true

plat_files: platform src/android/MainActivity.java
	cp src/android/MainActivity.java platforms/android/src/edu/umich/eecs/lab11/summon/.

clean:
	cordova platform remove $(TARGET_PLATFORMS) || true


