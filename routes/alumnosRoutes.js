const express = require('express');
const fs = require('fs').promises;
const pathJSON = './data/alumnos.json'
const router = express();


//devuelve listado de alumnos completo 
router.get('/', async (req, res)=> {

    try{
        const data = JSON.parse( await fs.readFile(pathJSON, 'utf-8'));
        let listado = '';
        data.forEach(a =>{
            listado += `${a.nombre}  <a href='/alumnos/${a.legajo}'>Ver detalle</a>`
            
        })
        if(listado != ''){
            res.send('<h1>Lista de alumnos</h1>' + listado)
        }else{
            res.send('<h1>No se encontraron alumnos</h1>')
        }
    
        } catch(err){
            console.log(err)
            res.send('Error en el servidor')
        }   
})

//devuelve la informacion de un alumno segun su numero de
router.get('/:legajo', async (req, res)=> {
    try{

        const { legajo } = req.params
        const data = JSON.parse( await fs.readFile(pathJSON, 'utf-8'));
        const alumno = data.find(a => a.legajo == legajo)
        
        if(alumno){
            res.status(200).json({
                msg: 'Informacion del alumno',
                data: alumno
            })
        }else{
            res.status(404).json({
                msg: 'No hay alumnos que coincidan con ese legajo',
                data: {}
            })
        }
        } catch(err){
            res.send('Error en el servidor')
        }   
})

//agregar alumno
router.post('/', async (req, res)=>{

    try{
        let datosCorrectos = null;
        const data = JSON.parse( await fs.readFile(pathJSON, 'utf-8'));
        const alumnoNuevo = req.body;
        console.log(alumnoNuevo)

        const alumno = data.find(a => a.legajo == alumnoNuevo.legajo);

        //console.log(alumno)

        if(alumno){
            datosCorrectos = false;
            res.send('Ese numero de legajo ya esta registrado')
        }else{

            if(alumnoNuevo.legajo == '' || isNaN(alumnoNuevo.legajo)){
                console.log(alumnoNuevo.legajo)
                res.send('El numero de legajo debe ser un numero')
                datosCorrectos = false;
            }
            else if(alumnoNuevo.nombre == '' || !isNaN(alumnoNuevo.nombre)){
                res.send('El nombre no puede estar vacio ni ser un numero')
                datosCorrectos = false;
            }else if(alumnoNuevo.apellido == '' || !isNaN(alumnoNuevo.apellido)){
                res.send('El apellido no puede estar vacio ni ser un numero');
                datosCorrectos = false;
            }else if(alumnoNuevo.inscripcion == '' || isNaN(alumnoNuevo.inscripcion)){
                res.send('El anio de ingreso no puede estar vacio y tiene que ser un anio escrito solo con numeros')
            }
            else{
                datosCorrectos = true;
        }
        }

        if(datosCorrectos){
            data.push(alumnoNuevo);
            await fs.writeFile(pathJSON, JSON.stringify(data) )  

            res.json({
            msg: 'Listado actualizado',
            data: {}})
        }
        
        } catch(err){
            res.json({
                msg: 'Error en el servidor'})
                console.log(err)
        }   
})


//actualizar detalles de un alumno
router.put('/:legajo', async (req, res)=>{
    try{
            const data = JSON.parse( await fs.readFile(pathJSON, 'utf-8'));
            const alumnoUpdate = req.body;
            const { legajo } = req.params

            if(alumnoUpdate.nombre == '' || !isNaN(alumnoUpdate.nombre)){
                res.send('El nombre no puede estar vacio ni ser un numero')
                datosCorrectos = false;

            }else if(alumnoUpdate.apellido == '' || !isNaN(alumnoUpdate.apellido)){
                res.send('El apellido no puede estar vacio ni ser un numero');
                datosCorrectos = false;

            }else if(alumnoUpdate.inscripcion == '' || isNaN(alumnoUpdate.inscripcion)){
                res.send('El anio de ingreso no puede estar vacio y tiene que ser un anio escrito solo con numeros');
                datosCorrectos = false;

            }else{
                datosCorrectos = true;}

            if(datosCorrectos){
                data.forEach(element =>{
                if(element.legajo == legajo ){
                    element.legajo == legajo;
                    element.nombre = alumnoUpdate.nombre;
                    element.apellido = alumnoUpdate.apellido;
                    element.inscripcion = alumnoUpdate.inscripcion;
                }
            })

            await fs.writeFile(pathJSON, JSON.stringify(data) )

            res.json({
                msg: 'Listado actualizado',
                data: {}})
            }
            
        } catch(err){
            res.json({
            msg: 'Error en el servidor'})
        }   
})

router.delete('/:legajo', async (req, res)=>{
    try{
            const data = JSON.parse( await fs.readFile(pathJSON, 'utf-8'));
        
            const { legajo } = req.params
            
            for(let[i, alumno] of data.entries()){
                if(alumno.legajo == legajo){
                    data.splice(i, 1);
                }
            }
            await fs.writeFile(pathJSON, JSON.stringify(data) )

            res.json({
                msg: 'Informacion del alumno eliminada',
                data: {}})

        } catch(err){
            console.log(err)
            res.json({
            msg: 'Error en el servidor'})
        }   
})


//Exportar el objeto router
module.exports = router;