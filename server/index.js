require('dotenv').config(); // NPM INSTALL dotenv PARA CONSEGUIR TER O ACESSO A SECRET_KEY
const express = require("express"); // NPM INSTALL express
const cors = require("cors"); // NPM INSTALL cors
const app = express();
const mysql = require("mysql"); // NPM INSTALL mysql
const bcrypt = require("bcrypt"); // NPM INSTALL bcrypt
const jwt = require("jsonwebtoken"); // NPM INSTALL jsonwebtoken PARA AUTENTICAÇÃO VIA TOKEN

const saltRounds = 10;
const SECRET_KEY = process.env.SECRET_KEY;


const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "awards_database",
});

app.use(express.json());
app.use(cors());

app.post("/login", (req, res) => {
    const { email, password } = req.body;

    db.query("SELECT * FROM usuario WHERE email = ?", [email], (err, result) => {
        if (err) {
            return res.send({ msg: err });
        }
        if (result.length > 0) {
            bcrypt.compare(password, result[0].password, (error, isMatch) => {
                if (error) {
                    return res.send({ msg: error });
                }
                if (isMatch) {
                    const userId = result[0].userId;
                    const token = jwt.sign({ id: userId }, SECRET_KEY, { expiresIn: "1h" });
                    res.send({ msg: "Usuário logado com sucesso", token });
                } else {
                    res.send({ msg: "Senha incorreta" });
                }
            });
        } else {
            res.send({ msg: "Conta não encontrada" });
        }
    });
});

app.post("/register", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    db.query("SELECT * FROM usuario WHERE email = ?", [email], (err, result) => {
        if (err) {
            return res.send({ msg: "Erro ao buscar usuário: " + err });
        }
        if (result.length === 0) { // BACKEND RETORNA UM RESULT DE ACORDO COM O EMAIL QUE FOI RECEBIDO
            bcrypt.hash(password, saltRounds, (error, hash) => {
                if (error) {
                    return res.send({ msg: "Erro ao gerar hash: " + error });
                }
                db.query("INSERT INTO usuario (email, password) VALUES (?, ?)", [email, hash], (err, result) => {
                    if (err) {
                        return res.send({ msg: "Erro ao cadastrar usuário: " + err });
                    }
                    res.send({ msg: "Cadastrado com sucesso" });
                });
            });
        } else { // SE O EMAIL FOI ENCONTRADO SIGNIFICA QUE ESS EMAIL JÁ FOI USADO
            res.send({ msg: "Usuário já cadastrado" });
        }
    });
});

app.listen(3001, () => {
    console.log("Rodando na porta 3001");
});

function authenticateToken(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).send("Acesso negado");

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) return res.status(403).send("Token inválido");

        req.userId = decoded.id;
        console.log(req.userId);
        next();
    });
}

app.get("/watchlist", authenticateToken, (req, res) => {
    const userId = req.userId;
    db.query("SELECT * FROM watchlist WHERE userId = ?", [userId], (err, result) => {
        if (err) {
            return res.send({ msg: err });
        }
        res.send(result);
    });
});



app.post("/watchlist", authenticateToken, (req, res) => {
    const userId = req.userId;
    const { movieId } = req.body;

    db.query("SELECT * FROM watchlist WHERE userId = ? AND movieId = ?", [userId, movieId], (err, result) => {
        if (err) {
            return res.send({ msg: err });
        }

        db.query("INSERT INTO watchlist (userId, movieId) VALUES (?, ?)", [userId, movieId], (err, result) => {
            if (err) {
                return res.send({ msg: err });
            }
            res.send({ msg: "Filme adicionado à WatchList com sucesso." });
        });
    });
});

app.put("/watchlist/:movieId", authenticateToken, (req, res) => {
    const userId = req.userId;
    const { movieId } = req.params;

    db.query("SELECT * FROM watchlist WHERE userId = ? AND movieId = ?", [userId, movieId], (err, result) => {
        if (err) {
            return res.status(500).send({ msg: "Erro ao verificar a watchlist" });
        }

        if (result.length === 0) {
            return res.status(404).send({ msg: "Filme não encontrado na WatchList" });
        }

        // Aqui você pode substituir ou atualizar o recurso.
        db.query("DELETE FROM watchlist WHERE userId = ? AND movieId = ?", [userId, movieId], (err, result) => {
            if (err) {
                return res.status(500).send({ msg: err });
            }
            res.send({ msg: "Filme removido da WatchList com sucesso." });
        });
    });
});