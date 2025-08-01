<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
</p>

<h2 align="center">NestJS Backend – University Attendance Management System</h2>

<p align="center">A minimal backend built using NestJS with user authentication, DTO validation, JWT tokens, and email service.</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@nestjs/core" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
  <a href="https://www.npmjs.com/package/@nestjs/core" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
  <a href="https://www.npmjs.com/package/@nestjs/common" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
</p>

## Description

This is the backend API for the **University Attendance Management System**, built using [NestJS](https://nestjs.com/). It includes:

- **User Signup & Login APIs**
- **JWT Token Generation**
- **DTOs for Request Validation**
- **Password Hashing**
- **Email service using Nodemailer** to send account credentials and notify the user on signup

## Setup & Run

```bash
# Install dependencies
npm install

# Run the app in development mode
npm run start:dev

# Or run normally
npm run start
```

## Auth Flow

### POST `/auth/signup`

- Creates a new user
- Hashes password securely
- Sends an email to the user with their login credentials

### POST `/auth/login`

- Validates user credentials
- Returns a JWT token if successful

## Email Service

The project includes a fully functional **email service** using **Nodemailer**.
When a user signs up, they receive an email with their login credentials.

### Configuration required in `.env`:

```
MAIL_USER=your-gmail-address@gmail.com
MAIL_PASS=your-gmail-app-password
```

### Email Includes:

- First name
- Login email
- Password
- Login link to frontend

## Security Features

- Passwords are hashed using `bcrypt`
- JWT tokens issued on login
- Input is validated with `class-validator`
- Sensitive config handled via `.env`

## API Base URL

```
http://localhost:3001
```

Frontend expected at:

```
http://localhost:5173
```

## Future Enhancements

- Role-based login signup access control (Admin, Student, Teacher)

## Author

**Momna Javed**
[GitHub Repository](https://github.com/MomnaJaved/NestJS-2)
