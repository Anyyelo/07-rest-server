const { response, request } = require('express');
const jwt=require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT=async (req=request,res=response,next)=>{
    const token=req.header('x-token');

    if(!token){
        return res.status(401).json({
            msg:'No hay token en la petición'
        })
    }

    try {
        const {uid}=jwt.verify(token,process.env.SECRETORPRIVATEKEY);
        //Leer el usuario a su correspondiente uid
        const usuario=await Usuario.findById(uid);

        if(!usuario){
            return res.status(401).json({
                msg: 'El usuario no existe en la base de datos'
            })
        }

        //verificar si el usuario esta activo en la base de datos
        if(!usuario.estado){
            return res.status(401).json({
                msg:'Token no válido-estado del usuario en: false'
            })
        }

        req.usuario=usuario;
        next()
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg:'Token no valido'
        })
    }

};

module.exports= {
    validarJWT
}