# Promethyx – Phythoplant AI

"Listening to Nature Before It Speaks"

A smart Edge AI-based plant stress detection system using ESP32, TinyML, and bioelectric signal monitoring.

# Overview

Promethyx – Phythoplant AI is an intelligent plant monitoring system designed to detect plant stress before visible symptoms appear. Unlike traditional systems that rely only on soil moisture or camera images, our solution uses the plant's own bioelectric signals along with Edge AI (TinyML on ESP32) to identify stress at an early stage.

The system continuously monitors plant health, sends alerts to users, and can automatically trigger actions such as irrigation when required.

# Project Objectives

- Detect plant stress before visible symptoms appear.
- Monitor plant health using bioelectric signals.
- Process plant data using TinyML on ESP32.
- Provide real-time alerts through a web dashboard.
- Support automatic irrigation to reduce crop losses.

# Problem Statement

Plant stress is usually detected only after visible symptoms such as yellowing leaves or wilting appear. By then, the plant has already suffered damage, resulting in lower crop yield, higher farming costs, and unnecessary use of fertilizers and pesticides.

# Proposed Solution

Our solution uses electrodes attached to the plant to collect bioelectric signals.

These signals are processed through a signal conditioning circuit and analyzed using TinyML running on an ESP32. When stress is detected, the system sends alerts to a web dashboard and can automatically activate devices such as a water pump or cooling fan.

# Key Features

- Early plant stress detection
- Bioelectric signal monitoring
- ESP32 and TinyML based analysis
- Real-time alerts
- Web dashboard
- Automatic irrigation support
- Continuous plant monitoring
- Long-term plant health records

# Tech Stack

## Hardware

- Plant
- ESP32
- Electrodes
- AD 620 Amplifier 
- Signal Conditioning Circuit
- Relay Module
- Water Pump / Fan (Prototype)

## Software

- HTML
- CSS
- JavaScript
- TinyML
- GitHub

# Prototype Workflow

The following flowchart illustrates the complete workflow of the Promethyx – Phythoplant AI system.

![Prototype Workflow](images/flowchart.png)

# Team Members

- Meenal Pandey (Team Leader)
- Harshit Bohra
- Harish Kumar
- Akshat
- Udit Gurjar
 

# Future Improvements

- Improve AI model accuracy.
- Support multiple crop species.
- Enhance sensor calibration.
- Add automatic fertilizer management.
-Reduce power consumption for long-term deployment.
