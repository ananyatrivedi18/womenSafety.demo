#  SheShield – Women's Safety Portal

**Made by Ananya Trivedi**

SheShield is a web application that I built to learn full-stack development while working on a project related to women's safety.The idea behind this project is to provide a platform where users can manage emergency contacts and quickly trigger an SOS alert during emergencies.

This project uses **HTML, CSS, and JavaScript** for the frontend and **Node.js with Express.js** for the backend. User authentication is implemented using **JWT** and passwords are secured using **bcrypt**.

 This project currently uses in-memory storage, so all data gets cleared whenever the server restarts. I chose this approach to keep the project simple and focus on learning backend concepts.

---

## Features

* User Registration and Login
* Emergency Contact Management
* SOS Alert Functionality
* User Dashboard
* Safety Tips Section

---

## Tech Stack

### Frontend

* HTML
* CSS
* JavaScript

### Backend

* Node.js
* Express.js

### Authentication

* JWT (JSON Web Token)
* Bcrypt

---

## Project Structure

```text
SheShield/
├── frontend/
│   ├── HTML Pages
│   ├── CSS
│   └── JavaScript Files
│
├── backend/
│   ├── Routes
│   ├── Middleware
│   ├── Data Storage
│   └── Server Setup
│
└── README.md
```

---

## How to Run the Project

### 1. Go to the backend folder

```bash
cd SheShield/backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create a .env file

Copy the example file and add your secret key.

```bash
cp .env.example .env
```

### 4. Start the server

```bash
npm start
```

or

```bash
npm run dev
```

Open:

```text
http://localhost:5000
```

in your browser.

---

## What I Learned

While building this project, I learned:

* How frontend and backend communicate using APIs
* Creating REST APIs with Express.js
* User authentication using JWT
* Password hashing with bcrypt
* Managing user data and requests
* Structuring a full-stack project

---

## Future Improvements

Some features I would like to add in the future:

* Database integration using MongoDB
* Real-time location sharing
* SMS and email alerts
* Live emergency tracking
* Mobile-friendly enhancements

---

## About Me

Hi,I'm **Ananya Trivedi**, a B.Tech Computer Science student who is currently learning Data Structures, Web Development, and Backend Development.I built this project to improve my full-stack development skills and gain hands-on experience with authentication and API development.

Thank you for checking out my project!


