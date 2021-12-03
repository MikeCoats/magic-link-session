import express from "express";
const { createHash } = await import("crypto");

const app = express();

const resources = [
  { id: "218", message: "Hello, hacker!" },
  { id: "562", message: "Hello, legitimate user!" },
];

app.get("/:sha1", (req, res) => {
  if (req.params.sha1 === undefined) {
    return res
      .status(403)
      .send({ path: req.url, message: "No sha1 supplied." });
  }

  const matchingResource = resources.find((resource) => {
    const sha1 = createHash("sha1");
    sha1.update(`${resource.id}\n`);
    const computedSha1 = sha1.copy().digest("hex");
    return req.params.sha1 === computedSha1;
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

app.listen(3003);
