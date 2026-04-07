//Dependencias, son bibliotecas que se instalan para que el servidor pueda levantarse correctamente
const express = require('express'); //Facilita la creaciÃ³n de servidores y manejo de rutas
const mongoose = require('mongoose'); //Permite conectarse a la BD de mongoDB y crear las colecciones y realizar consultas
const cors = require('cors'); //Permite la comunicaciÃ³n entre dominios diferentes
const bodyParser = require('body-parser'); //Permite interpretar los datos que vienen en la peticiÃ³n en formto json
require('dotenv').config(); //Se importa el archivo .env para poder utilizar sus variables dentro del cÃ³digo

const app = express(); //Crear una instancia de express
const PORT = process.env.PORT || 3000; //Usar el puerto indicado en .env o si no se indica usar el puerto 3000

/* ImportaciÃ³n de rutas
const empleadoRoutes = require("./routes/empleado.route");
*/

app.use(express.json());//Habilita el manejo de JSON en las peticiones
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());//Habilita el anÃ¡lisis de JSON en las peticiones 
app.use(cors());

require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]); // Para el error querySrv ECONNREFUSED  https://alexbevi.com/blog/2023/11/13/querysrv-errors-when-connecting-to-mongodb-atlas/
mongoose.connect(process.env.MONGODB_URI)
.then(()=> console.log('MongoDB Atlas conectado'))
.catch(error => console.log('OcurriÃ³ un error al conectarse con MongoDB: ', error));

/* Rutas
app.use("/empleados", empleadoRoutes);
*/

app.get('/', (req,res)=> {
    res.send('Servidor en funcionamiento');
});

app.listen(PORT, ()=>{
    console.log('Servidor corriendo en http://localhost:' + PORT);
});