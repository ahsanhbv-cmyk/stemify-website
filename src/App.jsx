// src/App.jsx
// STEMify - Complete STEM Learning Platform with ESP32 Car Control
import React, { useState, useEffect, createContext, useContext, useCallback } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, Link } from "react-router-dom";
import { realtimeDb, auth, resetPassword } from "./firebase";
import { ref, onValue, set, push, get, remove, update } from "firebase/database";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis
} from "recharts";

// ==================== Constants ====================
const ADMIN_PIN = "12345";
const TOTAL_LEVELS = 10;
const TASKS_PER_LEVEL = 3;
const QUIZ_PASS_PERCENTAGE = 60;

// Level configurations with sensors (matched to course content)
const LEVEL_CONFIG = {
  1: { sensor: "PIR Motion Sensor", icon: "🚶", color: "#ec4899", certificate: "Motion Detection Specialist" },
  2: { sensor: "Ultrasonic Sensor (HC-SR04)", icon: "📏", color: "#3b82f6", certificate: "Distance Measurement Expert" },
  3: { sensor: "IR Obstacle Sensor", icon: "📡", color: "#8b5cf6", certificate: "Obstacle Detection Pro" },
  4: { sensor: "Bluetooth Module (HC-05)", icon: "📶", color: "#0ea5e9", certificate: "Wireless Communication Master" },
  5: { sensor: "Temperature Sensor (DHT11)", icon: "🌡️", color: "#ef4444", certificate: "Climate Monitoring Expert" },
  6: { sensor: "Gas Sensor (MQ-2)", icon: "💨", color: "#84cc16", certificate: "Safety Systems Specialist" },
  7: { sensor: "LDR Light Sensor", icon: "💡", color: "#eab308", certificate: "Light Automation Expert" },
  8: { sensor: "Soil Moisture Sensor", icon: "🌱", color: "#22c55e", certificate: "Smart Agriculture Pioneer" },
  9: { sensor: "Sound Sensor (Microphone)", icon: "🔊", color: "#6366f1", certificate: "Audio Detection Specialist" },
  10: { sensor: "Computer Vision (ESP32-CAM)", icon: "📷", color: "#f43f5e", certificate: "🏆 STEMify Master Engineer - Course Complete!" }
};

// ==================== COMPREHENSIVE SENSOR INFORMATION ====================
const SENSOR_INFO = {
  1: {
    name: "PIR Motion Sensor (HC-SR501)",
    whatIsIt: "Passive Infrared sensor detects movement by sensing changes in infrared radiation from warm bodies like humans and animals. It's called 'passive' because it doesn't emit any energy, it only receives.",
    whyUseIt: "Used in security systems, automatic lights, burglar alarms, and motion-activated devices. Saves energy by detecting when people are present. Perfect for your first sensor project!",
    range: "Detection: 3-7 meters | Angle: ~120°",
    accuracy: "Adjustable sensitivity with potentiometers",
    workingVoltage: "5V DC (needs 30-60 sec warm-up)",
    pins: ["VCC (Power 5V)", "OUT (Digital Signal)", "GND (Ground)"],
    funFact: "Security cameras use PIR sensors to start recording only when motion is detected, saving storage space!",
    blockCodingPreview: "In Task 3, you'll create a security alarm system that detects intruders!",
    sampleBlocks: ["Read Motion", "If Motion Detected", "Alarm On", "LED On", "Wait 1 sec"]
  },
  2: {
    name: "Ultrasonic Sensor (HC-SR04)",
    whatIsIt: "An ultrasonic sensor uses sound waves to measure distance. It sends out a high-frequency sound pulse (40kHz) and measures how long it takes for the echo to return.",
    whyUseIt: "Perfect for obstacle detection, parking sensors, robot navigation, and measuring distances without physical contact. Used in cars, robots, and automatic doors!",
    range: "2cm to 400cm (effective range: 2cm - 200cm)",
    accuracy: "±3mm",
    workingVoltage: "5V DC",
    pins: ["VCC (Power 5V)", "GND (Ground)", "TRIG (Trigger Input)", "ECHO (Echo Output)"],
    funFact: "Bats use the same technique (echolocation) to navigate in the dark!",
    blockCodingPreview: "In Task 3, you'll create a program that reads distance and makes the car stop when an obstacle is detected!",
    sampleBlocks: ["Read Distance", "If Object < 20cm", "Stop", "Buzzer Beep", "End If"]
  },
  3: {
    name: "IR Obstacle Sensor",
    whatIsIt: "Uses infrared light to detect obstacles. It emits IR light and detects the reflection when something is in front of it. Works like a simple radar!",
    whyUseIt: "Perfect for line-following robots, obstacle avoidance, edge detection on tables, and automatic door sensors.",
    range: "2cm to 30cm (adjustable with potentiometer)",
    accuracy: "Digital output (HIGH/LOW)",
    workingVoltage: "3.3V - 5V DC",
    pins: ["VCC (Power)", "GND (Ground)", "OUT (Digital Signal)"],
    funFact: "Your TV remote uses similar IR technology to send signals to your TV!",
    blockCodingPreview: "In Task 3, you'll program the car to follow a black line or avoid obstacles!",
    sampleBlocks: ["Read IR Sensor", "If Line Detected", "Move Forward", "Wait 0.5 sec", "End If"]
  },
  4: {
    name: "Bluetooth Module (HC-05)",
    whatIsIt: "A wireless communication module that allows your Arduino/ESP to communicate with smartphones, tablets, and other Bluetooth devices. It uses radio waves at 2.4GHz frequency.",
    whyUseIt: "Enables wireless control of robots and projects from your phone! Used in wireless speakers, game controllers, car diagnostics, and IoT projects.",
    range: "Up to 10 meters (Class 2 Bluetooth)",
    accuracy: "9600-115200 baud rate communication",
    workingVoltage: "3.3V - 5V DC (Logic level 3.3V)",
    pins: ["VCC (Power)", "GND (Ground)", "TXD (Transmit Data)", "RXD (Receive Data)", "STATE", "EN (Enable)"],
    funFact: "Bluetooth was named after Harald Bluetooth, a Viking king who united Danish tribes - just like Bluetooth unites devices!",
    blockCodingPreview: "In Task 3, you'll control your car wirelessly from a smartphone app!",
    sampleBlocks: ["Wait for Bluetooth", "If Receive 'F'", "Move Forward", "If Receive 'S'", "Stop"]
  },
  5: {
    name: "Temperature & Humidity Sensor (DHT11)",
    whatIsIt: "A digital sensor that measures both temperature and humidity. It has a built-in chip that converts readings to digital signals.",
    whyUseIt: "Used in weather stations, air conditioners, refrigerators, and smart home systems to monitor room conditions automatically.",
    range: "Temperature: 0°C to 50°C | Humidity: 20% to 80%",
    accuracy: "Temperature: ±2°C | Humidity: ±5%",
    workingVoltage: "3.3V - 5V DC",
    pins: ["VCC (Power)", "DATA (Signal)", "NC (Not Connected)", "GND (Ground)"],
    funFact: "Your phone also has temperature sensors to prevent overheating!",
    blockCodingPreview: "In Task 3, you'll make a program that turns on a fan when temperature is too high!",
    sampleBlocks: ["Read Temperature", "If Temp > 35°C", "LED On", "Buzzer Beep", "End If"]
  },
  6: {
    name: "Gas Sensor (MQ-2)",
    whatIsIt: "A chemical sensor that detects various gases like LPG, propane, methane, alcohol, and smoke. It has a heating element inside that needs to warm up.",
    whyUseIt: "Essential for safety! Used in gas leak detectors, fire alarms, and industrial safety systems to protect people from dangerous gases.",
    range: "300-10000 ppm (parts per million)",
    accuracy: "Varies by gas type",
    workingVoltage: "5V DC (needs heater warm-up time)",
    pins: ["VCC (Power 5V)", "GND (Ground)", "A0 (Analog Out)", "D0 (Digital Out)"],
    funFact: "This sensor needs 24-48 hours of 'burn-in' time when first used to stabilize!",
    blockCodingPreview: "In Task 3, you'll create a gas alarm that beeps when dangerous gas levels are detected!",
    sampleBlocks: ["Read Gas Level", "If Gas > 40%", "Alarm On", "LED On", "End If"]
  },
  7: {
    name: "LDR Light Sensor",
    whatIsIt: "A Light Dependent Resistor changes its resistance based on light intensity. More light = less resistance, less light = more resistance.",
    whyUseIt: "Used in automatic street lights, camera exposure control, night lights, and any system that needs to detect day/night.",
    range: "Light resistance: 1K-10K | Dark resistance: 1M+",
    accuracy: "Analog measurement",
    workingVoltage: "3.3V - 5V DC (with 10K resistor)",
    pins: ["One pin to VCC (through resistor)", "One pin to GND and analog input"],
    funFact: "Solar garden lights use LDR to automatically turn on at night!",
    blockCodingPreview: "In Task 3, you'll make automatic headlights that turn on in the dark!",
    sampleBlocks: ["Read Light Level", "If Dark < 20%", "Headlight On", "Else", "Headlight Off"]
  },
  8: {
    name: "Soil Moisture Sensor",
    whatIsIt: "Measures the water content in soil by checking electrical conductivity. Wet soil conducts electricity better than dry soil. The sensor has two probes that measure resistance.",
    whyUseIt: "Perfect for automatic plant watering systems, smart gardens, and farming to ensure plants get the right amount of water. Save water and keep your plants healthy!",
    range: "0-100% moisture (analog value 0-1023)",
    accuracy: "Relative measurement",
    workingVoltage: "3.3V - 5V DC",
    pins: ["VCC (Power)", "GND (Ground)", "A0 (Analog Signal)"],
    funFact: "Professional farms use thousands of these sensors to save water and increase crop yield by up to 30%!",
    blockCodingPreview: "In Task 3, you'll create a smart irrigation system that automatically waters plants when dry and stops when wet enough!",
    sampleBlocks: ["Loop Start", "Read Moisture", "If Dry < 30%", "Pump On", "Wait 2 sec", "Pump Off", "End If", "Loop End"]
  },
  9: {
    name: "Sound Sensor (Microphone Module)",
    whatIsIt: "A microphone with amplifier circuit that converts sound waves into electrical signals. Can detect sound intensity and loud noises.",
    whyUseIt: "Used in clap switches, voice-activated systems, noise level monitoring, and sound-reactive LED displays.",
    range: "Frequency: 50Hz-10kHz | Sensitivity: Adjustable",
    accuracy: "Analog + Digital output",
    workingVoltage: "3.3V - 5V DC",
    pins: ["VCC (Power)", "GND (Ground)", "A0 (Analog)", "D0 (Digital)"],
    funFact: "Voice assistants like Alexa use advanced versions of sound sensors!",
    blockCodingPreview: "In Task 3, you'll create a clap-activated light switch!",
    sampleBlocks: ["Read Sound Level", "If Sound > 70%", "LED On", "Wait 1 sec", "LED Off"]
  },
  10: {
    name: "Computer Vision (ESP32-CAM)",
    whatIsIt: "An ESP32 board with a built-in camera (OV2640) that can capture images, stream video, and perform basic computer vision tasks like face detection and object recognition!",
    whyUseIt: "The ultimate sensor! Used in security cameras, facial recognition systems, QR code scanners, autonomous vehicles, and AI-powered robots. This is the future of sensing!",
    range: "Camera: 2MP | Video: Up to 1600x1200 | Detection: Several meters",
    accuracy: "Depends on lighting and algorithm",
    workingVoltage: "5V DC (3.3V logic)",
    pins: ["5V (Power)", "GND (Ground)", "U0T (TX)", "U0R (RX)", "GPIO0 (Flash)", "Camera Interface"],
    funFact: "Self-driving cars like Tesla use multiple cameras and computer vision to navigate roads!",
    blockCodingPreview: "In Task 3, you'll create an AI-powered face detection system and complete your STEMify journey!",
    sampleBlocks: ["Start Camera", "If Face Detected", "LED On", "Capture Photo", "Send Alert"]
  }
};

// ==================== CONNECTION GUIDES ====================
const CONNECTION_GUIDES = {
  1: {
    title: "Connecting PIR Motion Sensor (HC-SR501)",
    components: ["HC-SR501 PIR Sensor", "3 Jumper Wires (Male-Female)", "Arduino/ESP8266", "Breadboard (optional)"],
    steps: [
      { pin: "VCC", connect: "5V", wire: "Red", description: "Power pin - Needs 5V to work properly!" },
      { pin: "OUT", connect: "D5 (GPIO14)", wire: "Yellow", description: "Signal output - Goes HIGH when motion is detected" },
      { pin: "GND", connect: "GND", wire: "Black", description: "Ground pin - Connect to GND on Arduino" }
    ],
    diagram: `
    PIR Sensor       Arduino/ESP8266
    ┌─────────┐      ┌─────────────┐
    │  VCC  ●─┼──────┼─● 5V        │
    │  OUT  ●─┼──────┼─● D5/GPIO14 │
    │  GND  ●─┼──────┼─● GND       │
    └─────────┘      └─────────────┘
    
    [Fresnel Lens Dome on top]
    `,
    warning: "⚠️ IMPORTANT: Wait 30-60 seconds after power-on for sensor to stabilize! It will give false readings during warm-up.",
    testTip: "Walk in front of the sensor to trigger motion detection. The LED on the module will light up."
  },
  2: {
    title: "Connecting Ultrasonic Sensor (HC-SR04)",
    components: ["HC-SR04 Ultrasonic Sensor", "4 Jumper Wires (Male-Female)", "Arduino/ESP8266", "Breadboard (optional)"],
    steps: [
      { pin: "VCC", connect: "5V", wire: "Red", description: "Power pin - Connect to 5V on Arduino" },
      { pin: "GND", connect: "GND", wire: "Black", description: "Ground pin - Connect to GND on Arduino" },
      { pin: "TRIG", connect: "D2 (GPIO4)", wire: "Yellow", description: "Trigger pin - Sends the ultrasonic pulse" },
      { pin: "ECHO", connect: "D1 (GPIO5)", wire: "Green", description: "Echo pin - Receives the reflected pulse" }
    ],
    diagram: `
    HC-SR04          Arduino/ESP8266
    ┌─────────┐      ┌─────────────┐
    │  VCC  ●─┼──────┼─● 5V        │
    │  GND  ●─┼──────┼─● GND       │
    │  TRIG ●─┼──────┼─● D2/GPIO4  │
    │  ECHO ●─┼──────┼─● D1/GPIO5  │
    └─────────┘      └─────────────┘
    `,
    warning: "⚠️ ESP8266 is 3.3V tolerant. Use a voltage divider on ECHO pin (5V→3.3V) for safety!",
    testTip: "Place your hand in front of the sensor at different distances to see measurements change."
  },
  3: {
    title: "Connecting IR Obstacle Sensor",
    components: ["IR Obstacle Sensor Module", "3 Jumper Wires", "Arduino/ESP8266"],
    steps: [
      { pin: "VCC", connect: "3.3V or 5V", wire: "Red", description: "Power pin - Works with both voltages" },
      { pin: "GND", connect: "GND", wire: "Black", description: "Ground pin - Connect to GND" },
      { pin: "OUT", connect: "D6 (GPIO12)", wire: "Yellow", description: "Signal output - Goes LOW when obstacle is detected" }
    ],
    diagram: `
    IR Sensor        Arduino/ESP8266
    ┌─────────┐      ┌─────────────┐
    │  VCC  ●─┼──────┼─● 3.3V/5V   │
    │  GND  ●─┼──────┼─● GND       │
    │  OUT  ●─┼──────┼─● D6/GPIO12 │
    └─────────┘      └─────────────┘
    
    [IR LED] [Photodiode]
    `,
    warning: "⚠️ Adjust the potentiometer on the module to set detection distance (2-30cm)!",
    testTip: "Place a white paper in front to test. Black surfaces may not reflect IR light well."
  },
  4: {
    title: "Connecting Bluetooth Module (HC-05)",
    components: ["HC-05 Bluetooth Module", "4 Jumper Wires", "Arduino/ESP8266", "1K & 2K Resistors (for voltage divider)"],
    steps: [
      { pin: "VCC", connect: "5V", wire: "Red", description: "Power pin - Connect to 5V" },
      { pin: "GND", connect: "GND", wire: "Black", description: "Ground pin - Connect to GND" },
      { pin: "TXD", connect: "D7 (GPIO13)", wire: "Green", description: "Transmit - Connect directly to RX pin" },
      { pin: "RXD", connect: "D8 (GPIO15)", wire: "Yellow", description: "Receive - Use voltage divider! (5V→3.3V)" }
    ],
    diagram: `
    HC-05            Arduino/ESP8266
    ┌─────────┐      ┌─────────────┐
    │  VCC  ●─┼──────┼─● 5V        │
    │  GND  ●─┼──────┼─● GND       │
    │  TXD  ●─┼──────┼─● D7/RX     │
    │  RXD  ●─┼─[VD]─┼─● D8/TX     │
    │ STATE ○ │      │             │
    │  EN   ○ │      │             │
    └─────────┘      └─────────────┘
    
    [VD] = Voltage Divider (2K + 1K)
    `,
    warning: "⚠️ HC-05 RXD pin is NOT 5V tolerant! Use a voltage divider (2K + 1K resistors) or it may damage the module!",
    testTip: "Pair with your phone (password: 1234 or 0000). LED blinks fast when searching, slow when connected."
  },
  5: {
    title: "Connecting Temperature Sensor (DHT11)",
    components: ["DHT11 Sensor", "3 Jumper Wires", "10K Resistor (optional pull-up)", "Arduino/ESP8266"],
    steps: [
      { pin: "VCC", connect: "3.3V or 5V", wire: "Red", description: "Power pin - Works with both voltages" },
      { pin: "DATA", connect: "D4 (GPIO2)", wire: "Yellow", description: "Data pin - Sends temperature & humidity readings" },
      { pin: "GND", connect: "GND", wire: "Black", description: "Ground pin - Connect to GND" }
    ],
    diagram: `
    DHT11            Arduino/ESP8266
    ┌─────────┐      ┌─────────────┐
    │  VCC  ●─┼──────┼─● 3.3V/5V   │
    │  DATA ●─┼──────┼─● D4/GPIO2  │
    │  NC   ○ │      │             │
    │  GND  ●─┼──────┼─● GND       │
    └─────────┘      └─────────────┘
    `,
    warning: "⚠️ Wait at least 2 seconds between readings. DHT11 is slow!",
    testTip: "Breathe warm air on the sensor to see temperature and humidity change."
  },
  6: {
    title: "Connecting Gas Sensor (MQ-2)",
    components: ["MQ-2 Gas Sensor Module", "4 Jumper Wires", "Arduino/ESP8266"],
    steps: [
      { pin: "VCC", connect: "5V", wire: "Red", description: "Power pin - Needs 5V for the heater element!" },
      { pin: "GND", connect: "GND", wire: "Black", description: "Ground pin - Connect to GND" },
      { pin: "A0", connect: "A0", wire: "Blue", description: "Analog output - Variable gas concentration reading" },
      { pin: "D0", connect: "D5 (GPIO14)", wire: "Yellow", description: "Digital output - HIGH/LOW based on threshold" }
    ],
    diagram: `
    MQ-2             Arduino/ESP8266
    ┌─────────┐      ┌─────────────┐
    │  VCC  ●─┼──────┼─● 5V        │
    │  GND  ●─┼──────┼─● GND       │
    │  A0   ●─┼──────┼─● A0        │
    │  D0   ●─┼──────┼─● D5/GPIO14 │
    └─────────┘      └─────────────┘
    `,
    warning: "⚠️ Sensor gets HOT! Let it warm up for 2-3 minutes before taking accurate readings.",
    testTip: "Use a lighter (press gas button without flame) near the sensor to test gas detection."
  },
  7: {
    title: "Connecting LDR Light Sensor",
    components: ["LDR (Photoresistor)", "10K Ohm Resistor", "3 Jumper Wires", "Breadboard", "Arduino/ESP8266"],
    steps: [
      { pin: "LDR Pin 1", connect: "3.3V", wire: "Red", description: "One leg of LDR connects to power" },
      { pin: "LDR Pin 2", connect: "A0 + Resistor to GND", wire: "Yellow", description: "Other leg to analog pin AND to resistor" },
      { pin: "Resistor", connect: "GND", wire: "Black", description: "10K resistor from junction point to Ground" }
    ],
    diagram: `
         3.3V
          │
         [LDR]
          │
    A0 ───┼─────────┐
          │         │
       [10K Ω]      │
          │         │
         GND ───────┘
    
    This creates a Voltage Divider!
    `,
    warning: "⚠️ The 10K resistor is REQUIRED to create the voltage divider circuit!",
    testTip: "Cover the LDR with your hand to see dark readings, shine flashlight for bright readings."
  },
  8: {
    title: "Connecting Soil Moisture Sensor",
    components: ["Soil Moisture Sensor + Module", "4 Jumper Wires", "Arduino/ESP8266"],
    steps: [
      { pin: "VCC", connect: "3.3V or 5V", wire: "Red", description: "Power pin - Only power when taking readings!" },
      { pin: "GND", connect: "GND", wire: "Black", description: "Ground pin - Connect to GND" },
      { pin: "A0", connect: "A0", wire: "Blue", description: "Analog output - Moisture level reading (0-1023)" }
    ],
    diagram: `
    Soil Module      Arduino/ESP8266
    ┌─────────┐      ┌─────────────┐
    │  VCC  ●─┼──────┼─● 3.3V/5V   │
    │  GND  ●─┼──────┼─● GND       │
    │  A0   ●─┼──────┼─● A0        │
    └─────────┘      └─────────────┘
           ║
    [Probe] ═══════ [Module]
    (Insert probe into soil)
    `,
    warning: "⚠️ Don't keep sensor powered continuously - causes electrode corrosion! Power only when reading.",
    testTip: "Dip the probe in water (100% wet) and in air (0% wet) to see the full range."
  },
  9: {
    title: "Connecting Sound Sensor (Microphone)",
    components: ["Sound Sensor Module", "4 Jumper Wires", "Arduino/ESP8266"],
    steps: [
      { pin: "VCC", connect: "3.3V or 5V", wire: "Red", description: "Power pin - Works with both voltages" },
      { pin: "GND", connect: "GND", wire: "Black", description: "Ground pin - Connect to GND" },
      { pin: "A0", connect: "A0", wire: "Blue", description: "Analog output - Sound intensity level" },
      { pin: "D0", connect: "D8 (GPIO15)", wire: "Yellow", description: "Digital output - HIGH when sound exceeds threshold" }
    ],
    diagram: `
    Sound Sensor     Arduino/ESP8266
    ┌─────────┐      ┌─────────────┐
    │  VCC  ●─┼──────┼─● 3.3V/5V   │
    │  GND  ●─┼──────┼─● GND       │
    │  A0   ●─┼──────┼─● A0        │
    │  D0   ●─┼──────┼─● D8/GPIO15 │
    └─────────┘      └─────────────┘
    
    [Microphone] [Potentiometer]
    `,
    warning: "⚠️ Adjust the potentiometer to set the sensitivity/threshold level!",
    testTip: "Clap your hands near the sensor to trigger sound detection."
  },
  10: {
    title: "Connecting ESP32-CAM (Computer Vision)",
    components: ["ESP32-CAM Module", "FTDI Programmer (USB-to-Serial)", "5 Jumper Wires", "5V Power Supply"],
    steps: [
      { pin: "5V", connect: "5V (FTDI)", wire: "Red", description: "Power pin - Connect to 5V power supply" },
      { pin: "GND", connect: "GND (FTDI)", wire: "Black", description: "Ground pin - Connect to common ground" },
      { pin: "U0T", connect: "RX (FTDI)", wire: "Green", description: "Transmit pin - Connect to FTDI RX" },
      { pin: "U0R", connect: "TX (FTDI)", wire: "Yellow", description: "Receive pin - Connect to FTDI TX" },
      { pin: "GPIO0", connect: "GND", wire: "Blue", description: "Flash mode - Connect to GND for programming, disconnect to run" }
    ],
    diagram: `
    ESP32-CAM        FTDI Programmer
    ┌─────────┐      ┌─────────────┐
    │   5V  ●─┼──────┼─● 5V        │
    │  GND  ●─┼──────┼─● GND       │
    │  U0T  ●─┼──────┼─● RX        │
    │  U0R  ●─┼──────┼─● TX        │
    │ GPIO0 ●─┼──┐   │             │
    └─────────┘  │   └─────────────┘
                 │
    For Programming: Connect GPIO0 to GND
    For Running: Disconnect GPIO0
    
    [OV2640 Camera on back]
    `,
    warning: "⚠️ GPIO0 must be connected to GND during upload, then disconnected to run! Press RST button after disconnecting GPIO0.",
    testTip: "After upload, open Serial Monitor at 115200 baud to see camera IP address. Access the stream from your browser!"
  }
};

// ==================== SAMPLE BLOCK CODE FOR TASK 3 ====================
const SAMPLE_BLOCK_CODES = {
  1: {
    title: "Security Alarm System",
    description: "Detect motion and trigger alarm when someone enters the room",
    blocks: [
      { id: 'loop_start', label: 'Loop Start (5x)', icon: '🔄', code: 'LOOP_START_5', category: 'control', color: '#8b5cf6' },
      { id: 'read_motion', label: 'Read Motion', icon: '🚶', code: 'READ_MOTION', category: 'sensor', color: '#ec4899' },
      { id: 'if_motion', label: 'If Motion Detected', icon: '👀', code: 'IF_MOTION_DETECTED', category: 'condition', color: '#a855f7' },
      { id: 'alarm_on', label: 'Security Alarm On', icon: '🚨', code: 'ALARM_ON', category: 'output', color: '#ef4444' },
      { id: 'led_on', label: 'LED On', icon: '💡', code: 'LED_ON', category: 'output', color: '#22c55e' },
      { id: 'delay1000', label: 'Wait 1 sec', icon: '⏱️', code: 'DELAY_1000', category: 'control', color: '#f59e0b' },
      { id: 'endif', label: 'End If', icon: '🔚', code: 'ENDIF', category: 'condition', color: '#a855f7' },
      { id: 'loop_end', label: 'Loop End', icon: '🔚', code: 'LOOP_END', category: 'control', color: '#8b5cf6' }
    ]
  },
  2: {
    title: "Obstacle Avoidance Program",
    description: "Make the car stop when an obstacle is detected within 20cm",
    blocks: [
      { id: 'loop_start', label: 'Loop Start (5x)', icon: '🔄', code: 'LOOP_START_5', category: 'control', color: '#8b5cf6' },
      { id: 'read_distance', label: 'Read Distance', icon: '📏', code: 'READ_DISTANCE', category: 'sensor', color: '#06b6d4' },
      { id: 'if_close', label: 'If Object < 20cm', icon: '🚧', code: 'IF_DISTANCE_LT_20', category: 'condition', color: '#a855f7' },
      { id: 'stop', label: 'Stop', icon: '🛑', code: 'STOP', category: 'motion', color: '#ef4444' },
      { id: 'buzzer', label: 'Buzzer Beep', icon: '🔔', code: 'BUZZER', category: 'output', color: '#ec4899' },
      { id: 'endif', label: 'End If', icon: '🔚', code: 'ENDIF', category: 'condition', color: '#a855f7' },
      { id: 'forward', label: 'Move Forward', icon: '⬆️', code: 'FORWARD', category: 'motion', color: '#3b82f6' },
      { id: 'delay500', label: 'Wait 0.5 sec', icon: '⏱️', code: 'DELAY_500', category: 'control', color: '#f59e0b' },
      { id: 'loop_end', label: 'Loop End', icon: '🔚', code: 'LOOP_END', category: 'control', color: '#8b5cf6' }
    ]
  },
  3: {
    title: "Line Following Robot",
    description: "Follow a black line on white surface",
    blocks: [
      { id: 'loop_start', label: 'Loop Start (5x)', icon: '🔄', code: 'LOOP_START_5', category: 'control', color: '#8b5cf6' },
      { id: 'read_ir', label: 'Read IR Sensor', icon: '📡', code: 'READ_IR', category: 'sensor', color: '#8b5cf6' },
      { id: 'if_line', label: 'If Line Detected', icon: '➖', code: 'IF_LINE_DETECTED', category: 'condition', color: '#a855f7' },
      { id: 'forward', label: 'Move Forward', icon: '⬆️', code: 'FORWARD', category: 'motion', color: '#3b82f6' },
      { id: 'endif', label: 'End If', icon: '🔚', code: 'ENDIF', category: 'condition', color: '#a855f7' },
      { id: 'if_no_line', label: 'If No Line', icon: '⬜', code: 'IF_NO_LINE', category: 'condition', color: '#a855f7' },
      { id: 'right', label: 'Turn Right', icon: '➡️', code: 'RIGHT', category: 'motion', color: '#3b82f6' },
      { id: 'endif', label: 'End If', icon: '🔚', code: 'ENDIF', category: 'condition', color: '#a855f7' },
      { id: 'loop_end', label: 'Loop End', icon: '🔚', code: 'LOOP_END', category: 'control', color: '#8b5cf6' }
    ]
  },
  4: {
    title: "Bluetooth Remote Control",
    description: "Control the car wirelessly using Bluetooth from your phone",
    blocks: [
      { id: 'loop_start', label: 'Loop Start (5x)', icon: '🔄', code: 'LOOP_START_5', category: 'control', color: '#8b5cf6' },
      { id: 'wait_bt', label: 'Wait for Bluetooth', icon: '📶', code: 'WAIT_BLUETOOTH', category: 'sensor', color: '#0ea5e9' },
      { id: 'if_forward', label: 'If Receive "F"', icon: '⬆️', code: 'IF_BT_FORWARD', category: 'condition', color: '#a855f7' },
      { id: 'forward', label: 'Move Forward', icon: '⬆️', code: 'FORWARD', category: 'motion', color: '#3b82f6' },
      { id: 'endif', label: 'End If', icon: '🔚', code: 'ENDIF', category: 'condition', color: '#a855f7' },
      { id: 'if_stop', label: 'If Receive "S"', icon: '🛑', code: 'IF_BT_STOP', category: 'condition', color: '#a855f7' },
      { id: 'stop', label: 'Stop', icon: '🛑', code: 'STOP', category: 'motion', color: '#ef4444' },
      { id: 'endif', label: 'End If', icon: '🔚', code: 'ENDIF', category: 'condition', color: '#a855f7' },
      { id: 'loop_end', label: 'Loop End', icon: '🔚', code: 'LOOP_END', category: 'control', color: '#8b5cf6' }
    ]
  },
  5: {
    title: "Temperature Alert System",
    description: "Turn on LED and buzzer when temperature exceeds 35°C",
    blocks: [
      { id: 'read_temp', label: 'Read Temperature', icon: '🌡️', code: 'READ_TEMP', category: 'sensor', color: '#ef4444' },
      { id: 'if_hot', label: 'If Temp > 35°C', icon: '🔥', code: 'IF_TEMP_GT_35', category: 'condition', color: '#a855f7' },
      { id: 'led_on', label: 'LED On', icon: '💡', code: 'LED_ON', category: 'output', color: '#22c55e' },
      { id: 'buzzer', label: 'Buzzer Beep', icon: '🔔', code: 'BUZZER', category: 'output', color: '#ec4899' },
      { id: 'delay1000', label: 'Wait 1 sec', icon: '⏱️', code: 'DELAY_1000', category: 'control', color: '#f59e0b' },
      { id: 'endif', label: 'End If', icon: '🔚', code: 'ENDIF', category: 'condition', color: '#a855f7' },
      { id: 'led_off', label: 'LED Off', icon: '🔌', code: 'LED_OFF', category: 'output', color: '#22c55e' }
    ]
  },
  6: {
    title: "Gas Leak Alarm",
    description: "Activate alarm when gas level is dangerous",
    blocks: [
      { id: 'read_gas', label: 'Read Gas Level', icon: '💨', code: 'READ_GAS', category: 'sensor', color: '#84cc16' },
      { id: 'if_gas_high', label: 'If Gas > 40%', icon: '⚠️', code: 'IF_GAS_GT_40', category: 'condition', color: '#a855f7' },
      { id: 'alarm_on', label: 'Alarm On', icon: '🚨', code: 'ALARM_ON', category: 'output', color: '#ef4444' },
      { id: 'led_on', label: 'LED On', icon: '💡', code: 'LED_ON', category: 'output', color: '#22c55e' },
      { id: 'delay2000', label: 'Wait 2 sec', icon: '⏱️', code: 'DELAY_2000', category: 'control', color: '#f59e0b' },
      { id: 'endif', label: 'End If', icon: '🔚', code: 'ENDIF', category: 'condition', color: '#a855f7' },
      { id: 'alarm_off', label: 'Alarm Off', icon: '🔕', code: 'ALARM_OFF', category: 'output', color: '#22c55e' }
    ]
  },
  7: {
    title: "Automatic Headlights",
    description: "Turn on lights when it gets dark",
    blocks: [
      { id: 'read_light', label: 'Read Light Level', icon: '💡', code: 'READ_LIGHT', category: 'sensor', color: '#eab308' },
      { id: 'if_dark', label: 'If Dark < 20%', icon: '🌙', code: 'IF_LIGHT_LT_20', category: 'condition', color: '#a855f7' },
      { id: 'headlight_on', label: 'Headlight On', icon: '🔦', code: 'HEADLIGHT_ON', category: 'output', color: '#eab308' },
      { id: 'buzzer', label: 'Buzzer Beep', icon: '🔔', code: 'BUZZER', category: 'output', color: '#ec4899' },
      { id: 'endif', label: 'End If', icon: '🔚', code: 'ENDIF', category: 'condition', color: '#a855f7' },
      { id: 'if_bright', label: 'If Bright > 70%', icon: '☀️', code: 'IF_LIGHT_GT_70', category: 'condition', color: '#a855f7' },
      { id: 'headlight_off', label: 'Headlight Off', icon: '🔌', code: 'HEADLIGHT_OFF', category: 'output', color: '#eab308' },
      { id: 'endif', label: 'End If', icon: '🔚', code: 'ENDIF', category: 'condition', color: '#a855f7' }
    ]
  },
  8: {
    title: "Smart Plant Watering System",
    description: "Create an automatic irrigation system that waters plants when soil is dry and stops when wet",
    blocks: [
      { id: 'loop_start', label: 'Loop Start (5x)', icon: '🔄', code: 'LOOP_START_5', category: 'control', color: '#8b5cf6' },
      { id: 'read_moisture', label: 'Read Moisture', icon: '🌱', code: 'READ_MOISTURE', category: 'sensor', color: '#22c55e' },
      { id: 'if_dry', label: 'If Soil Dry < 30%', icon: '🏜️', code: 'IF_MOISTURE_LT_30', category: 'condition', color: '#a855f7' },
      { id: 'led_on', label: 'LED On', icon: '💡', code: 'LED_ON', category: 'output', color: '#22c55e' },
      { id: 'buzzer', label: 'Buzzer Beep', icon: '🔔', code: 'BUZZER', category: 'output', color: '#ec4899' },
      { id: 'pump_on', label: 'Water Pump On', icon: '🚿', code: 'PUMP_ON', category: 'output', color: '#06b6d4' },
      { id: 'delay2000', label: 'Wait 2 sec', icon: '⏱️', code: 'DELAY_2000', category: 'control', color: '#f59e0b' },
      { id: 'pump_off', label: 'Water Pump Off', icon: '🔌', code: 'PUMP_OFF', category: 'output', color: '#06b6d4' },
      { id: 'endif', label: 'End If', icon: '🔚', code: 'ENDIF', category: 'condition', color: '#a855f7' },
      { id: 'if_wet', label: 'If Soil Wet > 60%', icon: '💧', code: 'IF_MOISTURE_GT_60', category: 'condition', color: '#a855f7' },
      { id: 'led_off', label: 'LED Off', icon: '🔌', code: 'LED_OFF', category: 'output', color: '#22c55e' },
      { id: 'endif', label: 'End If', icon: '🔚', code: 'ENDIF', category: 'condition', color: '#a855f7' },
      { id: 'delay1000', label: 'Wait 1 sec', icon: '⏱️', code: 'DELAY_1000', category: 'control', color: '#f59e0b' },
      { id: 'loop_end', label: 'Loop End', icon: '🔚', code: 'LOOP_END', category: 'control', color: '#8b5cf6' }
    ]
  },
  9: {
    title: "Clap Switch Light",
    description: "Toggle light with clap sound",
    blocks: [
      { id: 'read_sound', label: 'Read Sound Level', icon: '🔊', code: 'READ_SOUND', category: 'sensor', color: '#6366f1' },
      { id: 'if_loud', label: 'If Sound > 70%', icon: '📢', code: 'IF_SOUND_GT_70', category: 'condition', color: '#a855f7' },
      { id: 'led_on', label: 'LED On', icon: '💡', code: 'LED_ON', category: 'output', color: '#22c55e' },
      { id: 'buzzer', label: 'Buzzer Beep', icon: '🔔', code: 'BUZZER', category: 'output', color: '#ec4899' },
      { id: 'delay2000', label: 'Wait 2 sec', icon: '⏱️', code: 'DELAY_2000', category: 'control', color: '#f59e0b' },
      { id: 'led_off', label: 'LED Off', icon: '🔌', code: 'LED_OFF', category: 'output', color: '#22c55e' },
      { id: 'endif', label: 'End If', icon: '🔚', code: 'ENDIF', category: 'condition', color: '#a855f7' }
    ]
  },
  10: {
    title: "AI Face Detection System",
    description: "Detect faces using ESP32-CAM and trigger alerts - Complete your STEMify journey!",
    blocks: [
      { id: 'start_camera', label: 'Start Camera', icon: '📷', code: 'START_CAMERA', category: 'sensor', color: '#f43f5e' },
      { id: 'loop_start', label: 'Loop Start (5x)', icon: '🔄', code: 'LOOP_START_5', category: 'control', color: '#8b5cf6' },
      { id: 'capture', label: 'Capture Frame', icon: '📸', code: 'CAPTURE_FRAME', category: 'sensor', color: '#f43f5e' },
      { id: 'if_face', label: 'If Face Detected', icon: '👤', code: 'IF_FACE_DETECTED', category: 'condition', color: '#a855f7' },
      { id: 'led_on', label: 'LED On', icon: '💡', code: 'LED_ON', category: 'output', color: '#22c55e' },
      { id: 'buzzer', label: 'Buzzer Beep', icon: '🔔', code: 'BUZZER', category: 'output', color: '#ec4899' },
      { id: 'send_alert', label: 'Send Alert', icon: '📤', code: 'SEND_ALERT', category: 'output', color: '#0ea5e9' },
      { id: 'endif', label: 'End If', icon: '🔚', code: 'ENDIF', category: 'condition', color: '#a855f7' },
      { id: 'delay1000', label: 'Wait 1 sec', icon: '⏱️', code: 'DELAY_1000', category: 'control', color: '#f59e0b' },
      { id: 'loop_end', label: 'Loop End', icon: '🔚', code: 'LOOP_END', category: 'control', color: '#8b5cf6' }
    ]
  }
};

// ==================== LEVEL QUIZZES (Simple questions related to tasks) ====================
const DEFAULT_QUIZZES = {
  1: {
    questions: [
      { question: "What does PIR stand for?", options: ["Passive Infrared", "Power Infrared", "Pulse Infrared", "Proximity Infrared"], correctAnswer: 0 },
      { question: "What does PIR sensor detect?", options: ["Sound", "Light changes", "Motion/movement", "Temperature"], correctAnswer: 2 },
      { question: "How long should you wait after powering PIR sensor?", options: ["1 second", "30-60 seconds", "10 minutes", "1 hour"], correctAnswer: 1 },
      { question: "What voltage does HC-SR501 PIR sensor need?", options: ["3.3V", "5V", "12V", "9V"], correctAnswer: 1 },
      { question: "In security system, what happens when motion is detected?", options: ["Nothing", "Alarm turns on", "Temperature reading", "Gas detection"], correctAnswer: 1 }
    ],
    passPercentage: 60
  },
  2: {
    questions: [
      { question: "What does the Ultrasonic Sensor (HC-SR04) measure?", options: ["Temperature", "Distance", "Light", "Sound"], correctAnswer: 1 },
      { question: "Which pin sends the ultrasonic pulse?", options: ["VCC", "GND", "TRIG", "ECHO"], correctAnswer: 2 },
      { question: "What is the range of HC-SR04 sensor?", options: ["1cm - 50cm", "2cm - 400cm", "10cm - 1000cm", "5cm - 100cm"], correctAnswer: 1 },
      { question: "In block coding, which block should you use before 'If Object < 20cm'?", options: ["Move Forward", "Read Distance", "Stop", "Buzzer"], correctAnswer: 1 },
      { question: "What technique does ultrasonic sensor use (same as bats)?", options: ["X-ray", "Echolocation", "Magnetism", "Heat sensing"], correctAnswer: 1 }
    ],
    passPercentage: 60
  },
  3: {
    questions: [
      { question: "What type of light does IR sensor use?", options: ["Visible light", "Infrared light", "UV light", "Laser"], correctAnswer: 1 },
      { question: "What is the IR sensor best used for?", options: ["Measuring temperature", "Line following robots", "Sound detection", "Gas detection"], correctAnswer: 1 },
      { question: "What surface reflects IR light better?", options: ["Black surface", "White surface", "Transparent surface", "Water"], correctAnswer: 1 },
      { question: "How do you adjust IR sensor detection range?", options: ["Change voltage", "Turn potentiometer", "Add resistor", "Change code"], correctAnswer: 1 },
      { question: "What does the IR sensor output when an obstacle is detected?", options: ["Always HIGH", "Always LOW", "LOW signal", "No signal"], correctAnswer: 2 }
    ],
    passPercentage: 60
  },
  4: {
    questions: [
      { question: "What wireless technology does HC-05 use?", options: ["WiFi", "Bluetooth", "Zigbee", "NFC"], correctAnswer: 1 },
      { question: "What is the default password for HC-05?", options: ["0000", "1234", "admin", "password"], correctAnswer: 1 },
      { question: "What is the range of Bluetooth communication?", options: ["1 meter", "Up to 10 meters", "100 meters", "1 km"], correctAnswer: 1 },
      { question: "Why do we need a voltage divider for HC-05 RXD pin?", options: ["To increase voltage", "To convert 5V to 3.3V", "To filter noise", "To save power"], correctAnswer: 1 },
      { question: "Who was Bluetooth named after?", options: ["A scientist", "A Viking king", "A mountain", "An inventor"], correctAnswer: 1 }
    ],
    passPercentage: 60
  },
  5: {
    questions: [
      { question: "What does DHT11 sensor measure?", options: ["Only Temperature", "Only Humidity", "Temperature and Humidity", "Distance"], correctAnswer: 2 },
      { question: "How many pins does DHT11 need for connection?", options: ["2 pins", "3 pins", "4 pins", "5 pins"], correctAnswer: 1 },
      { question: "What is the temperature range of DHT11?", options: ["0°C to 50°C", "-40°C to 80°C", "10°C to 100°C", "-10°C to 60°C"], correctAnswer: 0 },
      { question: "Why should you wait between DHT11 readings?", options: ["It gets hot", "Sensor is slow", "Saves power", "Better accuracy"], correctAnswer: 1 },
      { question: "In the sample code, what triggers the LED to turn on?", options: ["Temp < 20°C", "Temp > 35°C", "Humidity > 80%", "Button press"], correctAnswer: 1 }
    ],
    passPercentage: 60
  },
  6: {
    questions: [
      { question: "What gases can MQ-2 sensor detect?", options: ["Only oxygen", "LPG, Smoke, Methane", "Only CO2", "Water vapor"], correctAnswer: 1 },
      { question: "Why does MQ-2 sensor need warm-up time?", options: ["To charge battery", "To heat internal element", "To connect WiFi", "To save data"], correctAnswer: 1 },
      { question: "What voltage does MQ-2 heater need?", options: ["3.3V", "5V", "12V", "9V"], correctAnswer: 1 },
      { question: "Which output gives variable gas reading?", options: ["VCC", "GND", "A0 (Analog)", "D0 (Digital)"], correctAnswer: 2 },
      { question: "In the alarm program, what happens when Gas > 40%?", options: ["LED Off", "Alarm On", "Move Forward", "Read Temperature"], correctAnswer: 1 }
    ],
    passPercentage: 60
  },
  7: {
    questions: [
      { question: "What does LDR stand for?", options: ["Light Dependent Resistor", "Low Distance Reader", "Light Digital Receiver", "Laser Distance Reader"], correctAnswer: 0 },
      { question: "What happens to LDR resistance in bright light?", options: ["Increases", "Decreases", "Stays same", "Becomes zero"], correctAnswer: 1 },
      { question: "What extra component does LDR need?", options: ["Capacitor", "10K Resistor", "Transistor", "Diode"], correctAnswer: 1 },
      { question: "In the block code, when should headlights turn on?", options: ["When bright", "When dark < 20%", "When hot", "When motion detected"], correctAnswer: 1 },
      { question: "LDR is commonly used in which device?", options: ["Gas detector", "Automatic street lights", "Thermometer", "Speedometer"], correctAnswer: 1 }
    ],
    passPercentage: 60
  },
  8: {
    questions: [
      { question: "What does soil moisture sensor measure?", options: ["Soil temperature", "Water content in soil", "Soil pH", "Sunlight"], correctAnswer: 1 },
      { question: "Why shouldn't you power the sensor continuously?", options: ["Uses too much power", "Causes corrosion", "Breaks the sensor", "Wrong readings"], correctAnswer: 1 },
      { question: "Wet soil has what kind of resistance?", options: ["High resistance", "Low resistance", "No resistance", "Infinite resistance"], correctAnswer: 1 },
      { question: "What does 'Soil Dry < 30%' mean in block code?", options: ["Plant needs water", "Too much water", "Perfect moisture", "Sensor error"], correctAnswer: 0 },
      { question: "What should turn on when soil is dry?", options: ["Heater", "Water Pump", "Fan", "Alarm"], correctAnswer: 1 }
    ],
    passPercentage: 60
  },
  9: {
    questions: [
      { question: "What does sound sensor detect?", options: ["Light", "Temperature", "Sound waves", "Distance"], correctAnswer: 2 },
      { question: "What component is inside sound sensor module?", options: ["Camera", "Microphone", "Speaker", "Motor"], correctAnswer: 1 },
      { question: "How do you adjust sound sensor sensitivity?", options: ["Change code", "Turn potentiometer", "Add resistor", "Change voltage"], correctAnswer: 1 },
      { question: "In clap switch, when does LED turn on?", options: ["When quiet", "When sound > 70%", "When dark", "When hot"], correctAnswer: 1 },
      { question: "Sound sensor is commonly used for?", options: ["Gas detection", "Voice-activated systems", "Temperature control", "Distance measurement"], correctAnswer: 1 }
    ],
    passPercentage: 60
  },
  10: {
    questions: [
      { question: "What camera does ESP32-CAM use?", options: ["OV7670", "OV2640", "Raspberry Pi Cam", "Webcam"], correctAnswer: 1 },
      { question: "What is Computer Vision used for?", options: ["Only taking photos", "Face detection & object recognition", "Playing music", "Temperature sensing"], correctAnswer: 1 },
      { question: "What should GPIO0 be connected to during programming?", options: ["5V", "GND", "3.3V", "Nothing"], correctAnswer: 1 },
      { question: "What technology do self-driving cars use?", options: ["Only GPS", "Computer Vision with cameras", "Only radar", "Manual driving"], correctAnswer: 1 },
      { question: "After completing Level 10, you receive:", options: ["Nothing", "STEMify Master Engineer Certificate!", "A toy car", "Only XP points"], correctAnswer: 1 }
    ],
    passPercentage: 60
  }
};

// Import course content upload function
import { uploadAllContent } from './setupContent.js';

// ==================== Context ====================
const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const userRef = ref(realtimeDb, `users/${firebaseUser.uid}`);
        const unsubData = onValue(userRef, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            setUserRole(data.role);
            setUserData(data);
          }
          setLoading(false);
        });
        return () => unsubData();
      } else {
        setUser(null);
        setUserRole(null);
        setUserData(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result;
  };

  const register = async (email, password, role, additionalData = {}) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await set(ref(realtimeDb, `users/${result.user.uid}`), {
      email,
      role,
      createdAt: Date.now(),
      ...additionalData
    });
    return result;
  };

  const logout = async () => {
    await signOut(auth);
  };

  const updateUserData = async (updates) => {
    if (user) {
      await update(ref(realtimeDb, `users/${user.uid}`), updates);
    }
  };

  return (
    <AuthContext.Provider value={{ user, userRole, userData, loading, login, register, logout, updateUserData }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  return useContext(AuthContext);
}

// ==================== Protected Route ====================
function ProtectedRoute({ children, allowedRoles }) {
  const { user, userRole, loading } = useAuth();
  
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/" replace />;
  if (allowedRoles && !allowedRoles.includes(userRole)) return <Navigate to="/" replace />;
  
  return children;
}

// ==================== Loading Screen ====================
function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="loader">
        <div className="loader-car">🚗</div>
        <span>Loading STEMify...</span>
      </div>
    </div>
  );
}

// ==================== Landing Page ====================
function LandingPage() {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && userRole) {
      navigate(`/${userRole}`);
    }
  }, [user, userRole, navigate]);

  const roles = [
    { id: 'admin', icon: '👨‍💼', title: 'Admin', desc: 'Manage tasks, quizzes & monitor students', color: '#f59e0b' },
    { id: 'student', icon: '👨‍🎓', title: 'Student', desc: 'Learn, build & control your ESP32 car', color: '#14b8a6' },
    { id: 'parent', icon: '👨‍👩‍👧', title: 'Parent', desc: 'Track your child\'s learning progress', color: '#8b5cf6' }
  ];

  return (
    <div className="landing-page">
      <div className="landing-bg">
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>
        <div className="bg-shape shape-3"></div>
        <div className="floating-car">🚗</div>
      </div>

      <header className="landing-header">
        <div className="logo-large">
          <div className="logo-icon-large">🔬</div>
          <h1>STEMify</h1>
          <p className="tagline">Build, Code & Control Your ESP32 Car</p>
        </div>
      </header>

      <main className="landing-main">
        <h2 className="select-title">Select Your Portal</h2>
        <div className="role-cards">
          {roles.map((role, index) => (
            <div 
              key={role.id} 
              className="role-card"
              style={{ '--card-color': role.color, animationDelay: `${index * 100}ms` }}
              onClick={() => navigate(`/login/${role.id}`)}
            >
              <div className="role-icon">{role.icon}</div>
              <h3>{role.title}</h3>
              <p>{role.desc}</p>
              <button className="role-btn">
                Enter Portal
                <span className="btn-arrow">→</span>
              </button>
            </div>
          ))}
        </div>

        <div className="features-preview">
          <h3>🎯 10 Levels of Learning</h3>
          <div className="level-preview">
            {Object.entries(LEVEL_CONFIG).map(([level, config]) => (
              <div key={level} className="level-chip" style={{ '--chip-color': config.color }}>
                <span>{config.icon}</span>
                <span>L{level}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="landing-footer">
        <p>© 2024 STEMify - Empowering Future Innovators</p>
      </footer>
    </div>
  );
}

// ==================== Auth Pages ====================
function AuthPage({ role }) {
  const [isLogin, setIsLogin] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [adminPin, setAdminPin] = useState('');
  const [childName, setChildName] = useState('');
  const [childCode, setChildCode] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    setLoading(true);
    setError('');
    setSuccessMsg('');
    try {
      await resetPassword(email);
      setSuccessMsg('✅ Password reset email sent! Check your inbox.');
      setTimeout(() => {
        setShowForgotPassword(false);
        setSuccessMsg('');
      }, 3000);
    } catch (err) {
      setError(err.message.replace('Firebase: ', ''));
    }
    setLoading(false);
  };

  const roleConfig = {
    admin: { icon: '👨‍💼', title: 'Admin Portal', color: '#f59e0b' },
    student: { icon: '👨‍🎓', title: 'Student Portal', color: '#14b8a6' },
    parent: { icon: '👨‍👩‍👧', title: 'Parent Portal', color: '#8b5cf6' }
  };

  const config = roleConfig[role];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
        navigate(`/${role}`);
      } else {
        // Registration
        if (role === 'admin') {
          // Verify admin PIN
          if (adminPin !== ADMIN_PIN) {
            setError('Invalid Admin PIN. Contact system administrator.');
            setLoading(false);
            return;
          }
        }

        const additionalData = { name };
        
        if (role === 'student') {
          additionalData.level = 1;
          additionalData.xp = 0;
          additionalData.completedTasks = [];
          additionalData.quizScores = {};
          additionalData.studentCode = Math.random().toString(36).substring(2, 8).toUpperCase();
          additionalData.carConnected = false;
          additionalData.totalTasksCompleted = 0;
        }
        
        if (role === 'parent') {
          additionalData.children = [];
          if (childCode && childName) {
            additionalData.children = [{ code: childCode.toUpperCase(), name: childName }];
          }
        }
        
        await register(email, password, role, additionalData);
        navigate(`/${role}`);
      }
    } catch (err) {
      setError(err.message.replace('Firebase: ', ''));
    }
    setLoading(false);
  };

  return (
    <div className="auth-page" style={{ '--role-color': config.color }}>
      <div className="auth-bg">
        <div className="auth-shape s1"></div>
        <div className="auth-shape s2"></div>
      </div>

      <Link to="/" className="back-link">← Back to Portal Selection</Link>

      <div className="auth-container">
        <div className="auth-header">
          <span className="auth-icon">{config.icon}</span>
          <h1>{config.title}</h1>
          <p>{isLogin ? 'Welcome back!' : 'Create your account'}</p>
        </div>

        <div className="auth-toggle">
          <button className={isLogin ? 'active' : ''} onClick={() => setIsLogin(true)}>Login</button>
          <button className={!isLogin ? 'active' : ''} onClick={() => setIsLogin(false)}>Register</button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>Email Address *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label>Password *</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              minLength={6}
            />
          </div>

          {isLogin && (
            <div className="forgot-password-link">
              <button 
                type="button" 
                className="forgot-btn"
                onClick={() => setShowForgotPassword(true)}
              >
                🔑 Forgot Password?
              </button>
            </div>
          )}

          {/* Admin PIN field */}
          {!isLogin && role === 'admin' && (
            <div className="form-group pin-group">
              <label>🔐 Admin Secret PIN *</label>
              <input
                type="password"
                value={adminPin}
                onChange={(e) => setAdminPin(e.target.value)}
                placeholder="Enter admin PIN"
                required
                maxLength={5}
              />
              <small>Contact administrator for PIN</small>
            </div>
          )}

          {/* Parent child linking */}
          {!isLogin && role === 'parent' && (
            <>
              <div className="form-group">
                <label>Child's Name</label>
                <input
                  type="text"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  placeholder="Enter child's name"
                />
              </div>
              <div className="form-group">
                <label>Child's Student Code</label>
                <input
                  type="text"
                  value={childCode}
                  onChange={(e) => setChildCode(e.target.value.toUpperCase())}
                  placeholder="e.g., ABC123"
                  maxLength={6}
                />
                <small>Get this code from your child's dashboard</small>
              </div>
            </>
          )}

          {error && <div className="error-msg">{error}</div>}
          {successMsg && <div className="success-msg">{successMsg}</div>}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Create Account')}
          </button>
        </form>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="modal-overlay" onClick={() => setShowForgotPassword(false)}>
          <div className="modal forgot-password-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowForgotPassword(false)}>×</button>
            <h2>🔑 Reset Password</h2>
            <p>Enter your email address and we'll send you a password reset link.</p>
            
            <form onSubmit={handleForgotPassword} className="forgot-form">
              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your registered email"
                  required
                />
              </div>

              {error && <div className="error-msg">{error}</div>}
              {successMsg && <div className="success-msg">{successMsg}</div>}

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>

            <p className="modal-note">
              📧 Check your inbox (and spam folder) for the reset email.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== Admin Dashboard ====================
function AdminDashboard() {
  const { user, userData, logout } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [tasks, setTasks] = useState({});
  const [quizzes, setQuizzes] = useState({});
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedLevel, setSelectedLevel] = useState(1);
  
  // Task form
  const [taskForm, setTaskForm] = useState({
    title: '', description: '', type: 'wiring', instructions: ''
  });
  
  // Quiz form
  const [quizForm, setQuizForm] = useState({
    questions: [{ question: '', options: ['', '', '', ''], correctAnswer: 0 }]
  });

  useEffect(() => {
    // Load all students
    const usersRef = ref(realtimeDb, 'users');
    const unsubUsers = onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const studentList = Object.entries(data)
          .filter(([id, user]) => user.role === 'student')
          .map(([id, user]) => ({ id, ...user }));
        setStudents(studentList);
      }
    });

    // Load all tasks
    const tasksRef = ref(realtimeDb, 'levelTasks');
    const unsubTasks = onValue(tasksRef, (snapshot) => {
      setTasks(snapshot.val() || {});
    });

    // Load all quizzes
    const quizzesRef = ref(realtimeDb, 'levelQuizzes');
    const unsubQuizzes = onValue(quizzesRef, (snapshot) => {
      setQuizzes(snapshot.val() || {});
    });

    return () => { unsubUsers(); unsubTasks(); unsubQuizzes(); };
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();
    const levelTasks = tasks[selectedLevel] || [];
    if (levelTasks.length >= TASKS_PER_LEVEL) {
      alert(`Level ${selectedLevel} already has ${TASKS_PER_LEVEL} tasks!`);
      return;
    }
    
    const newTask = {
      ...taskForm,
      id: Date.now(),
      taskNumber: levelTasks.length + 1,
      level: selectedLevel,
      sensor: LEVEL_CONFIG[selectedLevel].sensor
    };
    
    await set(ref(realtimeDb, `levelTasks/${selectedLevel}`), [...levelTasks, newTask]);
    setTaskForm({ title: '', description: '', type: 'wiring', instructions: '' });
  };

  const handleDeleteTask = async (level, taskIndex) => {
    const levelTasks = [...(tasks[level] || [])];
    levelTasks.splice(taskIndex, 1);
    // Re-number tasks
    levelTasks.forEach((task, idx) => task.taskNumber = idx + 1);
    await set(ref(realtimeDb, `levelTasks/${level}`), levelTasks);
  };

  const handleAddQuizQuestion = () => {
    setQuizForm(prev => ({
      questions: [...prev.questions, { question: '', options: ['', '', '', ''], correctAnswer: 0 }]
    }));
  };

  const handleQuizQuestionChange = (index, field, value) => {
    setQuizForm(prev => {
      const newQuestions = [...prev.questions];
      if (field === 'question') {
        newQuestions[index].question = value;
      } else if (field === 'correctAnswer') {
        newQuestions[index].correctAnswer = parseInt(value);
      } else {
        newQuestions[index].options[field] = value;
      }
      return { questions: newQuestions };
    });
  };

  const handleSaveQuiz = async () => {
    if (quizForm.questions.some(q => !q.question || q.options.some(o => !o))) {
      alert('Please fill all quiz fields!');
      return;
    }
    await set(ref(realtimeDb, `levelQuizzes/${selectedLevel}`), {
      questions: quizForm.questions,
      passPercentage: QUIZ_PASS_PERCENTAGE,
      level: selectedLevel
    });
    alert(`Quiz for Level ${selectedLevel} saved!`);
  };

  const loadExistingQuiz = (level) => {
    if (quizzes[level]) {
      setQuizForm({ questions: quizzes[level].questions });
    } else {
      setQuizForm({ questions: [{ question: '', options: ['', '', '', ''], correctAnswer: 0 }] });
    }
  };

  useEffect(() => {
    loadExistingQuiz(selectedLevel);
  }, [selectedLevel, quizzes]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Stats calculations
  const totalTasks = Object.values(tasks).flat().length;
  const totalQuizzes = Object.keys(quizzes).length;
  const avgLevel = students.length ? (students.reduce((a, s) => a + (s.level || 1), 0) / students.length).toFixed(1) : 0;

  return (
    <div className="dashboard admin-dashboard">
      <nav className="dash-nav">
        <div className="dash-nav-left">
          <div className="dash-logo">
            <span className="logo-hex">🔬</span>
            <span>STEMify</span>
            <span className="role-badge admin">Admin</span>
          </div>
        </div>
        <div className="dash-nav-right">
          <span className="user-email">{userData?.name}</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </nav>

      <div className="tab-nav">
        <button className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
          📊 Dashboard
        </button>
        <button className={activeTab === 'students' ? 'active' : ''} onClick={() => setActiveTab('students')}>
          👨‍🎓 Students ({students.length})
        </button>
        <button className={activeTab === 'tasks' ? 'active' : ''} onClick={() => setActiveTab('tasks')}>
          📋 Tasks
        </button>
        <button className={activeTab === 'quizzes' ? 'active' : ''} onClick={() => setActiveTab('quizzes')}>
          🎯 Quizzes
        </button>
      </div>

      <main className="dash-main">
        {activeTab === 'dashboard' && (
          <>
            <header className="dash-header">
              <h1>Admin Dashboard</h1>
              <p>Manage learning content and monitor student progress</p>
            </header>

            {/* Quick Setup - Upload All Course Content */}
            {totalTasks === 0 && (
              <div className="setup-banner">
                <div className="setup-icon">🚀</div>
                <div className="setup-text">
                  <h3>Quick Setup Available!</h3>
                  <p>Upload complete course content (10 levels, 30 tasks, 10 quizzes) with one click</p>
                </div>
                <button 
                  className="setup-btn"
                  onClick={async () => {
                    if (confirm('Upload complete course content? This will add all 10 levels with tasks and quizzes.')) {
                      const success = await uploadAllContent();
                      if (success) {
                        alert('✅ All content uploaded successfully! Refresh to see changes.');
                        window.location.reload();
                      }
                    }
                  }}
                >
                  📚 Upload All Content
                </button>
              </div>
            )}

            <div className="stats-grid">
              <div className="stat-card"><span className="stat-icon">👨‍🎓</span>
                <div className="stat-info"><span className="stat-value">{students.length}</span><span className="stat-label">Students</span></div>
              </div>
              <div className="stat-card"><span className="stat-icon">📚</span>
                <div className="stat-info"><span className="stat-value">{totalTasks}</span><span className="stat-label">Total Tasks</span></div>
              </div>
              <div className="stat-card"><span className="stat-icon">🎯</span>
                <div className="stat-info"><span className="stat-value">{totalQuizzes}/10</span><span className="stat-label">Quizzes Created</span></div>
              </div>
              <div className="stat-card"><span className="stat-icon">📈</span>
                <div className="stat-info"><span className="stat-value">{avgLevel}</span><span className="stat-label">Avg Level</span></div>
              </div>
            </div>

            {/* Level Overview */}
            <section className="dash-section">
              <h2>📊 Level Overview</h2>
              <div className="level-overview-grid">
                {Array.from({ length: TOTAL_LEVELS }, (_, i) => i + 1).map(level => {
                  const levelConfig = LEVEL_CONFIG[level];
                  const levelTaskCount = (tasks[level] || []).length;
                  const hasQuiz = !!quizzes[level];
                  const studentsAtLevel = students.filter(s => s.level === level).length;
                  
                  return (
                    <div key={level} className="level-overview-card" style={{ '--level-color': levelConfig.color }}>
                      <div className="level-header">
                        <span className="level-icon">{levelConfig.icon}</span>
                        <span className="level-num">Level {level}</span>
                      </div>
                      <div className="level-sensor">{levelConfig.sensor}</div>
                      <div className="level-stats">
                        <div className="level-stat">
                          <span>{levelTaskCount}/{TASKS_PER_LEVEL}</span>
                          <small>Tasks</small>
                        </div>
                        <div className="level-stat">
                          <span>{hasQuiz ? '✅' : '❌'}</span>
                          <small>Quiz</small>
                        </div>
                        <div className="level-stat">
                          <span>{studentsAtLevel}</span>
                          <small>Students</small>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </>
        )}

        {activeTab === 'students' && (
          <section className="dash-section">
            <h2>👨‍🎓 Registered Students</h2>
            <p className="section-hint">💡 Copy the Firebase User ID to configure ESP32 for each student</p>
            <div className="students-table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Student Code</th>
                    <th>🔑 Firebase User ID (for ESP32)</th>
                    <th>Level</th>
                    <th>XP</th>
                    <th>Tasks</th>
                    <th>Quiz Scores</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(student => (
                    <tr key={student.id}>
                      <td><strong>{student.name}</strong></td>
                      <td>{student.email}</td>
                      <td><code className="student-code-cell">{student.studentCode}</code></td>
                      <td>
                        <div className="user-id-cell">
                          <code className="user-id-code">{student.id}</code>
                          <button 
                            className="copy-id-btn"
                            onClick={() => {
                              navigator.clipboard.writeText(student.id);
                              alert(`✅ Copied User ID for ${student.name}!\n\nPaste this in ESP32 code:\nString STUDENT_USER_ID = "${student.id}";`);
                            }}
                            title="Copy User ID"
                          >
                            📋 Copy
                          </button>
                        </div>
                      </td>
                      <td>
                        <span className="level-badge" style={{ background: LEVEL_CONFIG[student.level || 1]?.color }}>
                          Level {student.level || 1}
                        </span>
                      </td>
                      <td>{student.xp || 0}</td>
                      <td>{student.totalTasksCompleted || 0}</td>
                      <td>
                        {student.quizScores ? 
                          Object.entries(student.quizScores).map(([lvl, score]) => (
                            <span key={lvl} className="quiz-score-badge">L{lvl}: {score}%</span>
                          )) : '-'
                        }
                      </td>
                    </tr>
                  ))}
                  {students.length === 0 && (
                    <tr><td colSpan="8" className="empty-row">No students registered yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* ESP32 Setup Instructions */}
            <div className="esp32-instructions">
              <h3>🔌 How to Connect Student's ESP32:</h3>
              <ol>
                <li>Click <strong>"📋 Copy"</strong> next to the student's User ID</li>
                <li>Open <code>esp32/STEMify_Car_Complete.ino</code> in Arduino IDE</li>
                <li>Find this line and paste the ID:
                  <pre>String STUDENT_USER_ID = "PASTE_ID_HERE";</pre>
                </li>
                <li>Update WiFi credentials</li>
                <li>Upload to ESP32</li>
                <li>Student's dashboard will show "Car: Online" ✅</li>
              </ol>
            </div>
          </section>
        )}

        {activeTab === 'tasks' && (
          <section className="dash-section">
            <h2>📋 Task Management</h2>
            
            {/* Level Selector */}
            <div className="level-selector">
              <label>Select Level:</label>
              <div className="level-buttons">
                {Array.from({ length: TOTAL_LEVELS }, (_, i) => i + 1).map(level => (
                  <button
                    key={level}
                    className={selectedLevel === level ? 'active' : ''}
                    onClick={() => setSelectedLevel(level)}
                    style={{ '--btn-color': LEVEL_CONFIG[level].color }}
                  >
                    {LEVEL_CONFIG[level].icon} L{level}
                  </button>
                ))}
              </div>
            </div>

            {/* Current Level Info */}
            <div className="current-level-info" style={{ '--level-color': LEVEL_CONFIG[selectedLevel].color }}>
              <h3>{LEVEL_CONFIG[selectedLevel].icon} Level {selectedLevel} - {LEVEL_CONFIG[selectedLevel].sensor}</h3>
              <p>Tasks: {(tasks[selectedLevel] || []).length} / {TASKS_PER_LEVEL}</p>
            </div>

            {/* Existing Tasks */}
            <div className="existing-tasks">
              {(tasks[selectedLevel] || []).map((task, index) => (
                <div key={task.id} className="task-card">
                  <div className="task-number">Task {task.taskNumber}</div>
                  <div className="task-type-badge">{task.type}</div>
                  <h4>{task.title}</h4>
                  <p>{task.description}</p>
                  <button className="delete-btn" onClick={() => handleDeleteTask(selectedLevel, index)}>🗑️ Delete</button>
                </div>
              ))}
            </div>

            {/* Add Task Form */}
            {(tasks[selectedLevel] || []).length < TASKS_PER_LEVEL && (
              <form className="task-form" onSubmit={handleAddTask}>
                <h3>➕ Add Task {(tasks[selectedLevel] || []).length + 1} of {TASKS_PER_LEVEL}</h3>
                
                <div className="form-group">
                  <label>Task Type *</label>
                  <select value={taskForm.type} onChange={(e) => setTaskForm(p => ({ ...p, type: e.target.value }))}>
                    <option value="wiring">🔌 Wiring & Connection</option>
                    <option value="coding">💻 Block Coding</option>
                    <option value="testing">🧪 Sensor Testing</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Task Title *</label>
                  <input
                    type="text"
                    value={taskForm.title}
                    onChange={(e) => setTaskForm(p => ({ ...p, title: e.target.value }))}
                    placeholder={`e.g., Connect ${LEVEL_CONFIG[selectedLevel].sensor} to ESP32`}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Description *</label>
                  <textarea
                    value={taskForm.description}
                    onChange={(e) => setTaskForm(p => ({ ...p, description: e.target.value }))}
                    placeholder="Describe what student needs to do..."
                    required
                    rows={3}
                  />
                </div>

                <div className="form-group">
                  <label>Instructions (Step by step)</label>
                  <textarea
                    value={taskForm.instructions}
                    onChange={(e) => setTaskForm(p => ({ ...p, instructions: e.target.value }))}
                    placeholder="1. Connect VCC to 3.3V...&#10;2. Connect GND to GND...&#10;3. Connect DATA to GPIO..."
                    rows={5}
                  />
                </div>

                <button type="submit" className="submit-btn">Add Task</button>
              </form>
            )}
          </section>
        )}

        {activeTab === 'quizzes' && (
          <section className="dash-section">
            <h2>🎯 Quiz Management</h2>
            
            {/* Level Selector */}
            <div className="level-selector">
              <label>Select Level:</label>
              <div className="level-buttons">
                {Array.from({ length: TOTAL_LEVELS }, (_, i) => i + 1).map(level => (
                  <button
                    key={level}
                    className={`${selectedLevel === level ? 'active' : ''} ${quizzes[level] ? 'has-quiz' : ''}`}
                    onClick={() => setSelectedLevel(level)}
                    style={{ '--btn-color': LEVEL_CONFIG[level].color }}
                  >
                    {LEVEL_CONFIG[level].icon} L{level} {quizzes[level] ? '✅' : ''}
                  </button>
                ))}
              </div>
            </div>

            <div className="current-level-info" style={{ '--level-color': LEVEL_CONFIG[selectedLevel].color }}>
              <h3>{LEVEL_CONFIG[selectedLevel].icon} Level {selectedLevel} Quiz - {LEVEL_CONFIG[selectedLevel].sensor}</h3>
              <p>Pass Percentage: {QUIZ_PASS_PERCENTAGE}% | Questions: {quizForm.questions.length}</p>
            </div>

            {/* Quiz Questions */}
            <div className="quiz-form">
              {quizForm.questions.map((q, qIndex) => (
                <div key={qIndex} className="quiz-question-card">
                  <div className="question-header">
                    <span>Question {qIndex + 1}</span>
                    {quizForm.questions.length > 1 && (
                      <button 
                        type="button"
                        className="remove-btn"
                        onClick={() => setQuizForm(p => ({ 
                          questions: p.questions.filter((_, i) => i !== qIndex) 
                        }))}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  
                  <div className="form-group">
                    <label>Question *</label>
                    <input
                      type="text"
                      value={q.question}
                      onChange={(e) => handleQuizQuestionChange(qIndex, 'question', e.target.value)}
                      placeholder="Enter your question..."
                    />
                  </div>

                  <div className="options-grid">
                    {q.options.map((opt, optIndex) => (
                      <div key={optIndex} className="option-input">
                        <input
                          type="radio"
                          name={`correct-${qIndex}`}
                          checked={q.correctAnswer === optIndex}
                          onChange={() => handleQuizQuestionChange(qIndex, 'correctAnswer', optIndex)}
                        />
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => handleQuizQuestionChange(qIndex, optIndex, e.target.value)}
                          placeholder={`Option ${optIndex + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                  <small className="correct-hint">Select the correct answer</small>
                </div>
              ))}

              <div className="quiz-actions">
                <button type="button" className="add-question-btn" onClick={handleAddQuizQuestion}>
                  + Add Question
                </button>
                <button type="button" className="save-quiz-btn" onClick={handleSaveQuiz}>
                  💾 Save Quiz
                </button>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

// ==================== Student Dashboard ====================
function StudentDashboard() {
  const { user, userData, logout, updateUserData } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tasks, setTasks] = useState({});
  const [quizzes, setQuizzes] = useState({});
  const [carStatus, setCarStatus] = useState({});
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [blockCode, setBlockCode] = useState([]);
  const [showCertificate, setShowCertificate] = useState(false);
  const [certificateLevel, setCertificateLevel] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showBlockCoding, setShowBlockCoding] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  
  // WiFi Configuration states
  const [wifiSSID, setWifiSSID] = useState(userData?.wifiConfig?.ssid || '');
  const [wifiPassword, setWifiPassword] = useState(userData?.wifiConfig?.password || '');
  const [esp32StudentId, setEsp32StudentId] = useState(user?.uid || '');
  const [wifiSaved, setWifiSaved] = useState(false);
  const [wifiError, setWifiError] = useState('');

  const currentLevel = userData?.level || 1;
  const completedTasks = userData?.completedTasks || [];
  const currentXP = userData?.xp || 0;

  useEffect(() => {
    // Load tasks
    const tasksRef = ref(realtimeDb, 'levelTasks');
    const unsubTasks = onValue(tasksRef, (snapshot) => {
      setTasks(snapshot.val() || {});
    });

    // Load quizzes (use DEFAULT_QUIZZES as fallback)
    const quizzesRef = ref(realtimeDb, 'levelQuizzes');
    const unsubQuizzes = onValue(quizzesRef, (snapshot) => {
      const firebaseQuizzes = snapshot.val() || {};
      // Merge with DEFAULT_QUIZZES - Firebase quizzes take priority
      const mergedQuizzes = { ...DEFAULT_QUIZZES, ...firebaseQuizzes };
      setQuizzes(mergedQuizzes);
    });

    // Load car status
    const carRef = ref(realtimeDb, `cars/${user?.uid}`);
    const unsubCar = onValue(carRef, (snapshot) => {
      setCarStatus(snapshot.val() || {});
    });

    return () => { unsubTasks(); unsubQuizzes(); unsubCar(); };
  }, [user]);

  const currentLevelTasks = tasks[currentLevel] || [];
  const levelConfig = LEVEL_CONFIG[currentLevel];
  const completedTasksInLevel = completedTasks.filter(t => t.startsWith(`L${currentLevel}-`));
  const allTasksCompleted = completedTasksInLevel.length >= TASKS_PER_LEVEL;
  const canTakeQuiz = allTasksCompleted && quizzes[currentLevel];
  const quizPassed = userData?.quizScores?.[currentLevel] >= QUIZ_PASS_PERCENTAGE;

  const handleCompleteTask = async (taskId) => {
    const fullTaskId = `L${currentLevel}-${taskId}`;
    if (completedTasks.includes(fullTaskId)) return;

    const newCompletedTasks = [...completedTasks, fullTaskId];
    const newXP = currentXP + 50;
    const newTotalTasks = (userData?.totalTasksCompleted || 0) + 1;

    await updateUserData({
      completedTasks: newCompletedTasks,
      xp: newXP,
      totalTasksCompleted: newTotalTasks
    });
  };

  const handleStartQuiz = () => {
    setQuizAnswers({});
    setQuizResult(null);
    setShowQuiz(true);
  };

  const handleSubmitQuiz = async () => {
    const quiz = quizzes[currentLevel];
    if (!quiz) return;

    let correct = 0;
    quiz.questions.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctAnswer) correct++;
    });

    const percentage = Math.round((correct / quiz.questions.length) * 100);
    setQuizResult({ correct, total: quiz.questions.length, percentage });

    // Save quiz score
    const newQuizScores = { ...(userData?.quizScores || {}), [currentLevel]: percentage };
    
    if (percentage >= QUIZ_PASS_PERCENTAGE) {
      // Level up and show certificate!
      if (currentLevel < TOTAL_LEVELS) {
        await updateUserData({
          quizScores: newQuizScores,
          level: currentLevel + 1,
          xp: currentXP + 100,
          certificates: { ...(userData?.certificates || {}), [currentLevel]: true }
        });
      } else {
        // Final level completed!
        await updateUserData({ 
          quizScores: newQuizScores,
          xp: currentXP + 200, // Bonus XP for completing course
          certificates: { ...(userData?.certificates || {}), [currentLevel]: true },
          courseCompleted: true,
          completedAt: Date.now()
        });
      }
      // Show certificate after a short delay
      setTimeout(() => {
        setCertificateLevel(currentLevel);
        setShowCertificate(true);
      }, 2000);
    } else {
      await updateUserData({ quizScores: newQuizScores });
    }
  };

  // Send command to car
  const sendCarCommand = async (command) => {
    await set(ref(realtimeDb, `cars/${user.uid}/command`), {
      cmd: command,
      ts: Date.now()
    });
  };

  // Block coding functions
  const addBlock = (block) => {
    setBlockCode(prev => [...prev, block]);
  };

  const removeBlock = (index) => {
    setBlockCode(prev => prev.filter((_, i) => i !== index));
  };

  const runBlockCode = async () => {
    // Check if car is connected first
    if (!carStatus?.connected) {
      alert('⚠️ Car Not Connected!\n\nPlease make sure your ESP32 car is:\n1. Powered ON\n2. Connected to WiFi\n3. Showing "Online" status\n\nGo to "Car Control" tab to check the connection status.');
      return;
    }
    
    if (blockCode.length === 0) {
      alert('Please add some blocks first!');
      return;
    }
    
    // Send block code to ESP32
    await set(ref(realtimeDb, `cars/${user.uid}/blockCode`), {
      blocks: blockCode,
      ts: Date.now()
    });
    alert('✅ Code sent to ESP32 successfully!');
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Level-specific blocks for block coding
  const getLevelBlocks = (level) => {
    // Common blocks for all levels
    const commonBlocks = [
      { id: 'forward', label: 'Move Forward', icon: '⬆️', code: 'FORWARD', category: 'motion', color: '#3b82f6' },
      { id: 'backward', label: 'Move Backward', icon: '⬇️', code: 'BACKWARD', category: 'motion', color: '#3b82f6' },
      { id: 'left', label: 'Turn Left', icon: '⬅️', code: 'LEFT', category: 'motion', color: '#3b82f6' },
      { id: 'right', label: 'Turn Right', icon: '➡️', code: 'RIGHT', category: 'motion', color: '#3b82f6' },
      { id: 'stop', label: 'Stop', icon: '🛑', code: 'STOP', category: 'motion', color: '#ef4444' },
      { id: 'delay500', label: 'Wait 0.5 sec', icon: '⏱️', code: 'DELAY_500', category: 'control', color: '#f59e0b' },
      { id: 'delay1000', label: 'Wait 1 sec', icon: '⏱️', code: 'DELAY_1000', category: 'control', color: '#f59e0b' },
      { id: 'delay2000', label: 'Wait 2 sec', icon: '⏱️', code: 'DELAY_2000', category: 'control', color: '#f59e0b' },
      { id: 'loop_start', label: 'Loop Start (5x)', icon: '🔄', code: 'LOOP_START_5', category: 'control', color: '#8b5cf6' },
      { id: 'loop_end', label: 'Loop End', icon: '🔚', code: 'LOOP_END', category: 'control', color: '#8b5cf6' },
      { id: 'buzzer', label: 'Buzzer Beep', icon: '🔔', code: 'BUZZER', category: 'output', color: '#ec4899' },
      { id: 'led_on', label: 'LED On', icon: '💡', code: 'LED_ON', category: 'output', color: '#22c55e' },
      { id: 'led_off', label: 'LED Off', icon: '🔌', code: 'LED_OFF', category: 'output', color: '#22c55e' },
    ];

    // Level-specific sensor blocks (NEW ORDER)
    const sensorBlocks = {
      1: [ // PIR Motion (Level 1)
        { id: 'read_motion', label: 'Read Motion', icon: '🚶', code: 'READ_MOTION', category: 'sensor', color: '#ec4899' },
        { id: 'if_motion', label: 'If Motion Detected', icon: '👀', code: 'IF_MOTION_DETECTED', category: 'condition', color: '#a855f7' },
        { id: 'if_no_motion', label: 'If No Motion', icon: '😴', code: 'IF_NO_MOTION', category: 'condition', color: '#a855f7' },
        { id: 'alarm_on', label: 'Security Alarm On', icon: '🚨', code: 'ALARM_ON', category: 'output', color: '#ef4444' },
        { id: 'alarm_off', label: 'Alarm Off', icon: '🔕', code: 'ALARM_OFF', category: 'output', color: '#22c55e' },
        { id: 'endif', label: 'End If', icon: '🔚', code: 'ENDIF', category: 'condition', color: '#a855f7' },
      ],
      2: [ // Ultrasonic (Level 2)
        { id: 'read_distance', label: 'Read Distance', icon: '📏', code: 'READ_DISTANCE', category: 'sensor', color: '#06b6d4' },
        { id: 'if_close', label: 'If Object < 20cm', icon: '🚧', code: 'IF_DISTANCE_LT_20', category: 'condition', color: '#a855f7' },
        { id: 'if_far', label: 'If Object > 50cm', icon: '✅', code: 'IF_DISTANCE_GT_50', category: 'condition', color: '#a855f7' },
        { id: 'endif', label: 'End If', icon: '🔚', code: 'ENDIF', category: 'condition', color: '#a855f7' },
      ],
      3: [ // IR Sensor (Level 3)
        { id: 'read_ir', label: 'Read IR Sensor', icon: '📡', code: 'READ_IR', category: 'sensor', color: '#8b5cf6' },
        { id: 'if_line', label: 'If Line Detected', icon: '➖', code: 'IF_LINE_DETECTED', category: 'condition', color: '#a855f7' },
        { id: 'if_no_line', label: 'If No Line', icon: '⬜', code: 'IF_NO_LINE', category: 'condition', color: '#a855f7' },
        { id: 'if_obstacle', label: 'If Obstacle', icon: '🚧', code: 'IF_OBSTACLE', category: 'condition', color: '#a855f7' },
        { id: 'endif', label: 'End If', icon: '🔚', code: 'ENDIF', category: 'condition', color: '#a855f7' },
      ],
      4: [ // Bluetooth (Level 4)
        { id: 'wait_bt', label: 'Wait for Bluetooth', icon: '📶', code: 'WAIT_BLUETOOTH', category: 'sensor', color: '#0ea5e9' },
        { id: 'bt_connected', label: 'If BT Connected', icon: '✅', code: 'IF_BT_CONNECTED', category: 'condition', color: '#a855f7' },
        { id: 'if_forward', label: 'If Receive "F"', icon: '⬆️', code: 'IF_BT_FORWARD', category: 'condition', color: '#a855f7' },
        { id: 'if_backward', label: 'If Receive "B"', icon: '⬇️', code: 'IF_BT_BACKWARD', category: 'condition', color: '#a855f7' },
        { id: 'if_left', label: 'If Receive "L"', icon: '⬅️', code: 'IF_BT_LEFT', category: 'condition', color: '#a855f7' },
        { id: 'if_right', label: 'If Receive "R"', icon: '➡️', code: 'IF_BT_RIGHT', category: 'condition', color: '#a855f7' },
        { id: 'if_stop', label: 'If Receive "S"', icon: '🛑', code: 'IF_BT_STOP', category: 'condition', color: '#a855f7' },
        { id: 'send_bt', label: 'Send via Bluetooth', icon: '📤', code: 'SEND_BLUETOOTH', category: 'output', color: '#0ea5e9' },
        { id: 'endif', label: 'End If', icon: '🔚', code: 'ENDIF', category: 'condition', color: '#a855f7' },
      ],
      5: [ // Temperature (Level 5)
        { id: 'read_temp', label: 'Read Temperature', icon: '🌡️', code: 'READ_TEMP', category: 'sensor', color: '#ef4444' },
        { id: 'read_humidity', label: 'Read Humidity', icon: '💧', code: 'READ_HUMIDITY', category: 'sensor', color: '#06b6d4' },
        { id: 'if_hot', label: 'If Temp > 35°C', icon: '🔥', code: 'IF_TEMP_GT_35', category: 'condition', color: '#a855f7' },
        { id: 'if_cold', label: 'If Temp < 15°C', icon: '❄️', code: 'IF_TEMP_LT_15', category: 'condition', color: '#a855f7' },
        { id: 'endif', label: 'End If', icon: '🔚', code: 'ENDIF', category: 'condition', color: '#a855f7' },
      ],
      6: [ // Gas Sensor (Level 6)
        { id: 'read_gas', label: 'Read Gas Level', icon: '💨', code: 'READ_GAS', category: 'sensor', color: '#84cc16' },
        { id: 'if_gas_high', label: 'If Gas > 40%', icon: '⚠️', code: 'IF_GAS_GT_40', category: 'condition', color: '#a855f7' },
        { id: 'if_gas_low', label: 'If Gas < 20%', icon: '✅', code: 'IF_GAS_LT_20', category: 'condition', color: '#a855f7' },
        { id: 'alarm_on', label: 'Alarm On', icon: '🚨', code: 'ALARM_ON', category: 'output', color: '#ef4444' },
        { id: 'alarm_off', label: 'Alarm Off', icon: '🔕', code: 'ALARM_OFF', category: 'output', color: '#22c55e' },
        { id: 'endif', label: 'End If', icon: '🔚', code: 'ENDIF', category: 'condition', color: '#a855f7' },
      ],
      7: [ // LDR Light (Level 7)
        { id: 'read_light', label: 'Read Light Level', icon: '💡', code: 'READ_LIGHT', category: 'sensor', color: '#eab308' },
        { id: 'if_dark', label: 'If Dark < 20%', icon: '🌙', code: 'IF_LIGHT_LT_20', category: 'condition', color: '#a855f7' },
        { id: 'if_bright', label: 'If Bright > 70%', icon: '☀️', code: 'IF_LIGHT_GT_70', category: 'condition', color: '#a855f7' },
        { id: 'headlight_on', label: 'Headlight On', icon: '🔦', code: 'HEADLIGHT_ON', category: 'output', color: '#eab308' },
        { id: 'headlight_off', label: 'Headlight Off', icon: '🔌', code: 'HEADLIGHT_OFF', category: 'output', color: '#eab308' },
        { id: 'endif', label: 'End If', icon: '🔚', code: 'ENDIF', category: 'condition', color: '#a855f7' },
      ],
      8: [ // Soil Moisture (Level 8)
        { id: 'read_moisture', label: 'Read Moisture', icon: '🌱', code: 'READ_MOISTURE', category: 'sensor', color: '#22c55e' },
        { id: 'if_dry', label: 'If Soil Dry < 30%', icon: '🏜️', code: 'IF_MOISTURE_LT_30', category: 'condition', color: '#a855f7' },
        { id: 'if_wet', label: 'If Soil Wet > 60%', icon: '💧', code: 'IF_MOISTURE_GT_60', category: 'condition', color: '#a855f7' },
        { id: 'pump_on', label: 'Water Pump On', icon: '🚿', code: 'PUMP_ON', category: 'output', color: '#06b6d4' },
        { id: 'pump_off', label: 'Water Pump Off', icon: '🔌', code: 'PUMP_OFF', category: 'output', color: '#06b6d4' },
        { id: 'endif', label: 'End If', icon: '🔚', code: 'ENDIF', category: 'condition', color: '#a855f7' },
      ],
      9: [ // Sound Sensor (Level 9)
        { id: 'read_sound', label: 'Read Sound Level', icon: '🔊', code: 'READ_SOUND', category: 'sensor', color: '#6366f1' },
        { id: 'if_loud', label: 'If Sound > 70%', icon: '📢', code: 'IF_SOUND_GT_70', category: 'condition', color: '#a855f7' },
        { id: 'if_quiet', label: 'If Sound < 30%', icon: '🤫', code: 'IF_SOUND_LT_30', category: 'condition', color: '#a855f7' },
        { id: 'clap_detected', label: 'Wait for Clap', icon: '👏', code: 'WAIT_CLAP', category: 'sensor', color: '#6366f1' },
        { id: 'endif', label: 'End If', icon: '🔚', code: 'ENDIF', category: 'condition', color: '#a855f7' },
      ],
      10: [ // Computer Vision (Level 10)
        { id: 'start_camera', label: 'Start Camera', icon: '📷', code: 'START_CAMERA', category: 'sensor', color: '#f43f5e' },
        { id: 'capture', label: 'Capture Frame', icon: '📸', code: 'CAPTURE_FRAME', category: 'sensor', color: '#f43f5e' },
        { id: 'if_face', label: 'If Face Detected', icon: '👤', code: 'IF_FACE_DETECTED', category: 'condition', color: '#a855f7' },
        { id: 'if_object', label: 'If Object Detected', icon: '📦', code: 'IF_OBJECT_DETECTED', category: 'condition', color: '#a855f7' },
        { id: 'if_qr', label: 'If QR Code Found', icon: '📱', code: 'IF_QR_DETECTED', category: 'condition', color: '#a855f7' },
        { id: 'stream_video', label: 'Stream Video', icon: '🎥', code: 'STREAM_VIDEO', category: 'output', color: '#f43f5e' },
        { id: 'send_alert', label: 'Send Alert', icon: '📤', code: 'SEND_ALERT', category: 'output', color: '#0ea5e9' },
        { id: 'save_photo', label: 'Save Photo', icon: '💾', code: 'SAVE_PHOTO', category: 'output', color: '#22c55e' },
        { id: 'endif', label: 'End If', icon: '🔚', code: 'ENDIF', category: 'condition', color: '#a855f7' },
      ]
    };

    return [...commonBlocks, ...(sensorBlocks[level] || [])];
  };

  const availableBlocks = getLevelBlocks(currentLevel);
  
  // Open block coding for Task 3
  const openBlockCoding = (task) => {
    setSelectedTask(task);
    setBlockCode([]);
    setCodeSent(false);
    setShowBlockCoding(true);
  };

  // Send code to ESP32 and mark task complete
  const sendCodeToESP32 = async () => {
    // Check if car is connected first
    if (!carStatus?.connected) {
      alert('⚠️ Car Not Connected!\n\nPlease make sure your ESP32 car is:\n1. Powered ON\n2. Connected to WiFi\n3. Showing "Online" status\n\nGo to "Car Control" tab to check the connection status.');
      return;
    }
    
    if (blockCode.length === 0) {
      alert('Please add some blocks first!');
      return;
    }
    
    try {
      await set(ref(realtimeDb, `cars/${user.uid}/blockCode`), {
        blocks: blockCode,
        level: currentLevel,
        task: selectedTask?.id,
        ts: Date.now()
      });
      setCodeSent(true);
      
      // Auto mark task complete after sending code
      setTimeout(() => {
        handleCompleteTask(selectedTask.id);
      }, 2000);
      
    } catch (error) {
      alert('Error sending code: ' + error.message);
    }
  };

  // Save WiFi Configuration
  const saveWifiConfig = async () => {
    setWifiError('');
    setWifiSaved(false);

    if (!wifiSSID.trim()) {
      setWifiError('WiFi Name (SSID) is required');
      return;
    }
    if (!wifiPassword.trim()) {
      setWifiError('WiFi Password is required');
      return;
    }

    try {
      // Save to user's data
      await updateUserData({
        wifiConfig: {
          ssid: wifiSSID.trim(),
          password: wifiPassword.trim(),
          studentId: user.uid,
          updatedAt: Date.now()
        }
      });

      // Also save to a separate node for ESP32 to read
      await set(ref(realtimeDb, `esp32Config/${user.uid}`), {
        wifi: {
          ssid: wifiSSID.trim(),
          password: wifiPassword.trim()
        },
        studentId: user.uid,
        studentName: userData?.name,
        updatedAt: Date.now()
      });

      setWifiSaved(true);
      setTimeout(() => setWifiSaved(false), 3000);
    } catch (error) {
      setWifiError('Failed to save: ' + error.message);
    }
  };

  // Generate ESP8266 Config Code
  const generateESP32Code = () => {
    const code = `
// ═══════════════════════════════════════════════════════════════════
// STEMify ESP8266 (ESP-12E) Configuration
// Generated for: ${userData?.name}
// Generated at: ${new Date().toLocaleString()}
// ═══════════════════════════════════════════════════════════════════

// WiFi Credentials - Auto-generated from STEMify Dashboard
const char* WIFI_SSID = "${wifiSSID}";
const char* WIFI_PASSWORD = "${wifiPassword}";

// Student User ID (for Firebase connection)
String STUDENT_USER_ID = "${user.uid}";

// Firebase Database URL
const char* FIREBASE_URL = "https://stemify-dashboard-default-rtdb.firebaseio.com";

// ═══════════════════════════════════════════════════════════════════
// INSTRUCTIONS:
// 1. Open ESP8266_WiFi_Module.ino in Arduino IDE
// 2. Replace the placeholder values at the top with these values
// 3. Upload to your ESP-12E module
// 4. Make sure Arduino_Car_Controller.ino is uploaded to Arduino
// ═══════════════════════════════════════════════════════════════════
`;
    navigator.clipboard.writeText(code);
    alert('✅ ESP8266 Configuration Code Copied!\\n\\nPaste this at the top of your ESP8266_WiFi_Module.ino sketch.');
  };

  return (
    <div className="dashboard student-dashboard">
      <nav className="dash-nav">
        <div className="dash-nav-left">
          <div className="dash-logo">
            <span className="logo-hex">🔬</span>
            <span>STEMify</span>
            <span className="role-badge student">Student</span>
          </div>
        </div>
        <div className="dash-nav-right">
          <span className="student-code">Code: {userData?.studentCode}</span>
          <button 
            className="esp32-id-btn"
            onClick={() => {
              navigator.clipboard.writeText(user?.uid || '');
              alert(`✅ Student User ID Copied!\n\nPaste this in your ESP8266 code:\nString STUDENT_USER_ID = "${user?.uid}";`);
            }}
            title="Copy Student User ID for ESP8266"
          >
            🔌 My ID
          </button>
          <span className="user-name">{userData?.name}</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </nav>

      <div className="tab-nav">
        <button className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
          📊 Dashboard
        </button>
        <button className={activeTab === 'tasks' ? 'active' : ''} onClick={() => setActiveTab('tasks')}>
          📋 Tasks
        </button>
        <button className={activeTab === 'coding' ? 'active' : ''} onClick={() => setActiveTab('coding')}>
          🧱 Block Coding
        </button>
        <button className={activeTab === 'wifi' ? 'active' : ''} onClick={() => setActiveTab('wifi')}>
          📶 WiFi Setup
        </button>
        <button className={activeTab === 'car' ? 'active' : ''} onClick={() => setActiveTab('car')}>
          🚗 Car Control
        </button>
        <button className={activeTab === 'progress' ? 'active' : ''} onClick={() => setActiveTab('progress')}>
          📈 Progress
        </button>
        <button className={activeTab === 'certificates' ? 'active' : ''} onClick={() => setActiveTab('certificates')}>
          🏆 Certificates
        </button>
      </div>

      <main className="dash-main">
        {activeTab === 'dashboard' && (
          <>
            <div className="welcome-banner" style={{ '--level-color': levelConfig?.color }}>
              <div className="welcome-text">
                <h1>Welcome, {userData?.name}! 👋</h1>
                <p>Continue learning with {levelConfig?.sensor}</p>
              </div>
              <div className="level-display">
                <div className="level-circle">
                  <span className="level-icon-big">{levelConfig?.icon}</span>
                  <span className="level-num">{currentLevel}</span>
                  <span className="level-label">Level</span>
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="progress-section">
              <div className="progress-header">
                <span>Level {currentLevel} Progress</span>
                <span>{completedTasksInLevel.length}/{TASKS_PER_LEVEL} Tasks | {currentXP} XP</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ 
                  width: `${(completedTasksInLevel.length / TASKS_PER_LEVEL) * 100}%`,
                  background: levelConfig?.color 
                }}></div>
              </div>
              
              {canTakeQuiz && !quizPassed && (
                <button className="quiz-btn" onClick={handleStartQuiz}>
                  🎯 Take Level {currentLevel} Quiz to Advance!
                </button>
              )}
              {quizPassed && currentLevel < TOTAL_LEVELS && (
                <div className="quiz-passed">✅ Quiz Passed! Level {currentLevel + 1} Unlocked!</div>
              )}
              {currentLevel === TOTAL_LEVELS && quizPassed && (
                <div className="completed-all">🏆 Congratulations! You completed all levels!</div>
              )}
            </div>

            {/* Stats */}
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-icon">{levelConfig?.icon}</span>
                <div className="stat-info">
                  <span className="stat-value">Level {currentLevel}</span>
                  <span className="stat-label">{levelConfig?.sensor}</span>
                </div>
              </div>
              <div className="stat-card">
                <span className="stat-icon">⭐</span>
                <div className="stat-info">
                  <span className="stat-value">{currentXP}</span>
                  <span className="stat-label">Total XP</span>
                </div>
              </div>
              <div className="stat-card">
                <span className="stat-icon">✅</span>
                <div className="stat-info">
                  <span className="stat-value">{userData?.totalTasksCompleted || 0}</span>
                  <span className="stat-label">Tasks Done</span>
                </div>
              </div>
              <div className="stat-card">
                <span className="stat-icon">🚗</span>
                <div className="stat-info">
                  <span className="stat-value">{carStatus?.connected ? 'Online' : 'Offline'}</span>
                  <span className="stat-label">Car Status</span>
                </div>
              </div>
            </div>

            {/* Level Map */}
            <section className="level-map-section">
              <h2>🗺️ Your Learning Journey</h2>
              <div className="level-map">
                {Array.from({ length: TOTAL_LEVELS }, (_, i) => i + 1).map(level => {
                  const config = LEVEL_CONFIG[level];
                  const isCompleted = level < currentLevel;
                  const isCurrent = level === currentLevel;
                  const isLocked = level > currentLevel;

                  return (
                    <div 
                      key={level} 
                      className={`level-node ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''} ${isLocked ? 'locked' : ''}`}
                      style={{ '--node-color': config.color }}
                    >
                      <div className="node-icon">{isLocked ? '🔒' : config.icon}</div>
                      <div className="node-label">L{level}</div>
                      {isCompleted && <div className="node-check">✓</div>}
                    </div>
                  );
                })}
              </div>
            </section>
          </>
        )}

        {activeTab === 'tasks' && (
          <section className="dash-section tasks-section">
            <h2>{levelConfig?.icon} Level {currentLevel} Tasks - {levelConfig?.sensor}</h2>
            
            {/* Task 1: Sensor Education */}
            <div className="structured-task-container">
              <TaskCard1SensorEducation 
                level={currentLevel}
                sensorInfo={SENSOR_INFO[currentLevel]}
                levelConfig={levelConfig}
                isCompleted={completedTasks.includes(`L${currentLevel}-task1`)}
                onComplete={() => handleCompleteTask('task1')}
              />

              {/* Task 2: Connection Guide */}
              <TaskCard2ConnectionGuide
                level={currentLevel}
                connectionGuide={CONNECTION_GUIDES[currentLevel]}
                levelConfig={levelConfig}
                isCompleted={completedTasks.includes(`L${currentLevel}-task2`)}
                onComplete={() => handleCompleteTask('task2')}
                isLocked={!completedTasks.includes(`L${currentLevel}-task1`)}
              />

              {/* Task 3: Block Coding */}
              <TaskCard3BlockCoding
                level={currentLevel}
                sampleCode={SAMPLE_BLOCK_CODES[currentLevel]}
                levelConfig={levelConfig}
                availableBlocks={availableBlocks}
                isCompleted={completedTasks.includes(`L${currentLevel}-task3`)}
                onComplete={() => handleCompleteTask('task3')}
                isLocked={!completedTasks.includes(`L${currentLevel}-task2`)}
                blockCode={blockCode}
                setBlockCode={setBlockCode}
                addBlock={addBlock}
                removeBlock={removeBlock}
                sendCodeToESP32={async () => {
                  // Check if car is connected first
                  if (!carStatus?.connected) {
                    alert('⚠️ Car Not Connected!\n\nPlease make sure your ESP32 car is:\n1. Powered ON\n2. Connected to WiFi\n3. Showing "Online" status\n\nGo to "Car Control" tab to check the connection status.');
                    return;
                  }
                  if (blockCode.length === 0) {
                    alert('Please add some blocks first!');
                    return;
                  }
                  try {
                    await set(ref(realtimeDb, `cars/${user.uid}/blockCode`), {
                      blocks: blockCode,
                      level: currentLevel,
                      ts: Date.now()
                    });
                    alert('🎉 Code sent to ESP32 successfully!');
                    handleCompleteTask('task3');
                  } catch (error) {
                    alert('Error sending code: ' + error.message);
                  }
                }}
                carConnected={carStatus?.connected}
              />
            </div>

            {/* Progress Summary */}
            <div className="task-progress-summary">
              <h3>📊 Level {currentLevel} Progress</h3>
              <div className="progress-items">
                <div className={`progress-item ${completedTasks.includes(`L${currentLevel}-task1`) ? 'done' : ''}`}>
                  <span className="progress-icon">{completedTasks.includes(`L${currentLevel}-task1`) ? '✅' : '1️⃣'}</span>
                  <span>Learn about {levelConfig?.sensor}</span>
                </div>
                <div className={`progress-item ${completedTasks.includes(`L${currentLevel}-task2`) ? 'done' : ''}`}>
                  <span className="progress-icon">{completedTasks.includes(`L${currentLevel}-task2`) ? '✅' : '2️⃣'}</span>
                  <span>Connect the sensor</span>
                </div>
                <div className={`progress-item ${completedTasks.includes(`L${currentLevel}-task3`) ? 'done' : ''}`}>
                  <span className="progress-icon">{completedTasks.includes(`L${currentLevel}-task3`) ? '✅' : '3️⃣'}</span>
                  <span>Complete block coding challenge</span>
                </div>
              </div>
              {allTasksCompleted && !quizPassed && (
                <button className="quiz-unlock-btn" onClick={handleStartQuiz}>
                  🎯 All Tasks Complete! Take the Quiz to Level Up!
                </button>
              )}
            </div>
          </section>
        )}

        {activeTab === 'coding' && (
          <section className="dash-section">
            <h2>🧱 Block Coding - {levelConfig?.sensor}</h2>
            
            <div className="block-coding-container">
              {/* Available Blocks */}
              <div className="blocks-palette">
                <h3>Available Blocks</h3>
                <div className="blocks-list">
                  {availableBlocks.map(block => (
                    <button 
                      key={block.id} 
                      className="block-item"
                      onClick={() => addBlock(block)}
                    >
                      <span>{block.icon}</span>
                      <span>{block.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Code Area */}
              <div className="code-area">
                <h3>Your Code</h3>
                <div className="code-blocks">
                  {blockCode.length === 0 ? (
                    <div className="empty-code">
                      <p>Drag blocks here to build your code</p>
                    </div>
                  ) : (
                    blockCode.map((block, index) => (
                      <div key={index} className="placed-block">
                        <span className="block-num">{index + 1}</span>
                        <span className="block-icon">{block.icon}</span>
                        <span className="block-label">{block.label}</span>
                        <button className="remove-block" onClick={() => removeBlock(index)}>✕</button>
                      </div>
                    ))
                  )}
                </div>
                
                <div className="code-actions">
                  <div className={`car-connection-status ${carStatus?.connected ? 'connected' : 'disconnected'}`}>
                    <span className="status-dot"></span>
                    <span>{carStatus?.connected ? '🚗 Car Online - Ready to Upload' : '⚠️ Car Offline - Connect ESP32 First'}</span>
                  </div>
                  <div className="action-buttons">
                    <button className="clear-btn" onClick={() => setBlockCode([])}>🗑️ Clear All</button>
                    <button 
                      className="run-btn" 
                      onClick={runBlockCode} 
                      disabled={blockCode.length === 0 || !carStatus?.connected}
                      title={!carStatus?.connected ? 'Connect your ESP32 car first!' : 'Send code to ESP32'}
                    >
                      {carStatus?.connected ? '▶️ Send to ESP32' : '🔒 Car Offline'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Code Preview */}
              <div className="code-preview">
                <h3>Generated Code</h3>
                <pre className="code-output">
                  {blockCode.length > 0 ? 
                    blockCode.map((b, i) => `${i + 1}. ${b.code}`).join('\n') :
                    '// Your code will appear here'
                  }
                </pre>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'wifi' && (
          <section className="dash-section wifi-setup-section">
            <h2>📶 ESP32 WiFi Configuration</h2>
            <p className="section-desc">Configure your ESP32 car's WiFi connection. Enter your WiFi credentials and your Student ID will be automatically included.</p>

            <div className="wifi-setup-container">
              <div className="wifi-card">
                <h3>🌐 WiFi Settings</h3>
                
                <div className="wifi-form">
                  <div className="form-group">
                    <label>📡 WiFi Name (SSID) *</label>
                    <input
                      type="text"
                      value={wifiSSID}
                      onChange={(e) => setWifiSSID(e.target.value)}
                      placeholder="Enter your WiFi network name"
                    />
                  </div>

                  <div className="form-group">
                    <label>🔐 WiFi Password *</label>
                    <input
                      type="password"
                      value={wifiPassword}
                      onChange={(e) => setWifiPassword(e.target.value)}
                      placeholder="Enter your WiFi password"
                    />
                  </div>

                  <div className="form-group">
                    <label>🆔 Your Student ID (Auto-filled)</label>
                    <div className="student-id-display">
                      <input
                        type="text"
                        value={user?.uid || ''}
                        readOnly
                        className="readonly-input"
                      />
                      <button
                        type="button"
                        className="copy-id-btn"
                        onClick={() => {
                          navigator.clipboard.writeText(user?.uid || '');
                          alert('✅ Student ID copied!');
                        }}
                      >
                        📋 Copy
                      </button>
                    </div>
                    <small>This ID links your ESP32 to your account</small>
                  </div>

                  {wifiError && <div className="error-msg">{wifiError}</div>}
                  {wifiSaved && <div className="success-msg">✅ WiFi configuration saved successfully!</div>}

                  <button className="save-wifi-btn" onClick={saveWifiConfig}>
                    💾 Save WiFi Configuration
                  </button>
                </div>
              </div>

              <div className="wifi-card code-card">
                <h3>📥 Get ESP8266 Code</h3>
                <p>After saving your WiFi settings, generate the configuration code for your ESP-12E module.</p>
                
                <div className="code-preview-box">
                  <pre>
{`// WiFi Configuration (ESP8266)
const char* WIFI_SSID = "${wifiSSID || 'YOUR_WIFI'}";
const char* WIFI_PASSWORD = "${wifiPassword ? '********' : 'YOUR_PASSWORD'}";

// Student User ID
String STUDENT_USER_ID = "${user?.uid || 'YOUR_ID'}";`}
                  </pre>
                </div>

                <button className="generate-code-btn" onClick={generateESP32Code}>
                  📋 Copy Complete ESP8266 Config Code
                </button>

                <div className="wifi-instructions">
                  <h4>📝 Instructions:</h4>
                  <ol>
                    <li>Enter your WiFi name and password above</li>
                    <li>Click "Save WiFi Configuration"</li>
                    <li>Click "Copy Complete ESP8266 Config Code"</li>
                    <li>Open <strong>ESP8266_WiFi_Module.ino</strong> in Arduino IDE</li>
                    <li>Paste the code at the top (replace existing placeholders)</li>
                    <li>Upload to your ESP-12E module</li>
                    <li>Upload <strong>Arduino_Car_Controller.ino</strong> to Arduino Nano/Uno</li>
                  </ol>
                </div>
              </div>

              {/* Current Config Status */}
              <div className="wifi-card status-card">
                <h3>📊 Current Configuration</h3>
                <div className="config-status">
                  <div className="status-item">
                    <span className="status-label">WiFi SSID:</span>
                    <span className="status-value">{userData?.wifiConfig?.ssid || 'Not configured'}</span>
                  </div>
                  <div className="status-item">
                    <span className="status-label">Student ID:</span>
                    <span className="status-value id-value">{user?.uid || 'N/A'}</span>
                  </div>
                  <div className="status-item">
                    <span className="status-label">Last Updated:</span>
                    <span className="status-value">
                      {userData?.wifiConfig?.updatedAt 
                        ? new Date(userData.wifiConfig.updatedAt).toLocaleString()
                        : 'Never'}
                    </span>
                  </div>
                  <div className="status-item">
                    <span className="status-label">ESP32 Status:</span>
                    <span className={`status-value ${carStatus?.status === 'CONNECTED' ? 'connected' : 'disconnected'}`}>
                      {carStatus?.status || 'Not Connected'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'car' && (
          <section className="dash-section">
            <h2>🚗 ESP32 Car Control</h2>
            
            <div className="car-control-container">
              {/* Car Status */}
              <div className="car-status-panel">
                <h3>Car Status</h3>
                <div className="status-indicators">
                  <div className={`status-item ${carStatus?.connected ? 'online' : ''}`}>
                    <span className="status-dot"></span>
                    <span>Connection: {carStatus?.connected ? 'Online' : 'Offline'}</span>
                  </div>
                  <div className="status-item">
                    <span>🌡️ Temperature: {carStatus?.temperature || '--'}°C</span>
                  </div>
                  <div className="status-item">
                    <span>📏 Distance: {carStatus?.distance || '--'} cm</span>
                  </div>
                  <div className="status-item">
                    <span>🔋 Battery: {carStatus?.battery || '--'}%</span>
                  </div>
                </div>
              </div>

              {/* Manual Controls */}
              <div className="manual-controls">
                <h3>Manual Control</h3>
                <div className="control-pad">
                  <div className="control-row">
                    <button className="control-btn" onClick={() => sendCarCommand('FORWARD')}>⬆️</button>
                  </div>
                  <div className="control-row">
                    <button className="control-btn" onClick={() => sendCarCommand('LEFT')}>⬅️</button>
                    <button className="control-btn stop" onClick={() => sendCarCommand('STOP')}>🛑</button>
                    <button className="control-btn" onClick={() => sendCarCommand('RIGHT')}>➡️</button>
                  </div>
                  <div className="control-row">
                    <button className="control-btn" onClick={() => sendCarCommand('BACKWARD')}>⬇️</button>
                  </div>
                </div>
                
                <div className="extra-controls">
                  <button onClick={() => sendCarCommand('BUZZER')}>🔔 Buzzer</button>
                  <button onClick={() => sendCarCommand('LED_TOGGLE')}>💡 LED</button>
                  <button onClick={() => sendCarCommand('READ_SENSOR')}>📡 Read Sensor</button>
                </div>
              </div>

              {/* Sensor Display */}
              <div className="sensor-display">
                <h3>{levelConfig?.icon} {levelConfig?.sensor} Reading</h3>
                <div className="sensor-value-big">
                  {carStatus?.sensorValue || '--'}
                </div>
                <button className="refresh-btn" onClick={() => sendCarCommand('READ_SENSOR')}>
                  🔄 Refresh Reading
                </button>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'progress' && (
          <section className="dash-section">
            <h2>📈 Your Progress</h2>
            
            <div className="charts-grid">
              <div className="chart-card">
                <h3>Quiz Scores by Level</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={Object.entries(userData?.quizScores || {}).map(([lvl, score]) => ({
                    level: `L${lvl}`, score, pass: QUIZ_PASS_PERCENTAGE
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2d3a4f" />
                    <XAxis dataKey="level" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" domain={[0, 100]} />
                    <Tooltip contentStyle={{ background: '#1a2332', border: '1px solid #2d3a4f' }} />
                    <Bar dataKey="score" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="pass" fill="#f59e0b" radius={[4, 4, 0, 0]} opacity={0.3} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-card">
                <h3>Level Completion</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Completed', value: currentLevel - 1 },
                        { name: 'Current', value: 1 },
                        { name: 'Remaining', value: TOTAL_LEVELS - currentLevel }
                      ]}
                      cx="50%" cy="50%"
                      innerRadius={60} outerRadius={80}
                      paddingAngle={5} dataKey="value"
                    >
                      <Cell fill="#14b8a6" />
                      <Cell fill="#f59e0b" />
                      <Cell fill="#2d3a4f" />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="pie-legend">
                  <span><span className="dot" style={{background:'#14b8a6'}}></span>Completed</span>
                  <span><span className="dot" style={{background:'#f59e0b'}}></span>Current</span>
                  <span><span className="dot" style={{background:'#2d3a4f'}}></span>Remaining</span>
                </div>
              </div>
            </div>

            {/* All Quiz Scores */}
            <div className="all-scores">
              <h3>All Quiz Scores</h3>
              <div className="scores-grid">
                {Array.from({ length: TOTAL_LEVELS }, (_, i) => i + 1).map(level => {
                  const score = userData?.quizScores?.[level];
                  const config = LEVEL_CONFIG[level];
                  return (
                    <div key={level} className="score-card" style={{ '--score-color': config.color }}>
                      <div className="score-level">{config.icon} Level {level}</div>
                      <div className="score-value">
                        {score !== undefined ? `${score}%` : '--'}
                      </div>
                      <div className={`score-status ${score >= QUIZ_PASS_PERCENTAGE ? 'passed' : ''}`}>
                        {score >= QUIZ_PASS_PERCENTAGE ? '✅ Passed' : (score ? '❌ Failed' : 'Not taken')}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Certificates Section */}
            <div className="certificates-section">
              <h3>🏆 Your Certificates</h3>
              <div className="certificates-grid">
                {Array.from({ length: TOTAL_LEVELS }, (_, i) => i + 1).map(level => {
                  const config = LEVEL_CONFIG[level];
                  const hasCertificate = userData?.certificates?.[level] || userData?.quizScores?.[level] >= QUIZ_PASS_PERCENTAGE;
                  
                  return (
                    <div 
                      key={level} 
                      className={`certificate-card ${hasCertificate ? 'earned' : 'locked'}`}
                      style={{ '--cert-color': config.color }}
                      onClick={() => {
                        if (hasCertificate) {
                          setCertificateLevel(level);
                          setShowCertificate(true);
                        }
                      }}
                    >
                      <div className="cert-icon">
                        {hasCertificate ? '🏆' : '🔒'}
                      </div>
                      <div className="cert-info">
                        <span className="cert-level">Level {level}</span>
                        <span className="cert-title">{config.certificate}</span>
                      </div>
                      {hasCertificate && (
                        <button className="view-cert-btn">View</button>
                      )}
                    </div>
                  );
                })}
              </div>
              
              {/* Course Completion Badge */}
              {userData?.courseCompleted && (
                <div className="course-complete-banner">
                  <div className="complete-icon">🎓</div>
                  <div className="complete-text">
                    <h4>🎉 Congratulations! Course Completed!</h4>
                    <p>You are now a certified STEMify Master Engineer!</p>
                    <button 
                      className="view-master-cert"
                      onClick={() => {
                        setCertificateLevel(TOTAL_LEVELS);
                        setShowCertificate(true);
                      }}
                    >
                      🏆 View Master Certificate
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {activeTab === 'certificates' && (
          <section className="dash-section certificates-page">
            <div className="certificates-header">
              <h2>🏆 Awarded Certificates</h2>
              <p className="certificates-subtitle">Your achievements and earned certificates from STEMify</p>
            </div>

            {/* Summary Stats */}
            <div className="cert-summary-stats">
              <div className="cert-stat-card">
                <div className="cert-stat-icon">🏆</div>
                <div className="cert-stat-value">
                  {Array.from({ length: TOTAL_LEVELS }, (_, i) => i + 1).filter(level => 
                    userData?.certificates?.[level] || userData?.quizScores?.[level] >= QUIZ_PASS_PERCENTAGE
                  ).length}
                </div>
                <div className="cert-stat-label">Certificates Earned</div>
              </div>
              <div className="cert-stat-card">
                <div className="cert-stat-icon">📊</div>
                <div className="cert-stat-value">{TOTAL_LEVELS}</div>
                <div className="cert-stat-label">Total Available</div>
              </div>
              <div className="cert-stat-card">
                <div className="cert-stat-icon">🎯</div>
                <div className="cert-stat-value">
                  {Math.round((Array.from({ length: TOTAL_LEVELS }, (_, i) => i + 1).filter(level => 
                    userData?.certificates?.[level] || userData?.quizScores?.[level] >= QUIZ_PASS_PERCENTAGE
                  ).length / TOTAL_LEVELS) * 100)}%
                </div>
                <div className="cert-stat-label">Progress</div>
              </div>
            </div>

            {/* Earned Certificates */}
            <div className="earned-certificates-section">
              <h3>✅ Earned Certificates</h3>
              <div className="earned-certificates-grid">
                {Array.from({ length: TOTAL_LEVELS }, (_, i) => i + 1)
                  .filter(level => userData?.certificates?.[level] || userData?.quizScores?.[level] >= QUIZ_PASS_PERCENTAGE)
                  .map(level => {
                    const config = LEVEL_CONFIG[level];
                    return (
                      <div 
                        key={level} 
                        className="earned-certificate-card"
                        style={{ '--cert-color': config.color }}
                        onClick={() => {
                          setCertificateLevel(level);
                          setShowCertificate(true);
                        }}
                      >
                        <div className="earned-cert-badge">
                          <span className="badge-icon">🏆</span>
                        </div>
                        <div className="earned-cert-content">
                          <div className="earned-cert-level">
                            <span className="level-icon">{config.icon}</span>
                            Level {level}
                          </div>
                          <h4 className="earned-cert-title">{config.certificate}</h4>
                          <p className="earned-cert-sensor">{config.sensor}</p>
                          <div className="earned-cert-date">
                            <span>📅 Earned</span>
                          </div>
                        </div>
                        <button className="view-earned-cert-btn">
                          👁️ View Certificate
                        </button>
                      </div>
                    );
                  })}
                {Array.from({ length: TOTAL_LEVELS }, (_, i) => i + 1)
                  .filter(level => userData?.certificates?.[level] || userData?.quizScores?.[level] >= QUIZ_PASS_PERCENTAGE)
                  .length === 0 && (
                  <div className="no-certificates">
                    <div className="no-cert-icon">📜</div>
                    <h4>No Certificates Yet</h4>
                    <p>Complete level tasks and pass quizzes to earn certificates!</p>
                    <button onClick={() => setActiveTab('tasks')} className="start-learning-btn">
                      🚀 Start Learning
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Locked Certificates */}
            <div className="locked-certificates-section">
              <h3>🔒 Certificates to Unlock</h3>
              <div className="locked-certificates-grid">
                {Array.from({ length: TOTAL_LEVELS }, (_, i) => i + 1)
                  .filter(level => !(userData?.certificates?.[level] || userData?.quizScores?.[level] >= QUIZ_PASS_PERCENTAGE))
                  .map(level => {
                    const config = LEVEL_CONFIG[level];
                    return (
                      <div 
                        key={level} 
                        className="locked-certificate-card"
                        style={{ '--cert-color': config.color }}
                      >
                        <div className="locked-cert-badge">
                          <span className="badge-icon">🔒</span>
                        </div>
                        <div className="locked-cert-content">
                          <div className="locked-cert-level">
                            <span className="level-icon">{config.icon}</span>
                            Level {level}
                          </div>
                          <h4 className="locked-cert-title">{config.certificate}</h4>
                          <p className="locked-cert-sensor">{config.sensor}</p>
                        </div>
                        <div className="locked-cert-hint">
                          Complete Level {level} to unlock!
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Master Certificate */}
            {userData?.courseCompleted && (
              <div className="master-certificate-section">
                <div className="master-cert-banner">
                  <div className="master-cert-glow"></div>
                  <div className="master-cert-content">
                    <div className="master-cert-badge">🎓</div>
                    <h3>🏆 STEMify Master Engineer Certificate 🏆</h3>
                    <p>Congratulations! You have completed all 10 levels and earned the prestigious Master Engineer certification!</p>
                    <button 
                      className="view-master-certificate-btn"
                      onClick={() => {
                        setCertificateLevel(TOTAL_LEVELS);
                        setShowCertificate(true);
                      }}
                    >
                      🏆 View Master Certificate
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}
      </main>

      {/* Quiz Modal */}
      {showQuiz && quizzes[currentLevel] && (
        <div className="modal-overlay">
          <div className="modal quiz-modal">
            <h2>🎯 Level {currentLevel} Quiz</h2>
            <p>Score at least {QUIZ_PASS_PERCENTAGE}% to advance!</p>
            
            {quizResult ? (
              <div className="quiz-result">
                <div className={`result-circle ${quizResult.percentage >= QUIZ_PASS_PERCENTAGE ? 'pass' : 'fail'}`}>
                  <span className="result-percent">{quizResult.percentage}%</span>
                </div>
                <p>{quizResult.correct} / {quizResult.total} correct</p>
                {quizResult.percentage >= QUIZ_PASS_PERCENTAGE ? (
                  <p className="result-msg success">🎉 Congratulations! Level {currentLevel + 1} Unlocked!</p>
                ) : (
                  <p className="result-msg fail">Keep learning and try again!</p>
                )}
                <button onClick={() => setShowQuiz(false)}>Close</button>
              </div>
            ) : (
              <div className="quiz-questions">
                {quizzes[currentLevel].questions.map((q, idx) => (
                  <div key={idx} className="quiz-question">
                    <p className="question-text">{idx + 1}. {q.question}</p>
                    <div className="options">
                      {q.options.map((opt, optIdx) => (
                        <label key={optIdx} className={quizAnswers[idx] === optIdx ? 'selected' : ''}>
                          <input
                            type="radio"
                            name={`q${idx}`}
                            checked={quizAnswers[idx] === optIdx}
                            onChange={() => setQuizAnswers(prev => ({ ...prev, [idx]: optIdx }))}
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="quiz-actions">
                  <button className="cancel-btn" onClick={() => setShowQuiz(false)}>Cancel</button>
                  <button 
                    className="submit-btn"
                    onClick={handleSubmitQuiz}
                    disabled={Object.keys(quizAnswers).length < quizzes[currentLevel].questions.length}
                  >
                    Submit Quiz
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI Chatbot */}
      <STEMifyChatbot 
        currentLevel={currentLevel}
        levelConfig={levelConfig}
        userData={userData}
      />

      {/* Certificate Modal */}
      {showCertificate && certificateLevel && (
        <CertificateModal
          level={certificateLevel}
          levelConfig={LEVEL_CONFIG[certificateLevel]}
          userData={userData}
          onClose={() => {
            setShowCertificate(false);
            setCertificateLevel(null);
          }}
        />
      )}

      {/* Block Coding Modal for Task 3 */}
      {showBlockCoding && selectedTask && (
        <div className="modal-overlay">
          <div className="modal block-coding-modal">
            <div className="modal-header">
              <div className="modal-title">
                <h2>🧱 Block Coding Challenge</h2>
                <p>{selectedTask.title}</p>
              </div>
              <button className="close-modal" onClick={() => setShowBlockCoding(false)}>✕</button>
            </div>

            {codeSent ? (
              <div className="code-sent-success">
                <div className="success-animation">🚗✨</div>
                <h3>Code Sent Successfully!</h3>
                <p>Your code has been sent to the ESP32 car.</p>
                <p>Watch your car execute the commands!</p>
                <div className="sent-code-preview">
                  <strong>Commands sent:</strong>
                  <div className="sent-blocks">
                    {blockCode.map((block, i) => (
                      <span key={i} className="sent-block">{block.icon} {block.label}</span>
                    ))}
                  </div>
                </div>
                <button className="close-btn" onClick={() => setShowBlockCoding(false)}>
                  ✅ Task Completed!
                </button>
              </div>
            ) : (
              <div className="block-coding-workspace">
                {/* Instructions */}
                <div className="coding-instructions">
                  <h4>📋 Your Challenge:</h4>
                  <pre>{selectedTask.instructions}</pre>
                </div>

                <div className="coding-area">
                  {/* Blocks Palette */}
                  <div className="blocks-palette-modal">
                    <h4>Available Blocks</h4>
                    
                    <div className="block-category">
                      <span className="category-label">🚗 Motion</span>
                      <div className="category-blocks">
                        {availableBlocks.filter(b => b.category === 'motion').map(block => (
                          <button 
                            key={block.id}
                            className="palette-block"
                            style={{ borderColor: block.color, backgroundColor: `${block.color}20` }}
                            onClick={() => addBlock(block)}
                          >
                            <span className="block-icon">{block.icon}</span>
                            <span className="block-text">{block.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="block-category">
                      <span className="category-label">📡 Sensor</span>
                      <div className="category-blocks">
                        {availableBlocks.filter(b => b.category === 'sensor').map(block => (
                          <button 
                            key={block.id}
                            className="palette-block"
                            style={{ borderColor: block.color, backgroundColor: `${block.color}20` }}
                            onClick={() => addBlock(block)}
                          >
                            <span className="block-icon">{block.icon}</span>
                            <span className="block-text">{block.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="block-category">
                      <span className="category-label">❓ Conditions</span>
                      <div className="category-blocks">
                        {availableBlocks.filter(b => b.category === 'condition').map(block => (
                          <button 
                            key={block.id}
                            className="palette-block"
                            style={{ borderColor: block.color, backgroundColor: `${block.color}20` }}
                            onClick={() => addBlock(block)}
                          >
                            <span className="block-icon">{block.icon}</span>
                            <span className="block-text">{block.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="block-category">
                      <span className="category-label">⏱️ Control</span>
                      <div className="category-blocks">
                        {availableBlocks.filter(b => b.category === 'control').map(block => (
                          <button 
                            key={block.id}
                            className="palette-block"
                            style={{ borderColor: block.color, backgroundColor: `${block.color}20` }}
                            onClick={() => addBlock(block)}
                          >
                            <span className="block-icon">{block.icon}</span>
                            <span className="block-text">{block.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="block-category">
                      <span className="category-label">💡 Output</span>
                      <div className="category-blocks">
                        {availableBlocks.filter(b => b.category === 'output').map(block => (
                          <button 
                            key={block.id}
                            className="palette-block"
                            style={{ borderColor: block.color, backgroundColor: `${block.color}20` }}
                            onClick={() => addBlock(block)}
                          >
                            <span className="block-icon">{block.icon}</span>
                            <span className="block-text">{block.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Code Workspace */}
                  <div className="code-workspace">
                    <div className="workspace-header">
                      <h4>Your Code</h4>
                      <button className="clear-all-btn" onClick={() => setBlockCode([])}>🗑️ Clear</button>
                    </div>
                    
                    <div className="workspace-blocks">
                      {blockCode.length === 0 ? (
                        <div className="empty-workspace">
                          <p>👆 Click blocks from the left panel to add them here</p>
                          <p>Build your program step by step!</p>
                        </div>
                      ) : (
                        <div className="block-stack">
                          {blockCode.map((block, index) => (
                            <div 
                              key={index} 
                              className="stacked-block"
                              style={{ borderLeftColor: block.color }}
                            >
                              <span className="block-number">{index + 1}</span>
                              <span className="block-icon">{block.icon}</span>
                              <span className="block-label">{block.label}</span>
                              <span className="block-code">{block.code}</span>
                              <button 
                                className="remove-block-btn"
                                onClick={() => removeBlock(index)}
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Generated Code Preview */}
                    <div className="generated-code">
                      <h4>Generated Code:</h4>
                      <pre className="code-preview-text">
                        {blockCode.length > 0 
                          ? blockCode.map((b, i) => `${i + 1}. ${b.code}`).join('\n')
                          : '// Your code will appear here'
                        }
                      </pre>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="coding-actions">
                  <div className={`modal-car-status ${carStatus?.connected ? 'connected' : 'disconnected'}`}>
                    {carStatus?.connected ? '🚗 Car Online - Ready!' : '⚠️ Car Offline - Connect your ESP32 first!'}
                  </div>
                  <div className="coding-action-buttons">
                    <button className="cancel-btn" onClick={() => setShowBlockCoding(false)}>
                      Cancel
                    </button>
                    <button 
                      className="send-to-car-btn"
                      onClick={sendCodeToESP32}
                      disabled={blockCode.length === 0 || !carStatus?.connected}
                      title={!carStatus?.connected ? 'Connect your ESP32 car first!' : 'Send code to ESP32'}
                    >
                      {carStatus?.connected ? '🚗 Send to ESP32 Car' : '🔒 Car Offline'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== Certificate Component ====================
function CertificateModal({ level, levelConfig, userData, onClose }) {
  const certificateRef = React.useRef(null);
  const isFinalLevel = level === TOTAL_LEVELS;
  
  const downloadCertificate = () => {
    // Create a simple text-based certificate for download
    const certText = `
═══════════════════════════════════════════════════════════════════════
                         CERTIFICATE OF COMPLETION
═══════════════════════════════════════════════════════════════════════

                              🏆 STEMify 🏆
                     STEM Learning Platform Certificate

This is to certify that

                           ${userData?.name || 'Student'}

has successfully completed

${isFinalLevel ? `
                    ★★★ ALL 10 LEVELS ★★★
                 
                   🎓 STEMify Master Engineer 🎓
                   
                     Full Course Completion
` : `
                         Level ${level}
                    ${levelConfig?.sensor}
                    
                    "${levelConfig?.certificate}"
`}

Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
Student Code: ${userData?.studentCode || 'N/A'}
Total XP Earned: ${userData?.xp || 0}

${isFinalLevel ? `
Congratulations on completing the entire STEMify course!
You have mastered:
• PIR Motion Sensor
• Ultrasonic Sensor  
• IR Obstacle Sensor
• Bluetooth Communication
• Temperature & Humidity Sensor
• Gas Detection
• Light Sensing
• Soil Moisture Monitoring
• Sound Detection
• Computer Vision & AI

You are now a certified STEMify Master Engineer!
` : ''}

═══════════════════════════════════════════════════════════════════════
                    www.stemify.com | Building Future Innovators
═══════════════════════════════════════════════════════════════════════
    `;
    
    const blob = new Blob([certText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `STEMify_Certificate_Level${level}_${userData?.name?.replace(/\s+/g, '_') || 'Student'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  return (
    <div className="modal-overlay certificate-overlay">
      <div className={`certificate-modal ${isFinalLevel ? 'final-certificate' : ''}`} ref={certificateRef}>
        <button className="close-certificate" onClick={onClose}>✕</button>
        
        {/* Confetti effect for final level */}
        {isFinalLevel && (
          <div className="confetti-container">
            {[...Array(50)].map((_, i) => (
              <div key={i} className="confetti" style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                backgroundColor: ['#f59e0b', '#14b8a6', '#8b5cf6', '#ef4444', '#22c55e'][Math.floor(Math.random() * 5)]
              }} />
            ))}
          </div>
        )}
        
        <div className="certificate-content">
          <div className="certificate-header">
            <div className="certificate-logo">🔬</div>
            <h1>STEMify</h1>
            <p className="certificate-subtitle">STEM Learning Platform</p>
          </div>
          
          <div className="certificate-border">
            <div className="certificate-body">
              <h2>🏆 Certificate of Completion 🏆</h2>
              
              <p className="cert-text">This is to certify that</p>
              
              <h3 className="student-name">{userData?.name || 'Student'}</h3>
              
              <p className="cert-text">has successfully completed</p>
              
              {isFinalLevel ? (
                <div className="final-achievement">
                  <div className="stars">★★★★★</div>
                  <h2 className="course-complete">🎓 STEMify Master Engineer 🎓</h2>
                  <p>Full Course Completion - All 10 Levels</p>
                  <div className="mastered-sensors">
                    <h4>Mastered Technologies:</h4>
                    <div className="sensor-badges">
                      {Object.entries(LEVEL_CONFIG).map(([lvl, config]) => (
                        <span key={lvl} className="sensor-badge-mini" style={{ backgroundColor: config.color }}>
                          {config.icon}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="level-achievement">
                  <div className="level-icon-large" style={{ backgroundColor: levelConfig?.color }}>
                    {levelConfig?.icon}
                  </div>
                  <h2 className="level-name">Level {level}</h2>
                  <h3 className="sensor-name">{levelConfig?.sensor}</h3>
                  <p className="certificate-title">"{levelConfig?.certificate}"</p>
                </div>
              )}
              
              <div className="certificate-details">
                <div className="detail-item">
                  <span className="detail-label">Date:</span>
                  <span className="detail-value">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Student Code:</span>
                  <span className="detail-value">{userData?.studentCode}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Total XP:</span>
                  <span className="detail-value">{userData?.xp || 0}</span>
                </div>
              </div>
              
              <div className="certificate-signature">
                <div className="signature-line"></div>
                <p>STEMify Academy</p>
              </div>
            </div>
          </div>
          
          <div className="certificate-actions">
            <button className="download-cert-btn" onClick={downloadCertificate}>
              📥 Download Certificate
            </button>
            <button className="share-cert-btn" onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: `STEMify Certificate - Level ${level}`,
                  text: `I just completed Level ${level} (${levelConfig?.sensor}) on STEMify! 🎉`,
                });
              } else {
                alert('🎉 Share your achievement on social media!');
              }
            }}>
              📤 Share Achievement
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== Task Card 1: Sensor Education ====================
function TaskCard1SensorEducation({ level, sensorInfo, levelConfig, isCompleted, onComplete }) {
  const [expanded, setExpanded] = useState(false);
  
  if (!sensorInfo) return null;
  
  return (
    <div className={`task-card-new task1-sensor ${isCompleted ? 'completed' : ''} ${expanded ? 'expanded' : ''}`}>
      <div className="task-card-header" style={{ borderColor: levelConfig?.color }}>
        <div className="task-badge">
          <span className="task-num">Task 1</span>
          <span className="task-type-icon">📚</span>
        </div>
        <h3>Learn About {sensorInfo.name}</h3>
        {isCompleted && <span className="completed-check">✅</span>}
      </div>
      
      <div className="task-card-content">
        {/* What is it section */}
        <div className="sensor-info-section">
          <h4>🔍 What is {sensorInfo.name.split(' (')[0]}?</h4>
          <p>{sensorInfo.whatIsIt}</p>
        </div>
        
        {/* Why use it section */}
        <div className="sensor-info-section">
          <h4>💡 Why Do We Use It?</h4>
          <p>{sensorInfo.whyUseIt}</p>
        </div>
        
        {/* Specifications */}
        <div className="sensor-specs">
          <div className="spec-item">
            <span className="spec-label">📏 Range:</span>
            <span className="spec-value">{sensorInfo.range}</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">🎯 Accuracy:</span>
            <span className="spec-value">{sensorInfo.accuracy}</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">⚡ Voltage:</span>
            <span className="spec-value">{sensorInfo.workingVoltage}</span>
          </div>
        </div>
        
        {/* Pins */}
        <div className="sensor-pins">
          <h4>🔌 Sensor Pins:</h4>
          <div className="pins-list">
            {sensorInfo.pins.map((pin, i) => (
              <span key={i} className="pin-badge" style={{ backgroundColor: `${levelConfig?.color}30`, borderColor: levelConfig?.color }}>
                {pin}
              </span>
            ))}
          </div>
        </div>
        
        {/* Fun Fact */}
        <div className="fun-fact" style={{ backgroundColor: `${levelConfig?.color}15` }}>
          <span className="fun-icon">🎉</span>
          <p><strong>Fun Fact:</strong> {sensorInfo.funFact}</p>
        </div>
        
        {/* Block Coding Preview */}
        <div className="block-coding-preview">
          <h4>🧱 What You'll Code in Task 3:</h4>
          <p>{sensorInfo.blockCodingPreview}</p>
          <div className="preview-blocks-list">
            {sensorInfo.sampleBlocks.map((block, i) => (
              <span key={i} className="preview-block" style={{ borderColor: levelConfig?.color }}>
                {block}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <div className="task-card-footer">
        <span className="xp-reward">+50 XP</span>
        {isCompleted ? (
          <span className="completed-status">✅ Knowledge Acquired!</span>
        ) : (
          <button className="complete-task-btn" onClick={onComplete} style={{ backgroundColor: levelConfig?.color }}>
            📖 I've Read & Understood
          </button>
        )}
      </div>
    </div>
  );
}

// ==================== Task Card 2: Connection Guide ====================
function TaskCard2ConnectionGuide({ level, connectionGuide, levelConfig, isCompleted, onComplete, isLocked }) {
  if (!connectionGuide) return null;
  
  return (
    <div className={`task-card-new task2-connection ${isCompleted ? 'completed' : ''} ${isLocked ? 'locked' : ''}`}>
      <div className="task-card-header" style={{ borderColor: levelConfig?.color }}>
        <div className="task-badge">
          <span className="task-num">Task 2</span>
          <span className="task-type-icon">🔌</span>
        </div>
        <h3>{connectionGuide.title}</h3>
        {isCompleted && <span className="completed-check">✅</span>}
        {isLocked && <span className="locked-icon">🔒</span>}
      </div>
      
      {isLocked ? (
        <div className="locked-message">
          <span className="lock-emoji">🔒</span>
          <p>Complete Task 1 first to unlock this task!</p>
        </div>
      ) : (
        <div className="task-card-content">
          {/* Components Needed */}
          <div className="components-section">
            <h4>🧰 Components You Need:</h4>
            <div className="components-list">
              {connectionGuide.components.map((comp, i) => (
                <span key={i} className="component-item">
                  <span className="check-box">☐</span>
                  {comp}
                </span>
              ))}
            </div>
          </div>
          
          {/* Step by Step Guide */}
          <div className="connection-steps">
            <h4>📝 Step-by-Step Connection:</h4>
            <div className="steps-list">
              {connectionGuide.steps.map((step, i) => (
                <div key={i} className="connection-step" style={{ borderLeftColor: step.wire === 'Red' ? '#ef4444' : step.wire === 'Black' ? '#1f2937' : step.wire === 'Yellow' ? '#eab308' : step.wire === 'Green' ? '#22c55e' : step.wire === 'Blue' ? '#3b82f6' : levelConfig?.color }}>
                  <div className="step-number">{i + 1}</div>
                  <div className="step-content">
                    <div className="step-pins">
                      <span className="pin-from">{step.pin}</span>
                      <span className="arrow">→</span>
                      <span className="pin-to">{step.connect}</span>
                      <span className="wire-color" style={{ backgroundColor: step.wire === 'Red' ? '#ef4444' : step.wire === 'Black' ? '#1f2937' : step.wire === 'Yellow' ? '#eab308' : step.wire === 'Green' ? '#22c55e' : step.wire === 'Blue' ? '#3b82f6' : '#6366f1' }}>
                        {step.wire} Wire
                      </span>
                    </div>
                    <p className="step-desc">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Wiring Diagram */}
          <div className="wiring-diagram">
            <h4>📊 Wiring Diagram:</h4>
            <pre className="diagram-code">{connectionGuide.diagram}</pre>
          </div>
          
          {/* Warning */}
          <div className="warning-box">
            <span className="warning-icon">⚠️</span>
            <p>{connectionGuide.warning}</p>
          </div>
          
          {/* Test Tip */}
          <div className="test-tip" style={{ backgroundColor: `${levelConfig?.color}15` }}>
            <span className="tip-icon">💡</span>
            <p><strong>Test Tip:</strong> {connectionGuide.testTip}</p>
          </div>
        </div>
      )}
      
      <div className="task-card-footer">
        <span className="xp-reward">+50 XP</span>
        {isCompleted ? (
          <span className="completed-status">✅ Sensor Connected!</span>
        ) : isLocked ? (
          <button className="complete-task-btn locked" disabled>
            🔒 Complete Task 1 First
          </button>
        ) : (
          <button className="complete-task-btn" onClick={onComplete} style={{ backgroundColor: levelConfig?.color }}>
            🔌 I've Connected the Sensor
          </button>
        )}
      </div>
    </div>
  );
}

// ==================== Task Card 3: Block Coding ====================
function TaskCard3BlockCoding({ level, sampleCode, levelConfig, availableBlocks, isCompleted, onComplete, isLocked, blockCode, setBlockCode, addBlock, removeBlock, sendCodeToESP32, carConnected }) {
  const [showBlockEditor, setShowBlockEditor] = useState(false);
  
  if (!sampleCode) return null;
  
  // Group blocks by category
  const blockCategories = {
    motion: { label: '🚗 Motion', color: '#3b82f6', blocks: availableBlocks.filter(b => b.category === 'motion') },
    sensor: { label: '📡 Sensor', color: '#06b6d4', blocks: availableBlocks.filter(b => b.category === 'sensor') },
    condition: { label: '❓ Conditions', color: '#a855f7', blocks: availableBlocks.filter(b => b.category === 'condition') },
    control: { label: '⏱️ Control', color: '#f59e0b', blocks: availableBlocks.filter(b => b.category === 'control') },
    output: { label: '💡 Output', color: '#22c55e', blocks: availableBlocks.filter(b => b.category === 'output') }
  };
  
  return (
    <div className={`task-card-new task3-blockcoding ${isCompleted ? 'completed' : ''} ${isLocked ? 'locked' : ''}`}>
      <div className="task-card-header" style={{ borderColor: levelConfig?.color }}>
        <div className="task-badge">
          <span className="task-num">Task 3</span>
          <span className="task-type-icon">🧱</span>
        </div>
        <h3>Block Coding Challenge</h3>
        {isCompleted && <span className="completed-check">✅</span>}
        {isLocked && <span className="locked-icon">🔒</span>}
      </div>
      
      {isLocked ? (
        <div className="locked-message">
          <span className="lock-emoji">🔒</span>
          <p>Complete Task 2 first to unlock block coding!</p>
        </div>
      ) : (
        <div className="task-card-content">
          {/* Challenge Description */}
          <div className="challenge-info">
            <h4>🎯 Your Challenge: {sampleCode.title}</h4>
            <p>{sampleCode.description}</p>
          </div>
          
          {/* Sample Code Reference */}
          <div className="sample-code-section">
            <h4>📋 Sample Code (Follow This Pattern):</h4>
            <div className="sample-blocks-container">
              {sampleCode.blocks.map((block, i) => (
                <div 
                  key={i} 
                  className="sample-block-item"
                  style={{ 
                    backgroundColor: `${block.color}20`, 
                    borderLeftColor: block.color,
                    borderLeftWidth: '4px',
                    borderLeftStyle: 'solid'
                  }}
                >
                  <span className="block-step">{i + 1}</span>
                  <span className="block-icon-sample">{block.icon}</span>
                  <span className="block-label-sample">{block.label}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Open Block Editor Button */}
          {!showBlockEditor && (
            <button 
              className="open-editor-btn" 
              onClick={() => {
                setBlockCode([]);
                setShowBlockEditor(true);
              }}
              style={{ backgroundColor: levelConfig?.color }}
            >
              🧱 Open Block Coding Editor
            </button>
          )}
          
          {/* Block Coding Editor */}
          {showBlockEditor && (
            <div className="block-editor-inline">
              <div className="editor-layout">
                {/* Blocks Palette - Left Side */}
                <div className="blocks-palette-sidebar">
                  <h4>📦 Available Blocks</h4>
                  {Object.entries(blockCategories).map(([catKey, cat]) => (
                    <div key={catKey} className="block-category-group">
                      <div className="category-header" style={{ backgroundColor: `${cat.color}30`, borderColor: cat.color }}>
                        {cat.label}
                      </div>
                      <div className="category-blocks-list">
                        {cat.blocks.map((block, i) => (
                          <button
                            key={i}
                            className="draggable-block"
                            onClick={() => addBlock(block)}
                            style={{ 
                              backgroundColor: `${block.color}15`,
                              borderColor: block.color
                            }}
                          >
                            <span className="block-icon">{block.icon}</span>
                            <span className="block-text">{block.label}</span>
                            <span className="add-icon">+</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Workspace - Right Side */}
                <div className="coding-workspace-area">
                  <div className="workspace-toolbar">
                    <h4>🎨 Your Code</h4>
                    <button className="clear-workspace-btn" onClick={() => setBlockCode([])}>
                      🗑️ Clear All
                    </button>
                  </div>
                  
                  <div className="code-drop-area">
                    {blockCode.length === 0 ? (
                      <div className="empty-workspace-hint">
                        <span className="hint-icon">👆</span>
                        <p>Click blocks from the left panel to add them here!</p>
                        <p className="hint-sub">Follow the sample code pattern above</p>
                      </div>
                    ) : (
                      <div className="placed-blocks-stack">
                        {blockCode.map((block, index) => (
                          <div 
                            key={index} 
                            className="placed-block-item"
                            style={{ 
                              backgroundColor: `${block.color}20`,
                              borderLeftColor: block.color
                            }}
                          >
                            <span className="block-index">{index + 1}</span>
                            <span className="block-icon">{block.icon}</span>
                            <span className="block-name">{block.label}</span>
                            <span className="block-code-text">[{block.code}]</span>
                            <button 
                              className="remove-block-btn-small"
                              onClick={() => removeBlock(index)}
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Generated Code Preview */}
                  <div className="generated-code-preview">
                    <h5>Generated Commands:</h5>
                    <pre className="code-output-text">
                      {blockCode.length > 0 
                        ? blockCode.map((b, i) => `${i + 1}. ${b.code}`).join('\n')
                        : '// Your code will appear here'}
                    </pre>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="editor-actions">
                <button 
                  className="cancel-editor-btn"
                  onClick={() => setShowBlockEditor(false)}
                >
                  ← Back
                </button>
                <div className="action-right">
                  <span className={`car-status-indicator ${carConnected ? 'connected' : 'disconnected'}`}>
                    {carConnected ? '🚗 Car Online - Ready!' : '⚠️ Car Offline - Connect First!'}
                  </span>
                  <button 
                    className="send-code-btn"
                    onClick={sendCodeToESP32}
                    disabled={blockCode.length === 0 || !carConnected}
                    style={{ 
                      backgroundColor: (blockCode.length > 0 && carConnected) ? levelConfig?.color : '#6b7280',
                      cursor: (!carConnected || blockCode.length === 0) ? 'not-allowed' : 'pointer'
                    }}
                    title={!carConnected ? 'Connect your ESP32 car first!' : 'Send code to ESP32'}
                  >
                    {carConnected ? '🚀 Send to ESP32' : '🔒 Car Offline'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="task-card-footer">
        <span className="xp-reward">+50 XP</span>
        {isCompleted ? (
          <span className="completed-status">✅ Block Coding Complete!</span>
        ) : isLocked ? (
          <button className="complete-task-btn locked" disabled>
            🔒 Complete Task 2 First
          </button>
        ) : (
          <span className="task-hint">Build code matching the sample above and send to ESP32!</span>
        )}
      </div>
    </div>
  );
}

// ==================== AI Chatbot Component ====================
function STEMifyChatbot({ currentLevel, levelConfig, userData }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: `Assalam-o-Alaikum ${userData?.name || 'Student'}! 👋 Main STEMify Bot hoon. Main tumhari madad kar sakta hoon sensors, tasks, ya kisi bhi cheez ke baare mein. Kya poochna hai?`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = React.useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // AI Response Generator
  const generateResponse = (userMessage) => {
    const msg = userMessage.toLowerCase();
    
    // Greetings
    if (msg.includes('hello') || msg.includes('hi') || msg.includes('salam') || msg.includes('assalam')) {
      return `Wa-Alaikum-Assalam! 🌟 Main STEMify Bot hoon. Tumhara level ${currentLevel} hai aur tum ${levelConfig?.sensor} seekh rahe ho. Kya help chahiye?`;
    }
    
    // About STEMify
    if (msg.includes('stemify') || msg.includes('kya hai') || msg.includes('what is')) {
      return `🔬 **STEMify** ek STEM Learning Platform hai!

📚 Is mein hai:
• 10 Levels - Har level mein ek naya sensor
• 30 Tasks - Wiring, Testing, Block Coding
• Quizzes - Har level ke baad
• ESP8266 Car - Jo tum control kar sakte ho!

🎯 Goal: Real electronics aur coding sikhna through fun projects!`;
    }
    
    // Current Level Help
    if (msg.includes('level') || msg.includes('current') || msg.includes('mera')) {
      return `📊 **Tumhara Current Status:**

🎯 Level: ${currentLevel}
📡 Sensor: ${levelConfig?.sensor}
⭐ XP: ${userData?.xp || 0}
✅ Tasks Done: ${userData?.totalTasksCompleted || 0}

${levelConfig?.icon} Is level mein tum ${levelConfig?.sensor} ke baare mein seekhoge!`;
    }
    
    // Sensor Information
    if (msg.includes('ultrasonic') || msg.includes('hc-sr04') || msg.includes('distance')) {
      return `📏 **Ultrasonic Sensor (HC-SR04)**

🔊 Kaise kaam karta hai:
• Sound waves bhejta hai
• Echo wapas aata hai
• Time se distance calculate hoti hai

📍 Formula: Distance = (Time × Speed of Sound) / 2

🔌 Pins: VCC, GND, TRIG, ECHO

💡 Use: Obstacle detection, parking sensors!`;
    }
    
    if (msg.includes('temperature') || msg.includes('dht11') || msg.includes('temp')) {
      return `🌡️ **DHT11 Temperature & Humidity Sensor**

📊 Features:
• Temperature range: 0-50°C
• Humidity range: 20-80%
• Digital output (easy to use!)

🔌 Pins: VCC, DATA, GND

⏱️ Note: 2 second delay between readings

💡 Use: Weather stations, AC control!`;
    }
    
    if (msg.includes('gas') || msg.includes('mq-2') || msg.includes('smoke')) {
      return `💨 **MQ-2 Gas Sensor**

🔍 Detect karta hai:
• LPG Gas
• Smoke
• Methane
• Alcohol vapors

⚠️ Important: 24-48 hours burn-in chahiye
🔥 Heater 5V pe chalta hai!

💡 Use: Fire alarms, gas leak detection!`;
    }
    
    if (msg.includes('ir') || msg.includes('infrared') || msg.includes('obstacle')) {
      return `📡 **IR Obstacle Sensor**

🔦 Kaise kaam karta hai:
• IR light emit karta hai
• Reflection detect karta hai
• Obstacle milne pe signal deta hai

📏 Range: 2-30cm (adjustable)
⚠️ White surface pe best!

💡 Use: Line following robots, obstacle avoidance!`;
    }
    
    if (msg.includes('soil') || msg.includes('moisture') || msg.includes('plant')) {
      return `🌱 **Soil Moisture Sensor**

💧 Kaise kaam karta hai:
• Soil ki conductivity measure karta hai
• Wet soil = Low resistance
• Dry soil = High resistance

⚠️ Tip: Continuously power mat do (corrosion!)

💡 Use: Automatic plant watering, smart garden!`;
    }
    
    if (msg.includes('ldr') || msg.includes('light') || msg.includes('photoresistor')) {
      return `💡 **LDR (Light Dependent Resistor)**

☀️ Kaise kaam karta hai:
• Bright light = Low resistance
• Dark = High resistance
• Voltage divider circuit use hota hai

🔌 Need: 10K resistor companion

💡 Use: Automatic lights, day/night sensing!`;
    }
    
    if (msg.includes('flame') || msg.includes('fire') || msg.includes('aag')) {
      return `🔥 **Flame Sensor**

👁️ Kaise kaam karta hai:
• Infrared light detect karta hai (760-1100nm)
• Fire ki heat ko sense karta hai
• Detection angle: ~60°

⚠️ Sunlight se bhi trigger ho sakta hai!

💡 Use: Fire alarm systems, safety robots!`;
    }
    
    if (msg.includes('pir') || msg.includes('motion') || msg.includes('movement')) {
      return `🚶 **PIR Motion Sensor (HC-SR501)**

👀 Kaise kaam karta hai:
• Infrared radiation changes detect karta hai
• Warm bodies (humans, animals) ko sense karta hai
• 30-60 sec warm-up chahiye!

📏 Range: 3-7 meters
📐 Angle: ~120°

💡 Use: Security systems, automatic doors!`;
    }
    
    if (msg.includes('water') || msg.includes('level') || msg.includes('pani')) {
      return `🌊 **Water Level Sensor**

💧 Kaise kaam karta hai:
• Conductivity measure karta hai
• More water = Lower resistance
• Analog output deta hai

⚠️ Corrosion se bachao - sirf reading waqt power do!

💡 Use: Tank monitoring, flood detection!`;
    }
    
    if (msg.includes('sound') || msg.includes('microphone') || msg.includes('awaz')) {
      return `🔊 **Sound Sensor (Microphone Module)**

🎤 Kaise kaam karta hai:
• Microphone sound capture karta hai
• Amplifier signal boost karta hai
• Analog + Digital output available

🎚️ Potentiometer se sensitivity adjust karo!

💡 Use: Clap switch, voice-activated systems!`;
    }
    
    // Block Coding Help
    if (msg.includes('block') || msg.includes('coding') || msg.includes('code') || msg.includes('scratch')) {
      const sampleCode = SAMPLE_BLOCK_CODES[currentLevel];
      return `🧱 **Block Coding Guide for Level ${currentLevel}**

📝 Kaise use karna hai:
1. **Tasks Tab** pe jao
2. **Task 3** open karo (Task 1 & 2 pehle complete karo)
3. Sample code dekho aur same pattern follow karo
4. Left panel se blocks click karke add karo
5. **Send to ESP32** click karo

🎯 **Level ${currentLevel} Challenge:**
${sampleCode?.title || 'Block Coding Challenge'}
${sampleCode?.description || ''}

🔧 Block Types:
• 🚗 Motion: Forward, Backward, Turn, Stop
• 📡 Sensor: Read ${levelConfig?.sensor}
• ❓ Condition: If statements for sensor values
• ⏱️ Control: Wait, Loops
• 💡 Output: LED, Buzzer, Alarm

💡 Tip: Sample code dekh ke exactly same blocks add karo!`;
    }
    
    // Car Control Help
    if (msg.includes('car') || msg.includes('esp') || msg.includes('connect')) {
      return `🚗 **ESP8266 Car Setup**

📡 Connection Steps:
1. WiFi Setup tab pe jao
2. WiFi name/password dalo
3. Code copy karo
4. Arduino IDE mein paste karo
5. ESP8266 mein upload karo

✅ Connected hone pe Dashboard pe "Online" dikhega!

⚠️ Problem? Check:
• WiFi credentials sahi hain?
• Student ID correct hai?
• ESP8266 powered on hai?`;
    }
    
    // Quiz Help
    if (msg.includes('quiz') || msg.includes('test') || msg.includes('exam')) {
      return `📝 **Quiz Information**

🎯 Rules:
• Har level ke baad quiz dena hai
• 5 questions hote hain
• 60% marks chahiye pass hone ke liye
• Pass hone pe next level unlock!

💡 Tips:
• Tasks complete karo pehle
• Sensor ke baare mein padho
• Agar fail ho jao, dobara try kar sakte ho!`;
    }
    
    // Task Help
    if (msg.includes('task') || msg.includes('kaam') || msg.includes('assignment')) {
      return `📋 **Tasks Guide for Level ${currentLevel}**

Har level mein 3 tasks hain:

1️⃣ **Task 1: Sensor Education** 📚
   • ${levelConfig?.sensor} ke baare mein seekho
   • Range, pins, aur uses jano
   • Block coding preview dekho

2️⃣ **Task 2: Connection Guide** 🔌
   • Step-by-step wiring instructions
   • VCC, GND, Data pins connect karo
   • Wiring diagram follow karo

3️⃣ **Task 3: Block Coding** 🧱
   • Sample code dekho
   • Same pattern mein blocks add karo
   • ESP32 ko code bhejo

⚠️ Important: Tasks sequence mein complete karo!
✅ Teeno complete karo → Quiz unlock!`;
    }
    
    // Connection Help - New
    if (msg.includes('connect') || msg.includes('wiring') || msg.includes('wire') || msg.includes('vcc') || msg.includes('gnd') || msg.includes('pin')) {
      const guide = CONNECTION_GUIDES[currentLevel];
      if (guide) {
        return `🔌 **${guide.title}**

📦 Components chahiye:
${guide.components.map(c => `• ${c}`).join('\n')}

📝 Connection Steps:
${guide.steps.map((s, i) => `${i+1}. ${s.pin} → ${s.connect} (${s.wire} wire)`).join('\n')}

⚠️ ${guide.warning}

💡 ${guide.testTip}

👉 Task 2 mein full diagram milega!`;
      }
    }
    
    // Current Sensor Info - New
    if (msg.includes('sensor') || msg.includes('about') || msg.includes('kya hai') || msg.includes('what') || msg.includes('tell')) {
      const info = SENSOR_INFO[currentLevel];
      if (info && (msg.includes(levelConfig?.sensor.toLowerCase().split(' ')[0]) || msg.includes('current') || msg.includes('this'))) {
        return `${levelConfig?.icon} **${info.name}**

🔍 **What is it?**
${info.whatIsIt}

💡 **Why we use it?**
${info.whyUseIt}

📏 **Range:** ${info.range}
⚡ **Voltage:** ${info.workingVoltage}

🔌 **Pins:** ${info.pins.join(', ')}

🎉 **Fun Fact:** ${info.funFact}

🧱 **Block Coding Preview:**
${info.blockCodingPreview}

👉 Task 1 mein puri details hain!`;
      }
    }
    
    // Wiring Help
    if (msg.includes('wiring') || msg.includes('wire') || msg.includes('connection') || msg.includes('connect')) {
      return `🔌 **Wiring Tips**

⚡ Basic Rules:
• VCC → Power (3.3V ya 5V)
• GND → Ground (Common)
• Data → GPIO pin

⚠️ Important:
• ESP8266 sirf 3.3V tolerant hai!
• Voltage divider use karo 5V→3.3V ke liye
• GND common rakhna zaroori hai

📚 Wiring instructions har task mein milti hain!`;
    }
    
    // XP & Progress
    if (msg.includes('xp') || msg.includes('points') || msg.includes('progress')) {
      return `⭐ **XP System**

📊 Tumhara Progress:
• Current XP: ${userData?.xp || 0}
• Level: ${currentLevel}
• Tasks Done: ${userData?.totalTasksCompleted || 0}

💰 XP kaise milta hai:
• Har task complete = +50 XP
• Quiz pass = +100 XP

🏆 Zyada XP = Better progress!`;
    }
    
    // Parent Portal
    if (msg.includes('parent') || msg.includes('mummy') || msg.includes('papa')) {
      return `👨‍👩‍👧 **Parent Portal**

📱 Parents kya dekh sakte hain:
• Tumhara current level
• Quiz scores
• Task completion
• Overall progress

🔗 Linking:
Parents ko tumhara **Student Code** chahiye:
**${userData?.studentCode || 'Dashboard pe dekho'}**

Ye code parent ko do taake wo progress track kar sakein!`;
    }
    
    // Help
    if (msg.includes('help') || msg.includes('madad') || msg.includes('kaise')) {
      return `🆘 **Main Kya Help Kar Sakta Hoon:**

📚 Topics:
• "What is STEMify" - Platform ke baare mein
• "My level" - Current progress
• "Ultrasonic sensor" - Sensor info
• "Block coding" - Coding help
• "Car connect" - ESP8266 setup
• "Quiz" - Quiz rules
• "Tasks" - Task guide
• "Wiring" - Connection tips
• "XP" - Points system

💬 Koi bhi sensor ka naam likh do, batata hoon!`;
    }
    
    // Default response
    return `🤔 Hmm, main is topic ke baare mein zyada nahi jaanta.

Try karo:
• "What is STEMify?"
• "Tell me about ${levelConfig?.sensor}"
• "How to do block coding?"
• "Help me with car connection"

Ya koi specific sensor poochlo! 📡`;
  };

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    
    // Simulate typing delay
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        type: 'bot',
        text: generateResponse(input),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 800 + Math.random() * 700);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickQuestions = [
    `About ${levelConfig?.sensor}`,
    "How to connect sensor?",
    "Block coding help",
    "My tasks",
    "Quiz help"
  ];

  return (
    <>
      {/* Chatbot Toggle Button */}
      <button 
        className={`chatbot-toggle ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? '✕' : '🤖'}
        {!isOpen && <span className="chatbot-badge">AI</span>}
      </button>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-avatar">🤖</div>
            <div className="chatbot-info">
              <h3>STEMify Assistant</h3>
              <span className="chatbot-status">
                <span className="status-dot online"></span> Online
              </span>
            </div>
            <button className="chatbot-close" onClick={() => setIsOpen(false)}>✕</button>
          </div>

          <div className="chatbot-messages">
            {messages.map(msg => (
              <div key={msg.id} className={`chat-message ${msg.type}`}>
                {msg.type === 'bot' && <span className="msg-avatar">🤖</span>}
                <div className="msg-content">
                  <div className="msg-text" dangerouslySetInnerHTML={{ 
                    __html: msg.text
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\n/g, '<br/>')
                  }} />
                  <span className="msg-time">{msg.time}</span>
                </div>
                {msg.type === 'user' && <span className="msg-avatar">👤</span>}
              </div>
            ))}
            {isTyping && (
              <div className="chat-message bot">
                <span className="msg-avatar">🤖</span>
                <div className="msg-content typing">
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          <div className="quick-questions">
            {quickQuestions.map((q, i) => (
              <button 
                key={i}
                className="quick-btn"
                onClick={() => {
                  setInput(q);
                  setTimeout(() => handleSend(), 100);
                }}
              >
                {q}
              </button>
            ))}
          </div>

          <div className="chatbot-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your question..."
            />
            <button onClick={handleSend} disabled={!input.trim()}>
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// ==================== Parent Dashboard ====================
function ParentDashboard() {
  const { user, userData, logout, updateUserData } = useAuth();
  const navigate = useNavigate();
  const [allUsers, setAllUsers] = useState({});
  const [childName, setChildName] = useState('');
  const [childCode, setChildCode] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const usersRef = ref(realtimeDb, 'users');
    const unsub = onValue(usersRef, (snapshot) => {
      setAllUsers(snapshot.val() || {});
    });
    return () => unsub();
  }, []);

  // Find children data
  const children = (userData?.children || []).map(child => {
    const studentData = Object.entries(allUsers).find(([id, u]) => 
      u.role === 'student' && u.studentCode === child.code
    );
    return studentData ? { ...studentData[1], id: studentData[0], linkedName: child.name } : null;
  }).filter(Boolean);

  const handleAddChild = async () => {
    setError('');
    if (!childCode || !childName) {
      setError('Please enter both name and student code');
      return;
    }

    // Check if student exists
    const exists = Object.values(allUsers).find(u => 
      u.role === 'student' && u.studentCode === childCode.toUpperCase()
    );

    if (!exists) {
      setError('Student code not found!');
      return;
    }

    // Check if already added
    if (userData?.children?.find(c => c.code === childCode.toUpperCase())) {
      setError('This child is already linked!');
      return;
    }

    const newChildren = [...(userData?.children || []), { code: childCode.toUpperCase(), name: childName }];
    await updateUserData({ children: newChildren });
    setChildCode('');
    setChildName('');
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="dashboard parent-dashboard">
      <nav className="dash-nav">
        <div className="dash-nav-left">
          <div className="dash-logo">
            <span className="logo-hex">🔬</span>
            <span>STEMify</span>
            <span className="role-badge parent">Parent</span>
          </div>
        </div>
        <div className="dash-nav-right">
          <span className="user-email">{userData?.name}</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </nav>

      <main className="dash-main">
        <header className="dash-header">
          <h1>Parent Dashboard</h1>
          <p>Track your children's STEM learning progress</p>
        </header>

        {/* Add Child */}
        <section className="dash-section">
          <h2>➕ Link Child's Account</h2>
          <div className="add-child-form">
            <input
              type="text"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              placeholder="Child's name"
            />
            <input
              type="text"
              value={childCode}
              onChange={(e) => setChildCode(e.target.value.toUpperCase())}
              placeholder="Student code (e.g., ABC123)"
              maxLength={6}
            />
            <button onClick={handleAddChild}>+ Link Child</button>
          </div>
          {error && <div className="error-msg">{error}</div>}
        </section>

        {/* Children List */}
        <section className="dash-section">
          <h2>👨‍👩‍👧 My Children ({children.length})</h2>
          
          {children.length === 0 ? (
            <div className="empty-state">
              <span>👨‍👩‍👧</span>
              <p>No children linked yet</p>
              <small>Enter your child's student code above</small>
            </div>
          ) : (
            <div className="children-grid">
              {children.map(child => {
                const levelConfig = LEVEL_CONFIG[child.level || 1];
                const progressData = Array.from({ length: TOTAL_LEVELS }, (_, i) => ({
                  level: `L${i + 1}`,
                  score: child.quizScores?.[i + 1] || 0
                }));

                return (
                  <div key={child.id} className="child-card">
                    <div className="child-header">
                      <div className="child-avatar">{levelConfig?.icon}</div>
                      <div className="child-info">
                        <h3>{child.linkedName || child.name}</h3>
                        <span className="child-code">Code: {child.studentCode}</span>
                      </div>
                    </div>

                    <div className="child-stats">
                      <div className="child-stat">
                        <span className="stat-value" style={{ color: levelConfig?.color }}>{child.level || 1}</span>
                        <span className="stat-label">Level</span>
                      </div>
                      <div className="child-stat">
                        <span className="stat-value">{child.xp || 0}</span>
                        <span className="stat-label">XP</span>
                      </div>
                      <div className="child-stat">
                        <span className="stat-value">{child.totalTasksCompleted || 0}</span>
                        <span className="stat-label">Tasks</span>
                      </div>
                    </div>

                    {/* Level Progress */}
                    <div className="child-level-progress">
                      <h4>Level Progress</h4>
                      <div className="level-dots">
                        {Array.from({ length: TOTAL_LEVELS }, (_, i) => i + 1).map(level => (
                          <div 
                            key={level}
                            className={`level-dot ${level < (child.level || 1) ? 'completed' : ''} ${level === (child.level || 1) ? 'current' : ''}`}
                            style={{ background: level <= (child.level || 1) ? LEVEL_CONFIG[level].color : '#2d3a4f' }}
                            title={`Level ${level}: ${LEVEL_CONFIG[level].sensor}`}
                          >
                            {level}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quiz Scores Chart */}
                    <div className="child-chart">
                      <h4>Quiz Scores</h4>
                      <ResponsiveContainer width="100%" height={150}>
                        <BarChart data={progressData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#2d3a4f" />
                          <XAxis dataKey="level" stroke="#94a3b8" fontSize={10} />
                          <YAxis stroke="#94a3b8" fontSize={10} domain={[0, 100]} />
                          <Tooltip contentStyle={{ background: '#1a2332', border: '1px solid #2d3a4f' }} />
                          <Bar dataKey="score" fill="#8b5cf6" radius={[2, 2, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* All Quiz Scores */}
                    <div className="child-quiz-scores">
                      <h4>Quiz History</h4>
                      <div className="quiz-scores-list">
                        {Object.entries(child.quizScores || {}).length > 0 ? (
                          Object.entries(child.quizScores).map(([lvl, score]) => (
                            <div key={lvl} className={`quiz-score-item ${score >= QUIZ_PASS_PERCENTAGE ? 'passed' : 'failed'}`}>
                              <span>{LEVEL_CONFIG[lvl]?.icon} L{lvl}</span>
                              <span>{score}%</span>
                              <span>{score >= QUIZ_PASS_PERCENTAGE ? '✅' : '❌'}</span>
                            </div>
                          ))
                        ) : (
                          <p className="no-scores">No quizzes taken yet</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

// ==================== Main App ====================
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login/:role" element={<AuthPageWrapper />} />
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/student" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
          <Route path="/parent" element={<ProtectedRoute allowedRoles={['parent']}><ParentDashboard /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

function AuthPageWrapper() {
  const role = window.location.pathname.split('/').pop();
  if (!['admin', 'student', 'parent'].includes(role)) {
    return <Navigate to="/" replace />;
  }
  return <AuthPage role={role} />;
}

export default App;
