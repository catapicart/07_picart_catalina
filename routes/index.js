
const alumnosRoutes = require('./alumnosRoutes');

function routerAPI (app){
    app.use('/alumnos', alumnosRoutes)
}

module.exports = routerAPI;