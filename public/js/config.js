import dotenv from 'dotenv';
dotenv.config();

export const HOST = process.env.HOST || 'localhost';
export const API_BASE_URL = `http://${HOST}/api`;
export const MAX_FILE_SIZE = 5 * 1024 * 1024;
export const DEFAULT_PROFILE_IMAGE = 'https://dyto0gfaepgcj.cloudfront.net/user-profile.jpg';