const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors()); //habilita CORS para todas las rutas
app.use(express.json());

let ultimosAngulos = {
  a1: 0, a2: 0, a3: 0,
  a4: 0, a5: 0, a6: 0, a7: 0
};

app.post("/setAngles", (req, res) => {
  ultimosAngulos = req.body;
  console.log("Nuevos ángulos:", ultimosAngulos);
  res.json({ status: "ok" });
});

app.get("/getAngles", (req, res) => {
  res.json(ultimosAngulos);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto", PORT);
});