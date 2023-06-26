const express = require('express');
const app = express();
const port = 3000; // choose any available port number

app.use(express.static('www'));

app.listen(port, () => {
  console.log(`Development server running at http://localhost:${port}`);
});
