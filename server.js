import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'signup.html'));
});

app.get('/posts', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'post-list.html'));
});

app.get('/upload', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'upload-post.html'));
});

app.get('/profile/edit', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'edit-profile.html'));
});

app.get('/password/change', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'change-password.html'));
});

app.get('/post', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'post-detail.html'));
});

app.get('/post/edit', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'edit-post.html'));
});

app.get('/terms', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'terms', 'terms.html'));
});

app.get('/privacy', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'terms', 'privacy.html'));
});

app.listen(3000, () => {
    console.log(`http://${HOST}:${PORT} 에서 서버 실행 중`);
});
