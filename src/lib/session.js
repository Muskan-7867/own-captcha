// lib/session.js
import { sealData, unsealData } from 'iron-session';

const sessionPassword = process.env.SESSION_SECRET || "default-secret-key-32-chars-long";
const sessionOptions = {
  password: sessionPassword,
  cookieName: "captcha-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production", // HTTPS in production
    maxAge: 60 * 15, // 15 minutes
  },
};

export async function createSession(data) {
  return await sealData(data, sessionOptions);
}

export async function getSession(cookie) {
  return await unsealData(cookie, sessionOptions);
}