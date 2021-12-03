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

---

## Hashing IDs

```sh
echo 562 | sha1sum

# 8e90f0d493fe29e1b0d57c2bd5fb19876f6ee8be *-
```

---

## Hashing IDs - Basic Server

```js
app.get("/:sha1", (req, res) => {
  if (req.params.sha1 === undefined) {
    return res.status(403).send({ path: req.url, message: "No sha1 supplied." });
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
    path: req.url, id: matchingResource.id, message: matchingResource.message
  });
});
```

---

## Hashing IDs - Running and Testing

```sh
node 03-hashing-ids.mjs
```

```sh
curl http://localhost:3003/8e90f0d493fe29e1b0d57c2bd5fb19876f6ee8be

# {"path":"/8e90f0d493fe29e1b0d57c2bd5fb19876f6ee8be","id":"562","message":"Hello, legitimate user!"}
```

---

## Hashing IDs - Hacking

```diff
- 8e90f0d493fe29e1b0d57c2bd5fb19876f6ee8be
+ 8e90f0d493fe29e1b0d57c2bd5fb19876f6ee8bd
```

```sh
curl http://localhost:3003/8e90f0d493fe29e1b0d57c2bd5fb19876f6ee8bd

# {"path":"/8e90f0d493fe29e1b0d57c2bd5fb19876f6ee8bd","message":"Not found"}
```

```sh
for ((i=1;i<=999;i++)); do curl http://localhost:3003/`echo $i | sha1sum` | grep -v 'Not found'; done

# {"path":"/7c07ee609ca19ab090f2432ed98fc34f29acc981","id":"218","message":"Hello, hacker!"}
# {"path":"/8e90f0d493fe29e1b0d57c2bd5fb19876f6ee8be","id":"562","message":"Hello, legitimate user!"}
```

---

## Symmetric Key Encryption - Encrypting

```sh
# Generate a Key and IV from a shared secret password

openssl enc -nosalt -aes-256-cbc -k our_shared_secret_password -P

# ...
# key=7F9DF30A3C4DF8E54FE3BB0FAD250305A1C78C38F890FDA8687E899EFC08688F
# iv =43C0EE4F2C51403FD6470DDFA4BD8DE3
```

```sh
# Use the Key and IV to encrypt an ID

echo 562 | openssl enc -nosalt -aes-256-cbc -base64 \
    -K 7F9DF30A3C4DF8E54FE3BB0FAD250305A1C78C38F890FDA8687E899EFC08688F \
    -iv 43C0EE4F2C51403FD6470DDFA4BD8DE3

# AR/IiI8hKmP4eJSac/K8TA==
```

---

## Symmetric Key Encryption - Decrypting

```sh
# Use the Key and IV to decrypt an ID

echo AR/IiI8hKmP4eJSac/K8TA== | openssl enc -d -nosalt -aes-256-cbc -base64 \
    -K 7F9DF30A3C4DF8E54FE3BB0FAD250305A1C78C38F890FDA8687E899EFC08688F \
    -iv 43C0EE4F2C51403FD6470DDFA4BD8DE3

# 562
```

---

## Symmetric Key Encryption - Running and Testing

```sh
node 04-symmetric-encrypted-ids.mjs
```

```sh
curl http://localhost:3004/AR%2FIiI8hKmP4eJSac%2FK8TA%3D%3D

# {"path":"/AR%2FIiI8hKmP4eJSac%2FK8TA%3D%3D","id":"562","message":"Hello, legitimate user!"}
```

---

## Symmetric Key Encryption - Hacking

```diff
- AR/IiI8hKmP4eJSac/K8TA==
+ AR/IiI8hKmP4eJSac/K8T1==
```

```sh
curl http://localhost:3004/AR%2FIiI8hKmP4eJSac%2FK8T1%3D%3D

# ...
# >Error: error:06065064:digital envelope routines:EVP_DecryptFinal_ex:bad decrypt
# ...
```
