require('dotenv').config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require('uuid');

const app = express();
const saltRounds = 10;
const SECRET_KEY = process.env.SECRET_KEY || "chave_secreta_dev"; 

// --- CONFIGURAÇÃO DO DOCKER ---
// Se estiver rodando via Docker Compose use: host: "mysql_db"
// Se estiver rodando o Node localmente e o banco no Docker use: host: "localhost"
const db = mysql.createPool({
    host: "localhost", 
    user: "root",
    password: "root", // Senha definida no docker-compose
    database: "awards_database",
    multipleStatements: true
});

app.use(express.json());
app.use(cors());

// --- MIDDLEWARE DE AUTENTICAÇÃO ---
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).send({ msg: "Acesso negado" });

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(403).send({ msg: "Token inválido" });
        req.userId = decoded.id;
        next();
    });
}

// ==========================================
// 1. AUTENTICAÇÃO
// ==========================================

app.post("/register", (req, res) => {
    const { email, password, name } = req.body;

    db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
        if (err) return res.send({ msg: err });
        if (result.length > 0) return res.send({ msg: "Usuário já cadastrado" });

        bcrypt.hash(password, saltRounds, (error, hash) => {
            if (error) return res.send({ msg: error });

            const sql = "INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)";
            db.query(sql, [email, hash, name, 'creator'], (err, result) => {
                if (err) return res.send({ msg: err });
                res.send({ msg: "Cadastrado com sucesso" });
            });
        });
    });
});

app.post("/login", (req, res) => {
    const { email, password } = req.body;

    db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
        if (err) return res.send({ msg: err });
        
        if (result.length > 0) {
            bcrypt.compare(password, result[0].password, (error, isMatch) => {
                if (isMatch) {
                    const token = jwt.sign({ id: result[0].id }, SECRET_KEY, { expiresIn: "24h" });
                    res.send({ msg: "Logado com sucesso", token, user: { name: result[0].name, id: result[0].id } });
                } else {
                    res.send({ msg: "Senha incorreta" });
                }
            });
        } else {
            res.send({ msg: "Conta não encontrada" });
        }
    });
});

// ==========================================
// VALIDAR LOGIN
// ==========================================

app.get("/validate-token", authenticateToken, (req, res) => {
    res.send({ valid: true, userId: req.userId });
});

// ==========================================
// 2. GESTÃO DE GRUPOS E CATEGORIAS
// ==========================================

app.post("/api/groups", authenticateToken, (req, res) => {
    const { title, description, start_date, end_date } = req.body;
    const token = uuidv4();

    const sql = "INSERT INTO award_groups (creator_id, title, description, start_date, end_date, access_token) VALUES (?, ?, ?, ?, ?, ?)";
    
    db.query(sql, [req.userId, title, description, start_date, end_date, token], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send({ msg: "Grupo criado!", groupId: result.insertId, linkToken: token });
    });
});

app.put("/api/groups/:id", authenticateToken, (req, res) => {
    const { title, description, start_date, end_date } = req.body;
    const groupId = req.params.id;
    const userId = req.userId;

    // Verifica se o grupo pertence ao usuário antes de editar
    const checkSql = "SELECT * FROM award_groups WHERE id = ? AND creator_id = ?";
    db.query(checkSql, [groupId, userId], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.length === 0) return res.status(403).send({ msg: "Permissão negada ou grupo não encontrado" });

        const updateSql = "UPDATE award_groups SET title = ?, description = ?, start_date = ?, end_date = ? WHERE id = ?";
        db.query(updateSql, [title, description, start_date, end_date, groupId], (err, result) => {
            if (err) return res.status(500).send(err);
            res.send({ msg: "Grupo atualizado com sucesso!" });
        });
    });
});

app.get("/api/my-groups", authenticateToken, (req, res) => {
    const sql = "SELECT * FROM award_groups WHERE creator_id = ? ORDER BY created_at DESC";
    db.query(sql, [req.userId], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send(result);
    });
});

app.post("/api/categories", authenticateToken, (req, res) => {
    const { groupId, name, description } = req.body;
    const sql = "INSERT INTO categories (group_id, name, description) VALUES (?, ?, ?)";
    db.query(sql, [groupId, name, description], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send({ msg: "Categoria adicionada!", categoryId: result.insertId });
    });
});

app.put("/api/categories/:id", authenticateToken, (req, res) => {
    const { name, description } = req.body;
    const sql = "UPDATE categories SET name = ?, description = ? WHERE id = ?";
    db.query(sql, [name, description, req.params.id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send({msg: "Categoria atualizada!"})
    })
})

app.post("/api/nominees", authenticateToken, (req, res) => {
    const { categoryId, name, description, imageUrl } = req.body;
    
    const sql = "INSERT INTO nominees (category_id, name, description, image_url) VALUES (?, ?, ?, ?)";
    db.query(sql, [categoryId, name, description, imageUrl], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send({ msg: "Indicado adicionado!" });
    });
});

app.put("/api/nominees/:id", authenticateToken, (req, res) => {
    const { name, description, image_url } = req.body;
    const sql = "UPDATE nominees SET name = ?, description = ?, image_url = ? WHERE id = ?";
    db.query(sql, [name, description, image_url, req.params.id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send({ msg: "Indicado atualizado!" });
    });
});

app.delete("/api/nominees/:id", authenticateToken, (req, res) => {
    db.query("DELETE FROM nominees WHERE id = ?", [req.params.id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send({ msg: "Indicado removido!" });
    });
});

app.delete("/api/categories/:id", authenticateToken, (req, res) => {
    db.query("DELETE FROM categories WHERE id = ?", [req.params.id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send({ msg: "Categoria removida!" });
    });
});

// ==========================================
// 3. VOTAÇÃO (PÚBLICO)
// ==========================================

// --- ROTA ATUALIZADA: AGORA RETORNA A DESCRIÇÃO DO INDICADO ---
app.get("/api/vote-data/:token", (req, res) => {
    const token = req.params.token;

    db.query("SELECT * FROM award_groups WHERE access_token = ?", [token], (err, groups) => {
        if (err || groups.length === 0) return res.status(404).send({ msg: "Votação não encontrada" });
        
        const group = groups[0];
        // const now = new Date();

        // if (now < new Date(group.start_date)) return res.status(400).send({ msg: "Votação ainda não iniciou" });
        // if (now > new Date(group.end_date)) return res.status(400).send({ msg: "Votação encerrada" });

        // SQL atualizado para buscar n.description
        const sqlData = `
            SELECT 
                c.id as cat_id, c.name as cat_name, c.description as cat_desc,
                n.id as nom_id, n.name as nom_name, n.description as nom_desc, n.image_url as nom_img
            FROM categories c
            LEFT JOIN nominees n ON c.id = n.category_id
            WHERE c.group_id = ?
        `;

        db.query(sqlData, [group.id], (err, rows) => {
            if (err) return res.status(500).send(err);

            const categoriesMap = {};
            
            rows.forEach(row => {
                if (!categoriesMap[row.cat_id]) {
                    categoriesMap[row.cat_id] = {
                        id: row.cat_id,
                        name: row.cat_name,
                        description: row.cat_desc,
                        nominees: []
                    };
                }
                if (row.nom_id) {
                    categoriesMap[row.cat_id].nominees.push({
                        id: row.nom_id,
                        name: row.nom_name,
                        description: row.nom_desc, // Inclui descrição no JSON
                        image: row.nom_img
                    });
                }
            });

            res.send({
                group: { id: group.id, title: group.title, description: group.description, start_date: group.start_date, end_date: group.end_date },
                categories: Object.values(categoriesMap)
            });
        });
    });
});

app.post("/api/vote", authenticateToken, (req, res) => {
    const { groupId, categoryId, nomineeId } = req.body;
    const userId = req.userId;

    const sql = "INSERT INTO votes (user_id, group_id, category_id, nominee_id) VALUES (?, ?, ?, ?)";
    
    db.query(sql, [userId, groupId, categoryId, nomineeId], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).send({ msg: "Você já votou nesta categoria!" });
            }
            return res.status(500).send({ msg: "Erro ao registrar voto" });
        }
        res.send({ msg: "Voto confirmado!" });
    });
});

app.delete("/api/vote", authenticateToken, (req, res) => {
    const { groupId, categoryId } = req.body;
    const userId = req.userId;

    const sql = "DELETE FROM votes WHERE user_id = ? AND group_id = ? AND category_id = ?";
    
    db.query(sql, [userId, groupId, categoryId], (err, result) => {
        if (err) {
            return res.status(500).send({ msg: "Erro ao deletar o voto" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).send({ msg: "Voto não encontrado" });
        }

        res.send({ msg: "Voto deletado!" });
    });
});

app.get("/api/my-votes/:groupId", authenticateToken, (req, res) => {
    const { groupId } = req.params;
    const userId = req.userId;

    const sql = `
        SELECT v.category_id, n.name as nominee_name
        FROM votes v
        JOIN nominees n ON v.nominee_id = n.id
        WHERE v.user_id = ? AND v.group_id = ?
    `;

    db.query(sql, [userId, groupId], (err, rows) => {
        if (err) return res.status(500).send(err);

        const votesMap = {};
        rows.forEach(row => {
            votesMap[row.category_id] = row.nominee_name;
        });

        res.send(votesMap);
    });
});

app.get("/api/results/:groupId", authenticateToken, (req, res) => {
    const groupId = req.params.groupId;
    const sql = `
        SELECT c.name as category, n.name as nominee, COUNT(v.id) as votes
        FROM categories c
        JOIN nominees n ON n.category_id = c.id
        LEFT JOIN votes v ON v.nominee_id = n.id
        WHERE c.group_id = ?
        GROUP BY n.id
        ORDER BY c.id, votes DESC
    `;
    db.query(sql, [groupId], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send(result);
    });
});

app.listen(3001, () => {
    console.log("Servidor rodando na porta 3001");
});