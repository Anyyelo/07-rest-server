const express=require('express');
const cors=require('cors');
const { dbConnection }=require('../database/config.js');

const app = express();

class server{
    constructor(){
        this.app=express();
        this.port=process.env.PORT;
        this.usuariosPath='/api/usuarios';

        //conectar a base de datos
        this.conectarDB();

        //middleware
        this.middleware();

        //parseo y lectura del body

        this.app.use(express.json());
        
        // rutas
        this.routes();
    }

    async conectarDB(){
        await dbConnection();
    }

    middleware(){
        //CORS
        this.app.use(cors());
        //DIRECTORIO PUBLICO
        this.app.use(express.static('public'))
    }

    routes(){
       this.app.use(this.usuariosPath,require('../routes/usuarios'));
    }

    listen(){
        this.app.listen(this.port);
    }
}

module.exports = server