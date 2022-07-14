// Configurações
const express = require("express");
const exphbs = require("express-handlebars");
const app = express();
const pool = require("./db/conn");

// Configurando handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");

// Ler arquivos do body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// CSS/Imagens
app.use(express.static("public"));

// CRUD
app.get("/", (req, res) => {
  const title = "iPets";
  res.render("home", { title });
});
// Inserindo os dados no banco de dados
app.post("/pets/insertpet", (req, res) => {
  const name = req.body.name;
  const race = req.body.race;
  const age = req.body.age;

  const sql = "INSERT INTO pets (??, ??, ??) VALUES (?, ?, ?)";
  const data = ["name", "race", "age", name, race, age];
  pool.query(sql, data, (err) => {
    if (err) {
      return console.log(err);
    }
  });
  res.redirect("/pets");
});

// Lendo os dados
app.get("/pets", (req, res) => {
  const sql = "SELECT * from pets";
  pool.query(sql, (err, data) => {
    if (err) {
      return console.log(err);
    }
    const pets = data;
    res.render("pets", { pets });
  });
});

// Resgatar um dado especifico no banco
app.get("/pets/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM pets WHERE ?? = ?";
  const data = ['id', id]
  pool.query(sql, data, (err, data) => {
    if (err) {
      return console.log(err);
    }
    const pet = data[0];
    res.render("pet", { pet });
  });
});

// Preparando o item para a edição
app.get("/pets/edit/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM pets WHERE ?? = ?";
  const data = ['id', id]

  pool.query(sql, data, (err, data) => {
    if (err) {
      return console.log(err);
    }
    const pet = data[0];
    res.render("editpet", { pet });
  });
});

// Editando os dados
app.post("/pets/updatepet", (req, res) => {
  const id = req.body.id;
  const name = req.body.name;
  const race = req.body.race;
  const age = req.body.age;

  const sql = "UPDATE pets SET ?? = ?, ?? = ?, ?? = ? WHERE ??? = ? ";
  const data = ['name', 'race', 'age', 'id', name, race, age, id];
  pool.query(sql, data, (err) => {
    if (err) {
      console.log(err);
      return;
    }
    res.redirect("/pets");
  });
});

// Remover item
app.post("/pets/remove/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM pets WHERE ?? = ?";
  const data = ['id', id]

  pool.query(sql, data, (err) => {
    if (err) {
      console.log(err);
      return;
    }
    res.redirect("/");
  });
});
// Servidor rodando
app.listen(3000);
