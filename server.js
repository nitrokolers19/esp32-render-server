const { Server } = require("socket.io");
const express = require("express");
const cors = require("cors");
const http = require("http");

const app = express();

app.use(cors());
app.use(express.json());

// crear servidor http
const server = http.createServer(app);

// iniciar socket.io
const io = new Server(server,{
  cors:{
    origin:"*"
  }
});

let ultimosAngulos = {
  a1:0,a2:0,a3:0,
  a4:0,a5:0,a6:0,a7:0
};

// conexión socket
io.on("connection",(socket)=>{

  console.log("Usuario conectado");

  socket.on("setAngles",(data)=>{

    ultimosAngulos = data;

    console.log("Ángulos por socket:",ultimosAngulos);

    // reenviar a todos los clientes
    io.emit("updateAngles",ultimosAngulos);

  });

});

// rutas HTTP (las que ya tenías)
app.post("/setAngles",(req,res)=>{

  ultimosAngulos = req.body;

  console.log("Nuevos ángulos:",ultimosAngulos);

  res.json({status:"ok"});

});

app.get("/getAngles",(req,res)=>{

  res.json(ultimosAngulos);

});

// iniciar servidor
const PORT = process.env.PORT || 3000;

server.listen(PORT,()=>{

  console.log("Servidor corriendo en puerto",PORT);

});