import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';


const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/signin', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'signin.html'));
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




app.listen(8080, () => {
    console.log('http://localhost:8080 에서 서버 실행중');
});