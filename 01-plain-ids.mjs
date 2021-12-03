import express from "express";

const app = express();

app.get("/1", (req, res) => {
  res.send({ path: req.url, message: "Hello, hacker!" });
});

app.get("/2", (req, res) => {
  res.send({ path: req.url, message: "Hello, legitimate user!" });
});

app.use((req, res, next) => {
  res.status(404).send({ path: req.url, message: "Not found" });
});

app.listen(3001);
