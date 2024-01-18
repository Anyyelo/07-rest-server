const { response,request }=require('express');
const Usuario=require('../models/usuario');
const bcryptjs=require('bcryptjs');



const usuariosGet=async(req, res) => {
    //const {q,nombre="no name",apikey}=req.query;
    const {limit=5,desde=0}=req.query;
    const query = {estado:true};
    //cada promesa se toma su propio tiempo para ejecutarse
    //const usuarios=await Usuario.find(query)
    //    .skip(desde)
    //    .limit(limit);
    //const total=await Usuario.countDocuments(query);

    //ejecutar varias promesas al tiempo

    const [total,usuarios]=await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(limit)
            .limit(limit)
    ]);

    res.json({
        total,
        usuarios
    });
}

const usuariosPost=async(req, res) => {
    //validacion tipo de correo correcto
    

    const {nombre,correo,password,rol}=req.body;
    const usuario=new Usuario({nombre,correo,password,rol});

    // verificar si el correo existe
    //encriptar contraseña
    const salt=bcryptjs.genSaltSync(10);
    usuario.password=bcryptjs.hashSync(password,salt);
    //guardar en base de datos

    await usuario.save();

    res.json({
        msg: "peticion post-controlador",
        usuario
    });
}

const usuariosPut=async(req, res) => {
    const id=req.params.id;
    const {_id,password,google,rol,...resto}=req.body;

    //validar contra la base de datos
    if(password){
        const salt=bcryptjs.genSaltSync(10);
        resto.password=bcryptjs.hashSync(password,salt);
    }

    const usuario=await Usuario.findByIdAndUpdate(id,resto); //update de datos
    res.json({
        msg: "peticion put-controlador",
        usuario
    });
}

const usuariosPath=(req, res) => {
    res.json({
        msg: "peticion path-controlador"
    });
}

const usuariosDelete=async (req, res) => {
    const {id}=req.params;

    //Eliminar fisicamente de la base de datos
    //const usuario= await Usuario.findByIdAndDelete(id);

    //Actualizar estado en la base de datos

    const usuario= await Usuario.findByIdAndUpdate(id,{estado:false})

    res.json({
        usuario
    });
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPath,
    usuariosDelete
}