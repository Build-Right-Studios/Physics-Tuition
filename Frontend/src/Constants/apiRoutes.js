// ─── API Route Constants ───────────────────────────────────────────────────
// Centralised place for all API endpoints.
// Usage: import { AUTH } from '@/constants/apiRoutes'
//        api.post(AUTH.LOGIN, body)

export const BASE= {
  ROUTE: "http://localhost:3000",
};

export const RAG = {
  BASE: "http://127.0.0.1:8000",
  DELETE_QUESTION: (qdrantId) => `/question/${qdrantId}`,
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
  GET:    "/api/users/students",
  UPDATE: (id) => `/api/users/${id}`,
  DELETE: (id) => `/api/users/${id}`,
};

export const QUESTIONS = {
  ADD:              "/api/questions/add",
  GET:              "/api/questions/get",
  GET_BY_QID:       (id) => `/api/questions/${id}`,
  // GET_BY_ID:        (id) => `/${id}`,   // ✅ fetch single question by id
  CHECK_SIMILARITY: "/match", // updated
  UPDATE:           (id) => `/api/questions/${id}`,
  DELETE:           (id) => `/api/questions/${id}`,
};

export const ASSIGNMENTS = {
    GENERATE: "/api/assignments/generate",
};