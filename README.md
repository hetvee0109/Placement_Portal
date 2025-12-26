# 🎓 TPO & Student Placement Management Portal

> A centralized web platform to simplify and automate **Training & Placement activities** for students and TPOs.

---

## 👩‍💻 Developed By
- **Tithi R. Rojivadiya (IT119)**  
- **Hetvee M. Rabara (IT114)**  

📍 *Dharmsinh Desai University, Nadiad*  
🎓 *IT Batch 2027*

---

## 📌 Project Overview

The **Placement Management Portal** is a full-stack web application designed to manage the entire placement lifecycle efficiently.  
It provides **separate dashboards** for **Students** and **Training & Placement Officers (TPOs)** with role-based access control.

✨ From **resume uploads** to **job drive creation**, **eligibility checks**, and **final placement results** — everything in one place.

---

## 🚀 Key Features

### 🔐 TPO / Admin Portal
- 👥 Manage student records & profiles  
- 📄 Review resumes and provide feedback  
- 🏢 Add companies & create job drives  
- 📏 Define eligibility criteria (CPI, branch, etc.)  
- 📋 View applications & shortlist students  
- 🏆 Publish placement results  
- 🔔 Send public & private notifications  
- 📊 Generate analytics and placement reports  

---

### 🎒 Student Portal
- 🧑‍🎓 Update personal & academic profile  
- 📎 Upload resume (**PDF only**)  
- 📝 View resume feedback from TPO  
- 📌 Apply for eligible job drives  
- 📈 Track application status  
- 🔔 Receive notifications  
- 🌟 View Placement Hall of Fame  

---

## 🛠️ Tech Stack

| Layer        | Technology |
|-------------|------------|
| 🎨 Frontend | HTML, CSS, JavaScript, React.js |
| ⚙️ Backend  | Spring Boot, Hibernate |
| 🗄️ Database | MySQL |
| 🔐 Security | JWT Authentication |
| 📧 Services | SMTP / OTP Email Service |

---

## 🗂️ System Modules

- 🎓 Student Management  
- 📄 Resume Upload & Feedback  
- 🏢 Company & Job Drive Management  
- 📋 Application & Shortlisting System  
- 🔔 Notification Module  
- 🏆 Placement Results  
- 📊 Reports & Analytics  

---

## 🔒 Functional Requirements

- ✅ Role-based access (Student / TPO)  
- ✅ Secure JWT authentication  
- ✅ PDF-only resume upload  
- 🚫 Placed students restricted from applying to new drives  

---

## 📁 Project Structure

```bash
Placement-Management-Portal/
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       └── App.js
│
├── backend/
│   ├── controller/
│   ├── service/
│   ├── repository/
│   ├── entity/
│   └── security/
│
├── database/
│   └── schema.sql
│
└── README.md
