const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// MySQL 연결 설정
const db = mysql.createConnection({
    host: 'mysql-goals-service', // Kubernetes 내 서비스 이름
    user: 'admin',
    password: 'admin',
    database: 'goals_db'
});

db.connect(err => {
    if (err) {
        console.error('MySQL 연결 실패:', err);
        return;
    }
    console.log('MySQL 연결 성공');
});

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// 메인 페이지 (목표 목록 출력)
app.get('/', (req, res) => {
    db.query('SELECT * FROM goals ORDER BY created_at DESC', (err, results) => {
        if (err) {
            console.error('DB 조회 오류:', err);
            return res.send('DB 조회 오류');
        }
        res.render('index', { goals: results });
    });
});

// 목표 추가
app.post('/add-goal', (req, res) => {
    const { title, author, content } = req.body;
    db.query(
        'INSERT INTO goals (title, author, content) VALUES (?, ?, ?)',
        [title, author, content],
        (err) => {
            if (err) return res.send('DB 저장 오류');
            res.redirect('/');
        }
    );
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`서버 실행 중: http://0.0.0.0:${PORT}`);
});