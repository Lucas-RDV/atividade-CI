const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");

const app = express();
const db = new sqlite3.Database(":memory:"); 

app.use(bodyParser.urlencoded({ extended: true }));

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS funcionarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    funcao TEXT NOT NULL,
    salario REAL NOT NULL
  )`);
});

app.get("/", (req, res) => {
  db.all("SELECT * FROM funcionarios", [], (err, rows) => {
    if (err) return res.status(500).send("Erro no banco");
    res.send(`
      <h1>Cadastro de Funcionários</h1>
      <form method="POST" action="/funcionarios">
        Nome: <input name="nome" /><br/>
        Função: <input name="funcao" /><br/>
        Salário: <input name="salario" type="number" step="0.01"/><br/>
        <button type="submit">Cadastrar</button>
      </form>
      <h2>Lista</h2>
      <ul>
        ${rows.map(f => `<li>${f.nome} - ${f.funcao} - R$${f.salario}</li>`).join("")}
      </ul>
    `);
  });
});

app.post("/funcionarios", (req, res) => {
  const { nome, funcao, salario } = req.body;
  db.run(
    "INSERT INTO funcionarios (nome, funcao, salario) VALUES (?,?,?)",
    [nome, funcao, salario],
    function (err) {
      if (err) return res.status(500).send("Erro ao inserir");
      res.redirect("/");
    }
  );
});

app.post("/api/funcionarios", (req, res) => {
  const { nome, funcao, salario } = req.body;
  db.run(
    "INSERT INTO funcionarios (nome, funcao, salario) VALUES (?,?,?)",
    [nome, funcao, salario],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID, nome, funcao, salario });
    }
  );
});

app.get("/api/funcionarios", (req, res) => {
  db.all("SELECT * FROM funcionarios", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Rodando na porta ${PORT}`));
}
