import express from "express";
import handlebars from "express-handlebars";
import path from "path";
import { Server } from "socket.io";
import __dirname from "./utils.js";
import viewsRouter from "./routes/views.router.js";
import http from "http";

const app = express();
const PORT = 8080;
/* const httpServer = app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
 */
const httpServer = http.createServer(app);
httpServer.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

//servidor de sockets
const io = new Server(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Configuracion de handlebars
//se le dice al engine que la extension para handlebars sera hbs
app.engine(".hbs", handlebars.engine({ extname: ".hbs" }));
//se le dice al engine para que busce los archivos con la extension hbs
app.set("view engine", ".hbs");
//se le dice donde se encuentra el folder de las vistas
app.set("views", path.resolve(__dirname + "/views"));
//se le dice que use acrhivos estaticos y donde encontrarlos
app.use(express.static(__dirname + "/public"));
//se le dice que use el views router
app.use("/", viewsRouter);

const users = {};

io.on("connection", (socket) => {
  console.log("un usuario se ha conectado");
  socket.on("newUser", (userName) => {
    users[socket.id] = userName;
    io.emit("userConnected", userName);
  });

  socket.on("chatMessage", (message) => {
    const userName = users[socket.id];
    io.emit("message", { userName, message });
  });

  socket.on("disconnect", () => {
    const userName = users[socket.id];
    delete users[socket.id];
    io.emit("userDisconnected", userName);
  });
});
