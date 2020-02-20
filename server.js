// Configurando o servidor
const express = require("express");
const server = express();

//Configurar o servidor para apresentar arquivos estaticos

server.use(express.static("public"));

//habilitar body do formulário
server.use(express.urlencoded({ extended: true }));

// Configurar a conexão com o banco de dados
const Pool = require("pg").Pool;
const db = new Pool({
  user: "postgres",
  password: "docker",
  host: "localhost",
  port: 5432,
  database: "Doe"
});

// Configurando a template engine
const nunjucks = require("nunjucks");
nunjucks.configure("./", {
  express: server,
  noCache: true
});

//configurar a apresentação da página
server.get("/", (req, res) => {
  db.query("SELECT * FROM donors", function(err, result) {
    if (err) return res.send("Erro no banco de dados");

    const donors = result.rows;
    return res.render("index.html", { donors });
  });
});

server.post("/", (req, res) => {
  //pegar dados do form
  const { name, blood, email } = req.body;

  if (name == "" || email == "" || blood == "") {
    return res.send("Todos os campos são obrigatórios");
  }

  //coloca valores dentro do banco de dados
  const query = `
  INSERT INTO donors ("name", "email", "blood")
  VALUES ($1, $2, $3)`;

  const values = [name, email, blood];

  db.query(query, values, function(err) {
    //Fluxo de Erro
    if (err) return res.send("erro no banco de dados.");

    //Fluxo ideal
    return res.redirect("/");
  });
});

server.listen(3000);
