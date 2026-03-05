// ─── API Route Constants ───────────────────────────────────────────────────
// Centralised place for all API endpoints.
// Usage: import { AUTH } from '@/constants/apiRoutes'
//        api.post(AUTH.LOGIN, body)

export const BASE= {
  ROUTE: "http://localhost:8000",
};

export const AUTH = {
  LOGIN: "/api/auth/login",
  LOGOUT: "/api/auth/logout",
  FORGOT_PASSWORD: "/api/auth/forgot-password",
  RESET_PASSWORD: "/api/auth/reset-password",
};

export const CHAPTERS = {
  ADD:    "/api/chapter/add",
  GET:   "/api/chapter/get",
  UPDATE: (id) => `/api/chapter/${id}`,
  DELETE: (id) => `/api/chapter/${id}`,
};

export const SUBTOPICS = {
  ADD:    "/api/subtopic/add",
  GET:   "/api/subtopic/get",
  UPDATE: (id) => `/api/chapter/${id}`,
  DELETE: (id) => `/api/chapter/${id}`,
};

export const STUDENTS = {
  ADD:    "/api/users/add-student",
  GET:    "/api/users",
  UPDATE: (id) => `/api/users/${id}`,
  DELETE: (id) => `/api/users/${id}`,
};