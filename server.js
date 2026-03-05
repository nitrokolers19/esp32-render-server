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

// guardar salas activas
let salas = {};

// ángulos por defecto
let ultimosAngulos = {
  a1:0,a2:0,a3:0,
  a4:0,a5:0,a6:0,a7:0
};

// generar código aleatorio
function generarCodigo(){
  return Math.random().toString(36).substring(2,7).toUpperCase();
}

// conexión socket
io.on("connection",(socket)=>{

  console.log("Usuario conectado");

  // crear sala
  socket.on("crearSala",()=>{

    const codigo = generarCodigo();

    salas[codigo] = {
      usuarios:1
    };

    socket.join(codigo);

    socket.sala = codigo;

    socket.emit("salaCreada",codigo);

    console.log("Sala creada:",codigo);

  });

  // unirse a sala
  socket.on("unirseSala",(codigo)=>{

    if(salas[codigo]){

      socket.join(codigo);

      socket.sala = codigo;

      salas[codigo].usuarios++;

      socket.emit("unidoSala",codigo);

      io.to(codigo).emit("usuariosSala",salas[codigo].usuarios);

      console.log("Usuario unido a:",codigo);

    }else{

      socket.emit("errorSala","La sala no existe");

    }

  });

  // recibir ángulos
  socket.on("setAngles",(data)=>{

    ultimosAngulos = data;

    console.log("Ángulos por socket:",ultimosAngulos);

    if(socket.sala){

      io.to(socket.sala).emit("updateAngles",ultimosAngulos);

    }else{

      io.emit("updateAngles",ultimosAngulos);

    }

  });

  // desconexión
  socket.on("disconnect",()=>{

    if(socket.sala && salas[socket.sala]){

      salas[socket.sala].usuarios--;

      io.to(socket.sala).emit("usuariosSala",salas[socket.sala].usuarios);

      if(salas[socket.sala].usuarios <= 0){

        delete salas[socket.sala];

        console.log("Sala eliminada:",socket.sala);

      }

    }

    console.log("Usuario desconectado");

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
