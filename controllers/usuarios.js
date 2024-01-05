const { response }=require('express');


const usuariosGet=(req, res) => {
    const {q,nombre="no name",apikey}=req.query;
    res.json({
        msg: "peticion get-controlador",
        q,
        nombre,
        apikey
    });
}

const usuariosPost=(req, res) => {
    const body=req.body;
    res.json({
        msg: "peticion post-controlador",
        body
    });
}

const usuariosPut=(req, res) => {
    const id=req.params.id;
    res.json({
        msg: "peticion put-controlador",
        id
    });
}

const usuariosPath=(req, res) => {
    res.json({
        msg: "peticion path-controlador"
    });
}

const usuariosDelete=(req, res) => {
    res.json({
        msg: "peticion delete-controlador"
    });
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPath,
    usuariosDelete
}