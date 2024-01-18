const Role=require('../models/role.js');
const Usuario=require('../models/usuario.js');


const esRolValido=async (rol='')=>{
    const existeRol=await Role.findOne({rol});
    if(!existeRol){
        throw new Error(`El rol ${rol} no está registrado en la base de datos`);
    }
}

const ExisteEmail=async(correo='')=>{
    const existeEmail=await Usuario.findOne({correo});
    if (existeEmail){
        throw new Error(`El correo ${correo} ya esta registrado en la base de datos`);
    }
}

const ExisteUsuarioPorId=async(id='')=>{
    const existeUsuario=await Usuario.findById(id);
    if (!existeUsuario){
        throw new Error(`El id: ${id} no existe`);
    }
}

module.exports={
    esRolValido,
    ExisteEmail,
    ExisteUsuarioPorId
}