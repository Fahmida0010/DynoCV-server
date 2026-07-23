# 🚀 Recruitment Platform "DynoCV"

> A full-stack recruitment platform where Candidates can build reusable professional profiles and generate customized CVs based on Recruiter-defined position templates.

---

## 🌐 Live Demo

- **Client:** https://dyno-cv-client.vercel.app
- **Server API:** https://dyno-cv-server.vercel.app

---

## 📂 GitHub Repository

### Frontend
🔗 https://github.com/Fahmida0010/DynoCv-client.git

### Backend
🔗 https://github.com/Fahmida0010/DynoCV-server.git

---

# 📖 Project Overview

The Recruitment Platform "DynoCV" is a modern web-based application designed to simplify the hiring process for Candidates, Recruiters, and Administrators.

Instead of creating a new resume for every job, candidates maintain a reusable professional profile containing personal information, skills, projects, and other attributes. Recruiters create customizable position templates using a shared attribute library, and the platform automatically generates position-specific CVs based on candidate data.

The application follows a role-based access control system and supports secure authentication, social login, automatic profile saving, optimistic locking, discussions, likes, and dynamic CV generation.

---

# ✨ Core Features

## 🔹 Reusable Attribute Library

Candidates fill profile attributes once and reuse them across multiple CVs.

Examples:

- Skills
- Languages
- IELTS Score
- Certifications
- Remote Availability
- Presentation Skills

Recruiters manage the shared attribute library.

---

## 🔹 Custom Position Templates

Recruiters can

- Create job positions
- Build custom CV templates
- Select required attributes
- Configure candidate access
- Duplicate existing positions

---

## 🔹 Automatically Generated CVs

Candidates can generate tailored CVs for each position.

Each generated CV automatically combines

- Personal Information
- Skills
- Projects
- Position-specific attributes

---

# 👥 User Roles

## Candidate

- Register & Login
- Social Authentication
- Manage Personal Profile
- Manage Projects
- Fill Attribute Library
- Generate CVs
- Edit/Delete CVs
- Join Discussions

---

## Recruiter

- Create Positions
- Update Positions
- Delete Positions
- Duplicate Positions
- Configure Position Access
- Manage Templates
- Manage Attribute Library
- View Candidate CVs
- Like CVs
- Participate in Discussions

---

## Administrator

Admins have full system access.

They can

- Manage Users
- Assign Roles
- Remove Roles
- Block/Unblock Users
- Delete Users
- Edit Any Profile
- Edit Any CV
- Edit Any Position
- Perform Recruiter Actions
- Perform Candidate Actions

---

# 🔐 Authentication & Authorization

- JWT Authentication
- Role-Based Authorization
- Google Login
- Facebook Login
- Password Hashing using bcrypt
- Protected Routes
- Secure API Access

---

# 👤 Personal Profile

Each Candidate has a professional profile consisting of

### Me

- First Name
- Last Name
- Location
- Profile Photo

### Info

Dynamic attributes from the shared Attribute Library.

Examples

- IELTS Score
- Skills
- Languages
- Certifications
- Remote Availability

### Projects

Each project contains

- Project Name
- Duration
- Markdown Description
- Technology Tags

### CVs

- Create Position-specific CV
- Edit CV
- Delete CV
- One CV per Position

---

# ⚡ Auto Save

The platform supports automatic profile saving.

- Auto-save every 5–10 seconds
- No save on every keystroke
- Local change tracking
- Optimistic Locking
- Version Conflict Handling

---

# 💻 Tech Stack

## Frontend

- React
- TypeScript
- Bootstrap
- React Hook Form
- Axios
- Zod
- React Router DOM

---

## Backend

- NestJS
- Prisma ORM
- PostgreSQL
- JWT Authentication
- bcrypt
- Nodemailer
- Cloudinary

---

# 🛠️ Tools

- Git
- GitHub
- Postman
- Prisma Studio
- Docker
- VS Code

---

# 📁 Project Structure

```
Client
│
├── Components
├── Pages
├── Layouts
├── Hooks
├── Services
├── Routes
├── Types
└── Utils

Server
│
├── Modules
├── Controllers
├── Services
├── DTOs
├── Guards
├── Middlewares
├── Prisma
├── Utils
└── Config
```

---

# 🚀 Installation

## Clone Client

```bash
git clone https://github.com/Fahmida0010/DynoCv-client.git
```

```bash
cd recruitment-platform-client
npm install
npm run dev
```

---

## Clone Server

```bash
git clone https://github.com/Fahmida0010/DynoCV-server.git
```

```bash
cd recruitment-platform-server
npm install
```

Generate Prisma Client

```bash
npx prisma generate
```

Run Migration

```bash
npx prisma migrate dev
```

Start Server

```bash
npm run start:dev
```

---

# 🔑 Environment Variables

Create a `.env` file and configure

```env
DATABASE_URL=

JWT_ACCESS_SECRET=

JWT_REFRESH_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

FACEBOOK_APP_ID=
FACEBOOK_APP_SECRET=

MAIL_USER=
MAIL_PASS=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

# 📌 API Features

- Authentication
- Authorization
- User Management
- Profile Management
- Attribute Library
- Position Management
- CV Management
- Project Management
- Discussions
- Likes
- Search
- Auto Save

---

# 📈 Future Improvements

- 🔔 Real-time notifications using Socket.io
- 💬 Real-time messaging between Recruiters and Candidates
- 📄 Export CV as PDF
- 🤖 AI-powered CV suggestions
- 🎯 Job recommendation system
- 📊 Recruiter analytics dashboard
- 📅 Interview scheduling system
- ⭐ Candidate bookmarking
- 🌍 Multi-language support
- 📱 Progressive Web App (PWA)
- 🌓 Dark & Light mode
- 🔍 Advanced filtering and search
- 📈 Activity logs and audit history
- 📤 Email notifications for job updates
- 📹 Video interview integration

---

# 👨‍💻 Author

**Fahmida Akter**

GitHub: https://github.com/Fahmida0010

LinkedIn: https://www.linkedin.com/in/fahmida-akter-tanjina/

