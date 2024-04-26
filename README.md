# RideSmart


# Description
RideSmart is a mobile application that aims to empower the owners of older motorbikes with features that are currently only available to owners of newer models. Manufacturers have begun equipping their newest models with a CCU (Communication Control Unit) that gives the driver a range of useful information and features like lean angle warnings, acceleration timers, route trackers and more.
Our application offers these features to bikers without a CCU equipped motorbike by accessing their mobile device's native features, namely the gyroscope, accelerometer and GPS.

# Features
* Real-time Tracking: Receive Information such as current speed, current speed limit, lean angle and compass heading.
* Crash Detection: A crash detection system detects potential crashes and alerts your emregency contact.
* Route Tracking: GPS tracking is used draw your route and provide you with journey statistics.
* Accleration Timing: Measure acceleration times and store them to compare at a later date.

# Installation
To get RideSmart up and running on your local machine for development and testing purposes, follow these steps:

# Prerequisites
* Node.js (v14 or later)
* npm (v6 or later)
* Ionic Framework
* Capacitor (for native mobile functionality)

# Setup
 1. Run this command in a terminal environment to clone the repository to your
 machine
 * git clone https://github.com/Kaif370Z/RideSmart

 3. Once in the project folder, navigate to RideSmart
 * cd RideSmart

 4. Open a terminal in the current directory and execute the following command
 to complete rxjs package installation.–force is used to ignore a dependency
 conflict.
 * npm i rxjs--force

 5. To build the application, use npm’s run build command
 * npm run build

 6. Sync your Android Development environment command
 * npx cap sync android

 8. Open the app in Android Studio
 * npx cap open android

 10. If you wish to run the app in a web browser
 * ionic serve


