const express = require('express');
const app = express();
const PORT = 3000;
app.get('/', (req, res) => {
 const currentTime = new Date().toLocaleTimeString();
 const currentDate = new Date().toLocaleDateString();
 const html = `
 <html>
 <head><title>Página SSR</title></head>
 <body>
 <h1>Server Side Rendering</h1>
 <p>Hola, soy <strong>[CRISTHIAN LEANDRO MERA ZAMBRANO]</strong></p>
 <p>Hoy es <strong>${currentDate}</strong></p>
 <p>La hora actual es: <strong>${currentTime}</strong></p>
 </body>
 </html>
 `;
 res.send(html);
});
app.listen(PORT, () => {
 console.log(`Servidor corriendo en http://localhost:${PORT}`);
});