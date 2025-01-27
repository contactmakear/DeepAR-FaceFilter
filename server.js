const express = require("express");
const path = require("path");
const router = require('./router')

const app = express();

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, "public")));

// Serve DeepAR resources
app.use("/deepar-resources",
  express.static(path.join(__dirname, "node_modules/deepar"), {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith(".wasm")) {
        res.setHeader("Content-Type", "application/wasm");
      }
    },
  })
);

app.use('/', router)

// Fallback for SPA routing (optional)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "404.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

module.exports = app