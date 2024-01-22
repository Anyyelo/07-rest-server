const {response}=require('express');
const bcryptjs=require('bcryptjs');
const Usuario=require('../models/usuario');
const {generarJWT}=require('../helpers/generar-jwt');
const { googleverify } = require('../helpers/google-verify');

const login=async(req,res=response)=>{

    const {correo,password} = req.body;

    try {
    //verificar si el email existe
        const usuario=await Usuario.findOne({correo});
        if (!usuario){
            return res.status(400).json({
                msg: 'Usuario/password no son correctos-correo'
            })
        }
    //verificar si el usuario esta activo
        if (!usuario.estado){
            return res.status(400).json({
                msg: 'Usuario/password no son correctos-estado:false'
            })
        }
    //verificar la contraseña
    
        const validPassword= bcryptjs.compareSync(password.toString(), usuario.password); //pasar el numero a string por la actualizacion de bcrypt
        if(!validPassword){
            return res.status(400).json({
                msg: 'Usuario/password no son correctos-password'
            })
        }
    //generar el JSW    
        
        const token=await generarJWT (usuario.id);

        res.json({
            usuario,
            token
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            
            msg:'Hable con el administrador'
        })
    } 
}

const googleSignIn=async(req,res=response)=>{
    const {id_token}=req.body;
    try {
        const {nombre,img,correo}=await googleverify(id_token);
        //verificar si el correo existe en la base de datos
        let usuario=await Usuario.findOne({correo});
        if(!usuario){
            const data={
                nombre,
                correo,
                password: ':P',
                img,
                google: true,
                rol:'USER_ROLE'
            }
            usuario=new Usuario(data);
            await usuario.save();
        }
        // si el usuario en DB esta en estado:false

        if(!usuario.estado){
            return res.status(401).json({
                msg:'Hable con el administrador, usuario bloqueado'
            })
        }

        //generar el JSW    
        const token=await generarJWT (usuario.id);

        res.json({
            usuario,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok:false,
            msg:'El token no se pudo enviar'
        })
    }
  
}

module.exports ={
    login,
    googleSignIn
}
