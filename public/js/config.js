import dotenv from 'dotenv';
dotenv.config();

export const API_BASE_URL = process.env.BACKEND_URL || 'http://localhost:8080/api';
export const MAX_FILE_SIZE = 5 * 1024 * 1024;
export const DEFAULT_PROFILE_IMAGE = 'https://dyto0gfaepgcj.cloudfront.net/user-profile.jpg';