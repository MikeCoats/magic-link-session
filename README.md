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

---

## Non-sequential IDs - Basic Server

```js
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
    path: req.url, id: matchingResource.id, message: matchingResource.message
  });
});
```

---

## Non-sequential IDs - Running and Testing

```sh
node 02-non-sequential-ids.mjs
```

```sh
curl http://localhost:3002/562

# {"path":"/562","id":"562","message":"Hello, legitimate user!"}
```

---

## Non-sequential IDs - Hacking

```sh
curl http://localhost:3002/561

# {"path":"/561","message":"Not found"}
```

```sh
for ((i=1;i<=999;i++)); do curl http://localhost:3002/$i | grep -v 'Not found'; done

# {"path":"/218","id":"218","message":"Hello, hacker!"}
# {"path":"/562","id":"562","message":"Hello, legitimate user!"}
```
