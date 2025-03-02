const express = require('express');
const { exec } = require('child_process');

const app = express();
const port = 5000;

app.get('/run-script', (req, res) => {
  exec('python3 your_script.py', (error, stdout, stderr) => {
    if (error) {
      res.status(500).send({ error: `exec error: ${error}` });
      return;
    }
    if (stderr) {
      res.status(500).send({ error: `stderr: ${stderr}` });
      return;
    }
    res.json({ output: stdout });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
