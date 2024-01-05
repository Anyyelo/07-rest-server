const express=require('express');
const cors=require('cors');

const app = express();

class server{
    constructor(){
        this.app=express();
        this.port=process.env.PORT || 3000;
        this.usuariosPath='/api/usuarios';

        //middleware
        this.middleware();

        //parseo y lectura del body

        this.app.use(express.json());
        
        // rutas
        this.routes();
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
