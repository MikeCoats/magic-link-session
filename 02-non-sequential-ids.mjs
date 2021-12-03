import express from "express";

const app = express();

const resources = [
  { id: "218", message: "Hello, hacker!" },
  { id: "562", message: "Hello, legitimate user!" },
];

app.get("/:id", (req, res) => {
  const matchingResource = resources.find((resource) => {
    return req.params.id === resource.id;
  });

  if (matchingResource === undefined) {
    return res.status(404).send({ path: req.url, message: "Not found" });
  }

  return res.send({
    path: req.url,
    id: matchingResource.id,
    message: matchingResource.message,
  });
});

app.use((req, res, next) => {
  res.status(404).send({ path: req.url, message: "Not found" });
});

app.listen(3002);
