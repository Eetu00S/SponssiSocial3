const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

function readDb() {
    try {
        if (!fs.existsSync(DATA_FILE)) {
            const seed = {
                articles: [
                    {
                        id: Date.now().toString(),
                        author: 'Sponssi Social Tiimi',
                        title: 'Tervetuloa Sponssi Socialiin - uuteen nuorten some-alustaan',
                        category: 'general',
                        content: 'Hei! Tervetuloa Sponssi Socialiin, uuteen sosiaalisen median alustaan joka on suunniteltu erityisesti Pirkanmaan nuorille. Täällä voit jakaa uutisia, keskustella lukioaiheista ja pysyä ajan tasalla paikallisista tapahtumista. Aloita julkaisemalla oma artikkelisi tai kommentoimalla muiden julkaisuja. Toivomme että viihdyt täällä!',
                        date: new Date().toISOString(),
                        likes: 0,
                        comments: [],
                    },
                ],
            };
            fs.writeFileSync(DATA_FILE, JSON.stringify(seed, null, 2));
        }
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(raw);
    } catch (e) {
        console.error('DB read error:', e);
        return { articles: [] };
    }
}

function writeDb(db) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
}

app.get('/api/articles', (req, res) => {
    const db = readDb();
    res.json(db.articles.sort((a,b) => new Date(b.date) - new Date(a.date)));
});

app.post('/api/articles', (req, res) => {
    const { author, title, category = 'general', content } = req.body || {};
    if (!author || !title || !content) {
        return res.status(400).json({ error: 'author, title, content required' });
    }
    const db = readDb();
    const article = {
        id: Date.now().toString(),
        author,
        title,
        category,
        content,
        date: new Date().toISOString(),
        likes: 0,
        comments: [],
    };
    db.articles.unshift(article);
    writeDb(db);
    res.status(201).json(article);
});

app.post('/api/articles/:id/comments', (req, res) => {
    const { id } = req.params;
    const { author, content } = req.body || {};
    if (!author || !content) {
        return res.status(400).json({ error: 'author, content required' });
    }
    const db = readDb();
    const article = db.articles.find(a => a.id === id);
    if (!article) return res.status(404).json({ error: 'not found' });
    const comment = {
        id: Date.now().toString(),
        author,
        content,
        date: new Date().toISOString(),
    };
    article.comments.push(comment);
    writeDb(db);
    res.status(201).json(comment);
});

app.post('/api/articles/:id/like', (req, res) => {
    const { id } = req.params;
    const db = readDb();
    const article = db.articles.find(a => a.id === id);
    if (!article) return res.status(404).json({ error: 'not found' });
    article.likes += 1;
    writeDb(db);
    res.json({ likes: article.likes });
});

app.listen(PORT, () => {
    console.log(`Sponssi Social API running on http://localhost:${PORT}`);
});


