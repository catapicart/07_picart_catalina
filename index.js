const express = require('express');
const app = express();
const port = 2023;

const routerAPI = require('./routes/index')

//agregamos el middware de lectura de json
app.use(express.json());

app.get('/', (req, res) => {
    res.send(`<h01>Bienvenido</h01>
    <a href="/alumnos">Lista de alumnos</a>`)
})

routerAPI(app);

app.listen(port, () =>{
    console.log(`Servidor escuchando ${port}`)
})
