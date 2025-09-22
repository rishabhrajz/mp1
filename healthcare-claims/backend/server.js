const express = require("express");
const multer = require("multer");
const crypto = require("crypto");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const upload = multer({ dest: "backend/uploads/" });

// DID mock
app.post("/did/create", (req, res) => {
  res.json({ did: "did:ethr:" + crypto.randomBytes(8).toString("hex") });
});

// VC mock
app.post("/vc/verify", (req, res) => {
  const vc = req.body;
  if (vc.issuer && vc.subject) {
    res.json({ valid: true });
  } else {
    res.json({ valid: false });
  }
});

// File upload
app.post("/upload", upload.single("file"), (req, res) => {
  const fileBuffer = require("fs").readFileSync(req.file.path);
  const hash = crypto.createHash("sha256").update(fileBuffer).digest("hex");
  res.json({ file: req.file.path, hash });
});

app.listen(5000, () => console.log("Backend running on http://localhost:5000"));