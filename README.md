## Switch Remote Play (Play with friends living in different cities)

This project is inspired by the github project [Switch Remote Play](https://github.com/juharris/switch-remoteplay) 
and this article [Building a WebRTC video broadcast using Javascript](https://gabrieltanner.org/blog/Webrtc-video-broadcast)

The goal of the project is to let you or your friends play Nitendo Switch remotely via another device with a keyboard.
The only thing your friends need is a computer with internet (no need to install any packages).

[Switch Remote Play](https://github.com/juharris/switch-remoteplay) already offer the ability to do so, however after Switch firmware update to 12.0.0, [joycontrol](https://github.com/mart1nro/joycontrol)(software-based controller emulator used in the project) is not working at all. 

I also was studying about real-time video streaming recently and when I saw the WebRTC protocol, I thought **this is the perfect chance to try building up a remote gaming system**.

## Features

- [x] Support for SwitchOS 12+
- [x] FullHD video and high framerate (30fps) with USB dongle
- [x] Extra low video latency (<0.5s) with WebRTC
- [x] No hacking of your Switch is required
- [x] Support 1 local player with 1 remote player
- [ ] Other cool functions like voice chat room
- [ ] Support playing on cellphone
- [ ] Support joystick on remote side
- [ ] Support 1 local player with 3 remote players

## Getting Started

System Overview (refer to juharris's system architecture):
```
Website <=====> Linux machine <--Bluetooth--> Switch
   ^                                             |
   |                                   video capture via HDMI
   |                                             |
   |                                             v
   '---------------------------------------- PC/Laptop
```     

# Requirements
The host (person setting this up) needs:
* A Nintendo Switch
* Video capture device: 
    - **Recommended**: Capture device supports USB3.0 and HDMI Passthrough (FullHD is enough for Nitendo Switch) 
    - Cheap one: [HDMI to USB dongle](https://www.aliexpress.com/item/4001043540669.html)
* A PC/Laptop to connect via WebRTC to the remote side
* A **Linux** machine (PC/Laptop/Pi/VM) to connect via Bluetooth to the Switch (should not be the same as above)
    - I tested with Raspberry Pi 3B/4B, both work fine

The client (person who want to play remotely) needs:
* A PC/Laptop with internet

The third party services I used:
* [Heroku](https://www.heroku.com/https://www.heroku.com/) - used to deploy website
* [AWS IoT Core](https://aws.amazon.com/tw/iot-core/) - used for its MQTT pub/sub service

# Setting up
```
Website                                Switch
   ^                                      |
   |                            video capture via HDMI
   |                                      |
   |                                      v
   '--------------------------------- PC/Laptop
```
Connect Switch, Video capture device and PC together through cables.
Then on PC, run ```npm install``` to install dependencies after cloning repository.
You can test the application using the following command ```node server.js```
The application should now be running on your localhost:8000 and you can test it by connecting to localhost:8000/broadcast.html to add a new broadcaster.
After that, you just need to visit localhost:8000/view.html and you should get the video that is streamed from the broadcaster.

❗NOTE❗ If you haven't set up the AWS part then there may be some error, feel free to comment out associated code in server.js if you want above quick test.

```
Website <=====> Linux machine
```
The concept is to send the keyboard commands from the remote side back to a linux machine and then connect to Switch through bluetooth.
I think there may be plenty of solutions to fulfill the task (ex: socket programming).
For me, I use AWS IoT Core to transmit the keyboard commands. 

To do this, you need to log in an AWS account and create two IoT Things at IoT page (one for web and the other for linux machine).
Then download the certificate and replace the path values in server.js and control.js.

For more information, see the [AWS IoT Device SDK](https://github.com/aws/aws-iot-device-sdk-js)

Finally I use [ROBOTJS](https://github.com/octalmage/robotjs) to automatically play the keyboard commands from the AWS IoT Core on the linux machine. 

```
Linux machine <--Bluetooth--> Switch
```
Here is the last part, in order to send the control commands to Switch we need a software-based controller emulator.
However, if your Switch firmware already updated to 12+, most of the software-based controller emulator may not work: joycontrol (desktop), JoyCon Droid (Android), Switch Pro Controller (Android).
Fortunately, [NXBT](https://github.com/Brikwerk/nxbt) has already overcome the problem.
To install it on Raspberry Pi, just run ```sudo pip3 install git+http://github.com/Brikwerk/nxbt.git@v12_fix``` and then run ```sudo nxbt tui``` to play the emulator.

Congratulations! You may run ```node server.js``` at your PC to test the overall system. 
The final step is to deploy it on the internet, the method is depended on you.

## Thanks

- [juharris](https://github.com/juharris/switch-remoteplay) for the original idea
- [TannerGabriel](https://github.com/TannerGabriel/WebRTC-Video-Broadcast) for the original WebRTC broadcast application
- [Brikwerk](https://github.com/Brikwerk/nxbt) for the excellent Switch controller emulator
- [AWS IoT Device SDK](https://github.com/aws/aws-iot-device-sdk-js) for the AWS IoT Core
- [octalmage](https://github.com/octalmage/robotjs) for the autogui package written in javascript
- [Online Tutorials](https://www.youtube.com/channel/UCbwXnUipZsLfUckBPsC7Jog) for creative CSS animation and hover effects