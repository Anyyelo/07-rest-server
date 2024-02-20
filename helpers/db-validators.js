const Role=require('../models/role.js');
const {Usuario,Categoria,Producto}=require('../models');



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

const ExisteCategoriaPorId=async(id='')=>{
    const ExisteCategoria=await Categoria.findById(id);
    if(!ExisteCategoria){
        throw new Error(`El id:${id} no existe en la base de datos`);
    }
}

const ExisteProductoPorId=async(id='')=>{
    const ExisteProducto=await Producto.findById(id);
    if(!ExisteProducto){
        throw new Error(`El id:${id} no existe en la base de datos`);
    }
}

module.exports={
    esRolValido,
    ExisteEmail,
    ExisteUsuarioPorId,
    ExisteCategoriaPorId,
    ExisteProductoPorId
}