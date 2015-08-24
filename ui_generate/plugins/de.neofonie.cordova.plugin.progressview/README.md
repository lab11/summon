# Cordova Progress View Plugin
=======================

Cordova+PhoneGap Extension for displaying a native determinate progress dialog.

=======================

# Contents

1. [Description](#description)
2. [Platforms](#platforms)
3. [Installation](#installation)
4. [Usage](#usage)
5. [API](#api)

=======================

## Description

Small Plugin for displaying a native progress dialog. Ideal for synchronous operations (downloading, zipping). Runnning on a background thread.

=======================

## Platforms

* iOS, 7.1.2+
* Android, 4.0.0+

=======================

## Installation

Via Cordova CLI:
```bash
cordova plugin add https://github.com/SidneyS/cordova-plugin-progressview.git
```

=======================

## Usage

1. Wait for `deviceReady`.
2. `show()` the native progress dialog.
2. Update progress via `setProgress()`.
3. `hide()` the native progress dialog.

=======================

## API

### show()

```javascript
ProgressView.show: function (progressLabel, progressType, progressTheme)
```
Shows a progress dialog.

* params
 * progressLabel - Text description of current operation.
 * progressType - Type of dialog -  "CIRCLE" (Default), "HORIZONTAL"
 * progressTheme - Visual Theme (Android only) - "DEVICE_LIGHT" (Default), "TRADITIONAL", "DEVICE_DARK", "HOLO_DARK", "HOLO_LIGHT"

### setProgress()

```javascript
ProgressView.setProgress: function (progressPercentage)
```
Updates displayed progress dialog percentage.

* params
 * progressPercentage - Floating point value (0.1 - 1.0), representing the percentage to be displayed.

### hide()
 
```javascript
ProgressView.hide: function ()
 ```
Hides progress dialog.

 * params
  * progressPercentage - Floating point value (0.1 - 1.0), representing the percentage to be displayed.
