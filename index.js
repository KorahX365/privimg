const express = require("express");
const multer = require("multer");
const fs = require("fs");
const crypto = require("crypto");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));  // Aseguramos que Express sirva las imágenes

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

const posts = {};
const seenPosts = {};

app.post("/create", upload.single("file"), (req, res) => {
  const id = crypto.randomBytes(8).toString("hex");
  posts[id] = {
    text: req.body.text,
    image: req.file ? `/uploads/${req.file.filename}` : null,  // Usamos la ruta correcta para la imagen
  };
  res.json({ link: `/post/${id}` });
});

app.get("/post/:id", (req, res) => {
  const id = req.params.id;
  const ip = req.ip;
  const device = req.headers["user-agent"];

  if (!posts[id]) {
    return res.status(404).send("Post no encontrado");
  }

  if (seenPosts[ip + device]?.includes(id)) {
    return res.status(403).send("Ya has visto este post");
  }

  seenPosts[ip + device] = [...(seenPosts[ip + device] || []), id];
  res.json(posts[id]);
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
