# University Attendance Management System – Frontend

This is the **frontend** of the University Attendance Management System built using **React**, **TypeScript**, and **Vite**. It includes responsive UI forms, routing, toast notifications, and video background layout.

## Tech Stack

- **React** (Component-based UI)
- **TypeScript** (Type safety)
- **Vite** (Fast build tool)
- **React Router DOM** (Page navigation)
- **Axios** (API requests)
- **React Toastify** (Notifications)
- **Tailwind CSS** (Utility-first CSS)
- **@headlessui/react** + **@heroicons/react** (Accessible and stylish dropdowns)

## Features

- Sign Up & Login Forms with validation
- Form dropdowns (gender, marital status)
- Form submission via Axios to backend
- Toast notifications for success and error handling
- Layout with animated background video
- Dashboard and Landing pages with clean design

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run the development server

```bash
npm run dev
```

> Vite will start a dev server, usually at `http://localhost:5173`

### 3. Backend API

This frontend expects a backend running at:

http://localhost:3001

Make sure the backend is running before testing login/signup.

## Customization

- **API Endpoints** are hardcoded (`/auth/signup`, `/auth/login`). You can extract them into a `config.ts` file for cleaner management.
- **User types** are located in `types/user.ts`.

## Notes

- The **video background** is loaded from `/assets/hero/bg.mp4` and blurred using `backdrop-blur-sm`.
- The **form dropdowns** use `@headlessui/react` for accessibility and beautiful interaction.
- Styling is primarily done using **Tailwind CSS** classes with custom colors.

## Linting & Formatting

This project uses **TypeScript**, but no advanced ESLint configuration is currently added. You can expand lint rules if needed for production.

## License

This project is for educational/demo purposes and not production-ready.
