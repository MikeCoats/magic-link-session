import express from "express";
const { createDecipheriv } = await import("crypto");

const key = Buffer.from(
  "7F9DF30A3C4DF8E54FE3BB0FAD250305A1C78C38F890FDA8687E899EFC08688F",
  "hex"
);
const iv = Buffer.from("43C0EE4F2C51403FD6470DDFA4BD8DE3", "hex");

const app = express();

const resources = [
  { id: "218", message: "Hello, hacker!" },
  { id: "562", message: "Hello, legitimate user!" },
];

app.get("/:encryptedId", (req, res) => {
  if (req.params.encryptedId === undefined) {
    return res
      .status(403)
      .send({ path: req.url, message: "No encryptedId supplied." });
  }

  const aesDecipher = createDecipheriv("aes-256-cbc", key, iv);

  aesDecipher.update(req.params.encryptedId, "base64");
  const decryptedId = aesDecipher.final("utf-8");

  const matchingResource = resources.find((resource) => {
    return `${resource.id}\n` === decryptedId;
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

app.listen(3004);
