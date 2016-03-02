#Summon Makefile

UNAME := $(shell uname)

#can be built on any system
TARGET_PLATFORMS += android

ifeq ($(UNAME), Darwin)
#can only be build on macs
TARGET_PLATFORMS += ios@3.9.2
endif




all: platform link build

platform:
	cordova platform add $(TARGET_PLATFORMS) || true

link:
	ln -fs $(PWD)/src/android/* platforms/android/src/edu/umich/eecs/lab11/summon/.
	ln -fs $(PWD)/src/ios/Classes/* platforms/ios/Summon/Classes/.
	ln -fs $(PWD)/src/ios/Summon-Info.plist platforms/ios/Summon/.

build:
	cordova build

clean:
	rm -r platforms plugins


