# 🚗 STEMify Car Setup Guide

## 📦 Required Components

| Component | Qty | Purpose |
|-----------|-----|---------|
| **NodeMCU ESP8266** | 1 | WiFi + Firebase Communication |
| **Arduino Nano/Uno** | 1 | Motor Control + Sensor Reading |
| **L298N Motor Driver** | 1 | Motor Control |
| **DC Motors + Wheels** | 2 | Car Movement |
| **18650 Batteries** | 2 | Power (7.4V) |
| **Jumper Wires** | 20+ | Connections |
| **Car Chassis** | 1 | Frame |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│   ┌─────────────────┐         Serial         ┌─────────────────┐   │
│   │                 │        (TX/RX)         │                 │   │
│   │  NodeMCU ESP8266│◄──────────────────────►│  Arduino Nano   │   │
│   │                 │                         │                 │   │
│   │  • WiFi         │                         │  • Motors       │   │
│   │  • Firebase     │                         │  • Sensors      │   │
│   │  • Commands     │                         │  • LED/Buzzer   │   │
│   │                 │                         │                 │   │
│   └─────────────────┘                         └─────────────────┘   │
│          │                                            │             │
│          │                                            │             │
│          ▼                                            ▼             │
│   ┌─────────────┐                            ┌───────────────┐      │
│   │   Internet  │                            │    L298N      │      │
│   │   Firebase  │                            │  Motor Driver │      │
│   └─────────────┘                            └───────────────┘      │
│                                                      │              │
│                                              ┌───────┴───────┐      │
│                                              │               │      │
│                                           Motor A         Motor B   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🔌 WIRING CONNECTIONS

### 1️⃣ Arduino Nano → L298N Motor Driver

| Arduino Pin | L298N Pin | Purpose |
|-------------|-----------|---------|
| **D5** | ENA | Motor A Speed (PWM) |
| **D4** | IN1 | Motor A Direction |
| **D3** | IN2 | Motor A Direction |
| **D6** | ENB | Motor B Speed (PWM) |
| **D7** | IN3 | Motor B Direction |
| **D8** | IN4 | Motor B Direction |
| **GND** | GND | Common Ground |

### 2️⃣ ESP8266 ↔ Arduino Communication

| ESP8266 Pin | Arduino Pin | Purpose |
|-------------|-------------|---------|
| **D7** (GPIO13) | **D11** (TX) | ESP receives from Arduino |
| **D8** (GPIO15) | **D10** (RX) | ESP sends to Arduino |
| **GND** | **GND** | Common Ground |

### 3️⃣ Power Connections

| From | To | Purpose |
|------|-----|---------|
| Battery (+) 7.4V | L298N 12V | Motor Power |
| Battery (-) | L298N GND | Ground |
| L298N 5V Output | Arduino VIN | Arduino Power |
| L298N 5V Output | ESP8266 VIN | ESP8266 Power |
| All GND | Connected Together | Common Ground |

### 4️⃣ Motor Connections

| Motor | L298N |
|-------|-------|
| Left Motor Wire 1 | OUT1 |
| Left Motor Wire 2 | OUT2 |
| Right Motor Wire 1 | OUT3 |
| Right Motor Wire 2 | OUT4 |

---

## 🔧 SENSOR CONNECTIONS (Level-wise)

Students connect sensors to Arduino as they progress through levels:

| Level | Sensor | Arduino Pin | VCC | GND |
|-------|--------|-------------|-----|-----|
| 1 | PIR Motion | D2 | 5V | GND |
| 2 | Ultrasonic TRIG | D12 | 5V | GND |
| 2 | Ultrasonic ECHO | D13 | - | - |
| 3 | IR Sensor | A0 | 5V | GND |
| 5 | DHT11 | D9 | 5V | GND |
| 6 | Gas MQ-2 | A1 | 5V | GND |
| 7 | LDR | A2 | 5V | GND |
| 8 | Soil Moisture | A3 | 5V | GND |
| 9 | Sound Sensor | A4 | 5V | GND |
| All | LED/Buzzer | A5 | - | GND |

---

## 📁 Files to Upload

```
esp32/
├── Arduino_Car_Code.ino    ← Upload to Arduino Nano/Uno
├── ESP8266_WiFi_Code.ino   ← Upload to NodeMCU ESP8266
└── README_SETUP.md         ← This guide
```

---

## 📤 UPLOAD INSTRUCTIONS

### Step 1: Arduino Code Upload

1. Open **Arduino IDE**
2. Open `Arduino_Car_Code.ino`
3. Select **Board:** Arduino Nano (or Uno)
4. Select **Port:** (Arduino COM port)
5. Click **Upload**
6. Open Serial Monitor (115200 baud) to test

### Step 2: ESP8266 Code Upload

1. Open **Arduino IDE**
2. Open `ESP8266_WiFi_Code.ino`
3. **CHANGE THESE VALUES:**
   ```cpp
   const char* WIFI_SSID = "YOUR_WIFI_NAME";
   const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";
   String STUDENT_USER_ID = "YOUR_STUDENT_ID";
   ```
4. Select **Board:** NodeMCU 1.0 (ESP-12E Module)
5. Select **Port:** (ESP8266 COM port)
6. Click **Upload**
7. Open Serial Monitor (115200 baud) to verify

---

## ✅ Testing Checklist

### Arduino Test:
Open Serial Monitor and type commands:
```
FORWARD    → Motors move forward
BACKWARD   → Motors move backward
LEFT       → Turn left
RIGHT      → Turn right
STOP       → Motors stop
READ_ALL   → Read all sensors
```

### ESP8266 Test:
Serial Monitor should show:
```
✅ WiFi Connected!
   IP: 192.168.x.x
📡 Testing Arduino connection...
✅ Setup complete!
```

### Dashboard Test:
- Go to STEMify Dashboard
- Check **Car Control** tab
- Car should show **"Online"**

---

## 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| WiFi not connecting | Check SSID/password (case-sensitive) |
| Car not showing online | Check STUDENT_USER_ID |
| Arduino not receiving commands | Check TX/RX connections |
| Motors not moving | Check L298N connections |
| Motors wrong direction | Swap motor wires |
| ESP8266 not detected | Install CH340 driver |

---

## 🎯 Quick Start Summary

1. ✅ Upload `Arduino_Car_Code.ino` to Arduino
2. ✅ Upload `ESP8266_WiFi_Code.ino` to ESP8266 (with your credentials)
3. ✅ Connect Arduino ↔ ESP8266 (TX/RX)
4. ✅ Connect Arduino → L298N
5. ✅ Connect Motors → L298N
6. ✅ Connect Power
7. ✅ Check Serial Monitors
8. ✅ Check Dashboard - "Car Online"
9. 🎉 Start learning with sensors!

---

## 📊 Wiring Diagram

```
                    ┌─────────────────┐
                    │   BATTERY 7.4V  │
                    │    (+)    (-)   │
                    └──┬─────────┬────┘
                       │         │
    ┌──────────────────┴─────────┴──────────────────┐
    │                    L298N                       │
    │  ┌──────────────────────────────────────┐     │
    │  │ 12V  GND  5V   ENA IN1 IN2 IN3 IN4 ENB│    │
    │  └──┬───┬───┬─────┬───┬───┬───┬───┬───┬──┘    │
    │     │   │   │     │   │   │   │   │   │       │
    │     │   │   │     │   │   │   │   │   │       │
    │  OUT1 OUT2      OUT3 OUT4                     │
    │    │   │          │   │                       │
    └────┼───┼──────────┼───┼───────────────────────┘
         │   │          │   │
      ┌──┴───┴──┐    ┌──┴───┴──┐
      │ MOTOR A │    │ MOTOR B │
      │  (LEFT) │    │ (RIGHT) │
      └─────────┘    └─────────┘

    ┌─────────────────┐              ┌─────────────────┐
    │  Arduino Nano   │              │  ESP8266        │
    │                 │              │  (NodeMCU)      │
    │  D5 ───────────────► ENA      │                 │
    │  D4 ───────────────► IN1      │  D7 ◄───── D11  │
    │  D3 ───────────────► IN2      │  D8 ─────► D10  │
    │  D6 ───────────────► ENB      │  GND ───── GND  │
    │  D7 ───────────────► IN3      │  VIN ◄─── 5V    │
    │  D8 ───────────────► IN4      │                 │
    │  GND ──────────────► GND      │                 │
    │  VIN ◄───────────── 5V        │                 │
    │                 │              │                 │
    │  SENSOR PINS:   │              │                 │
    │  D2  = PIR      │              │                 │
    │  D12 = TRIG     │              │                 │
    │  D13 = ECHO     │              │                 │
    │  A0  = IR       │              │                 │
    │  A1  = GAS      │              │                 │
    │  A2  = LDR      │              │                 │
    │  A3  = SOIL     │              │                 │
    │  A4  = SOUND    │              │                 │
    │  A5  = LED      │              │                 │
    └─────────────────┘              └─────────────────┘
```

---

**🎓 Happy Learning with STEMify!**
