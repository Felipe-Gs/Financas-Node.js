const express = require("express");
const router = express.Router();
const { Client, Pool } = require("pg");
const Z = require("zod");
require("dotenv").config();

const client = new Client({
  host: process.env.HOST,
  port: process.env.PORT,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

client.connect();

router.post("/CriarUsuario", (req, res) => {
  //   const { nome, salario, gastos, entradas } = req.body;
  try {
    const estudanteBody = Z.object({
      nome: Z.string(),
      salario: Z.number(),
      gastos: Z.number(),
      entradas: Z.number(),
    }).required();
    const validData = estudanteBody.parse(req.body);
    const { nome, salario, gastos, entradas } = validData;
    const query = `
        INSERT INTO contabilidade (nome, salario, gastos, entradas)
        VALUES ('${nome}', ${salario}, ${gastos}, ${entradas});
    `;
    client.query(query, (err, result) => {
      if (err) {
        return res.status(404).send({
          message: "erro ao tentar criar usuario",
        });
      } else {
        return res.status(200).send(result.rows);
      }
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/inserirGasto/:id", (req, res) => {
  const id = req.params.id;
  try {
    const gastosBody = Z.object({
      gastos: Z.number(),
    }).required();
    const validData = gastosBody.parse(req.body);
    const { gastos } = validData;
    const query = `UPDATE contabilidade SET gastos = gastos + ${gastos}, saldo = ((salario - gastos) + entradas) WHERE id = ${id} RETURNING saldo
    `;
    client.query(query, (err, result) => {
      if (err) {
        return res.status(404).send({
          message: "erro ao tentar atualizar os dados dos gastos",
        });
      } else {
        const realizarBuscar = `SELECT * FROM contabilidade WHERE id = ${id}`;
        client.query(realizarBuscar, (err, result) => {
          if (err) {
            return res.status(404).send({
              message: "erro nos dados",
            });
          } else if (result.rows.length === 0) {
            return res.status(204).send({
              message: "nao ha usuario com esse id",
            });
          } else {
            return res.status(200).send({
              message: "valor inserido com sucesso",
              usuario: result.rows[0],
            });
          }
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/inserirEntradas/:id", (req, res) => {
  const id = req.params.id;
  try {
    const entradasBody = Z.object({
      entradas: Z.number(),
    }).required();
    const validData = entradasBody.parse(req.body);
    const { entradas } = validData;
    const query = `UPDATE contabilidade SET entradas = entradas + ${entradas}, saldo = ((salario - gastos) + entradas) WHERE id = ${id} RETURNING saldo
    `;

    client.query(query, (err, result) => {
      if (err) {
        return res.status(404).send({
          message: "erro ao tentar inserir entradas",
        });
      } else {
        const realizarBuscar = `SELECT * FROM contabilidade WHERE id = ${id}`;
        client.query(realizarBuscar, (err, result) => {
          if (err) {
            return res.status(404).send({
              message: "erro interno",
            });
          } else if (result.rows.length === 0) {
            return res.status(204).send({
              message: "Nao tem usuario com esse id",
            });
          } else {
            return res.status(200).send({
              message: "entradas inserirdas com sucesso",
              usuario: result.rows[0],
            });
          }
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/verDados", (req, res) => {
  try {
    const query = `SELECT * FROM contabilidade`;
    client.query(query, (err, result) => {
      if (err) {
        return res.status(500).send({
          message: "erro ao tentar buscar dados",
        });
      } else {
        return res.status(200).send({
          dados: result.rows,
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
});

router.delete("/delete/:id", (req, res) => {
  const id = req.params.id;
  try {
    const query = `DELETE FROM contabilidade WHERE id= ${id}`;
    client.query(query, (err, result) => {
      if (err) {
        return res.status(500).send({
          message: err.message,
        });
      } else {
        return res.status(200).send({
          message: "usuario deletado com sucesso",
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/buscarMaior", (req, res) => {
  try {
    let dados = [];
    const query = `SELECT * FROM contabilidade`;
    client.query(query, (err, result) => {
      if (err) {
        return res.status(404).send({
          message: err.message,
        });
      } else {
        return res.status(200).send({
          usuarios: result.rows,
          dados: result.rows.reduce((a, b) => {
            return a.salario > b.salario ? a : b;
          }),
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
});
router.get("/buscarMenor", (req, res) => {
  try {
    let dados = [];
    const query = `SELECT * FROM contabilidade`;
    client.query(query, (err, result) => {
      if (err) {
        return res.status(404).send({
          message: err.message,
        });
      } else {
        return res.status(200).send({
          usuarios: result.rows,
          dados: result.rows.reduce((a, b) => {
            return a.salario < b.salario ? a : b;
          }),
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
});

// created_at TIMESTAMP NOT NULL DEFAULT NOW()
// router.post("/inserirGrana", (req, res) => {
//   const { nome, senha, valorEmDinheiro } = req.body;

//   try {
//   } catch (error) {}
// });

// router.post("/atualizarGasto", (req, res) => {
//   try {
//   } catch (error) {}
// });

// router.get("/verContas", (req, res) => {
//   try {
//     return res.status(200).send({
//       Contas: Conta,
//     });
//   } catch (error) {
//     return res.status(500).send({
//       message: "erro ao acessar a rota",
//     });
//   }
// });

module.exports = router;
