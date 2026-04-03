# **App Name**: WattWise

## Core Features:

- Secure User Access: Firebase Email/Password login and signup to manage user access to the monitoring system, providing an initial landing page experience with brand and college identification.
- Real-time Electrical Parameter Dashboard: Display real-time electrical parameters (Voltage RMS, Current RMS, Active/Reactive/Apparent Power, Power Factor, Frequency, Energy Consumption) using interactive line and bar charts, sourced from Firestore.
- AI-Powered Predictive Analytics Tool: A tool leveraging Convolutional Neural Networks (CNN) for classifying harmonic distortion levels and autoencoders for detecting anomalies such as voltage sags/swells and abnormal THD. This module processes real-time waveform data to output normal/distorted status, severity, and fault patterns.
- Power Quality Anomaly Alerts: Visualize detected power quality issues, including harmonics (THD), voltage sags, and swells, with real-time, color-coded alerts (green, yellow, red) and corresponding event timestamps from Firestore.
- Dynamic Device Health Index: Calculate (via Cloud Functions) and display a real-time 'Health Index' using a gauge meter, ranging from Very Low (Green) to Very High (Red), based on THD levels, voltage stability, and fault frequency, with data stored in Firestore.
- Comprehensive 30-Day Reporting: Generate and present historical graphs for the last 30 days detailing Voltage, Current, THD, and fault occurrences, along with a summary including average THD, total disturbances, and health trends. Provides an option for downloadable PDF reports.
- Secure Real-time Data Ingestion: Establish a robust system to securely receive and store streaming electrical data (Voltage, Current, THD, Events) from IoT devices like ESP32 into Firebase Firestore for immediate and historical analysis.

## Style Guidelines:

- Primary interactive color: A modern and professional blue (#3C71DD), conveying trust and technological precision against a dark interface.
- Background color: A very dark, subtle blue-grey (#16191C), providing a high-contrast foundation that enhances readability and accentuates data visualizations in a tech-centric manner.
- Accent color: A vibrant cyan (#1FCBED), used for secondary actions, highlight elements, and dynamic indicators to draw attention effectively.
- Alert status color (Healthy): Bright green (#2ECC71) for normal operations and healthy device states.
- Alert status color (Warning): Warm yellow (#FFC028) for minor deviations and advisory warnings.
- Alert status color (Critical): Bold red (#E62E2E) to highlight critical issues and immediate concerns.
- Primary font: 'Inter' (sans-serif) for all text elements. Its modern, objective, and highly legible design is ideal for data-intensive dashboards and real-time monitoring applications, ensuring clarity and readability.
- Utilize modern, crisp, and predominantly linear icons for representing electrical parameters (e.g., voltage, current, frequency), power quality issues, and health index status. Icons should be clear and minimalist to maintain a clean UI.
- Employ a modular, grid-based dashboard layout with ample spacing and visual hierarchy to manage complex data. The design should be fully responsive, adapting seamlessly across various device sizes, with subtle gradients enhancing background sections as requested.
- Integrate smooth and subtle animations for real-time chart updates, gauge meter transitions, and alert notifications. These should enhance the dynamic nature of the monitoring system without causing distraction, improving user feedback and engagement.