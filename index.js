//express socket.io
const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://daanschenkel.nl",
      "https://www.daanschenkel.nl",
    ],
  },
}); //socket.io
const port = process.env.PORT || 3006;

io.on("connection", (socket) => {
  io.emit("new", socket.id);
  socket.emit("own", socket.id);
  socket.on("disconnect", () => {
    io.emit("left", socket.id);
  });
  socket.on("move", (data) => {
    const x = data.x;
    const y = data.y;
    const screenX = data.screenX;
    const screenY = data.screenY;
    const page = data.page;
    if (!x || !y || !screenX || !screenY || !page) return;

    //to everyone except sender
    socket.broadcast.emit("move", {
      id: socket.id,
      x,
      y,
      screenX,
      screenY,
      page,
    });
  });
});

server.listen(port, () => {
  console.log(`Server listening at port ${port}`);
});
