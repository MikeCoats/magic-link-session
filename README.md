# Magic Links

## From Sequential IDs to JWTs

```sh
# Run this `README.md` file as a presentation.

npx @marp-team/marp-cli --server ./

# Then open http://localhost:8080/README.md in your web browser.
```

## License

Unless stated otherwise, the codebase is released under the [MIT License](LICENSE.txt). The documentation is available under the terms of the [Open Government Licence, Version 3](LICENSE-OGL.txt).

---

## Plain IDs - Basic Server

```js
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
```

---

## Plain IDs - Running and Testing

```sh
node 01-plain-ids.mjs
```

```sh
curl http://localhost:3001/2

# {"path":"/2","message":"Hello, legitimate user!"}
```

---

## Plain IDs - Hacking

```sh
curl http://localhost:3001/1

# {"path":"/1","message":"Hello, hacker!"}
```
