PROJECT_NAME = $(shell basename "$(realpath ./)")

APPLICATION_SRCS = $(notdir $(wildcard ./*.c))
APPLICATION_SRCS += softdevice_handler.c
APPLICATION_SRCS += ble_advdata.c
APPLICATION_SRCS += ble_debug_assert_handler.c
APPLICATION_SRCS += ble_srv_common.c
APPLICATION_SRCS += twi_hw_master.c
APPLICATION_SRCS += led.c

DEVICE = NRF51

ifndef TARGET
	TARGET = SQUALL
endif

TARGET_UPPER = $(shell echo $(TARGET) | tr a-z A-Z)
TARGET_LOWER = $(shell echo $(TARGET) | tr A-Z a-z)
BOARD = BOARD_$(TARGET_UPPER)

APPLICATION_SRCS += $(TARGET_LOWER).c

USE_SOFTDEVICE = s110

SDK_VERSION = 7
SDK_PATH ?= $(HOME)/code/nrf51822_sdk/sdk7/
TEMPLATE_PATH ?= ../../nrf51-pure-gcc-setup/template/

LIBRARY_PATHS += ../../include
SOURCE_PATHS += ../../src

CFLAGS = -Os
CFLAGS += $(MFLAGS)
GDB_PORT_NUMBER = 2331

include $(TEMPLATE_PATH)Makefile
