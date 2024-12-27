# Poultry Management Web Application  
**BSSE 4105 | GROUP 9**  

## 1. Project Overview  
Our project aims to develop a comprehensive Poultry Management System, leveraging predictive modeling and IoT systems. The application integrates multiple components to ensure seamless management of poultry operations through a user-friendly web interface, mobile application, AI-powered predictions, and IoT-based monitoring.

---

## 2. Project Structure  

The project is organized into the following directories:

- **`Web App/`**  
  Contains the React.js application for the frontend, providing an intuitive interface for users to interact with the system.

- **`Mobile App/`**  
  Contains the Dart code for the Flutter-based mobile application, offering on-the-go access to system features.

- **`API/`**  
  Contains the Node.js/Express.js application for the backend, handling core server-side logic and database interactions.

- **`AI Model/`**  
  Contains the FastAPI service for serving AI-based predictive models to enhance decision-making processes.

- **`Arduino/`**  
  Contains the Arduino code for IoT systems, enabling sensor integration and real-time monitoring of poultry conditions.

## Prerequisites
Make sure you have the following installed on your system:
- **Node.js** (version 20 or higher)
- **npm** (version 8 or higher)
- **Python** (version 3.9 or higher)
- **pip** (version 21 or higher)
- **Flutter SDK** (latest stable version): Required for building and running the mobile application.

## Cloning the Project

To clone the project, run the following command in your terminal:

git clone https://github.com/kalibbalajohnson/Poultry-Management-System.git

## Setting Up the Project

### API Setup
- cd API

- npm install

- npm run dev

### Web App Setup
- cd Web App

- npm install

- npm run dev

### AI Model Setup
- cd AI Model

- python -m venv venv

- venv\Scripts\activate 

- pip install -r requirements.txt

- uvicorn main:app --reload

venv -m

- pip install

- npm run dev

### Mobile App Setup
- cd Mobile App

- flutter pub get

- flutter run

### Arduino Setup
- Open the Arduino IDE and navigate to the project directory

- Ensure all necessary libraries are installed.

- Upload the code to the Arduino board


