const {response}=require('express');
const { Usuario, Categoria, Producto } = require('../models');
const { esAdminRole } = require('../middleware');
const { ObjectId } = require('mongoose').Types;

const coleccionespermitidas=[
    'usuarios',
    'categorias',
    'productos',
    'roles'
]

const buscarUsuarios=async(termino='',res=response)=>{

    const esMongoID=ObjectId.isValid(termino);

    if(esMongoID){
        const usuario= await Usuario.findById(termino);
        res.json({
            results:(usuario) ? [usuario] : []
        });
    }

    const regex=new RegExp(termino,'i');//busqueda insensible

    const usuarios=await Usuario.find({
        $or:[{nombre:regex},{correo:regex}],
        $and:[{estado:true}]//debe estar en estado activo
    });

    res.json({
        results:usuarios
    });

}

const buscarCategorias=async(termino='',res=response)=>{
    const esMongoID=ObjectId.isValid(termino);

    try {
        if(esMongoID){
            const categoria=await Categoria.findById(termino);
            res.json({
                results:(categoria) ? [categoria]:[]
            });
        }
    
        const regex=new RegExp(termino,'i');
        const categorias=await Categoria.find({nombre:regex,estado:true});
    
        res.json({
            results: (categorias) ? [categorias] : []
        })
    } catch (error) {
        return res.status(400).json({
            msg:'Error al buscar la categoria'
        });
    }
}

const buscarProductos=async(termino='',res=response)=>{
    const esMongoID=ObjectId.isValid(termino);

    if(esMongoID){
        const producto=await Producto.findById(termino)
                            .populate('categoria','nombre');
        res.json({
            results: (producto) ? [producto] : []
        });
    }
    const regex=new RegExp(termino,'i');

    const productos=await Producto.find({nombre:regex,estado:true})
                        .populate('categoria','nombre');

    res.json({
        results: (productos) ? [productos] : []
    })

} 
const buscar =(req,res=response)=>{
    const { coleccion,termino}=req.params;

    if(!coleccionespermitidas.includes(coleccion)){
        res.status(400).json({
            msg:`Las colecciones permitidas son: ${coleccionespermitidas}`
        })
    }
    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino,res);
        break;
        case 'categorias':
            buscarCategorias(termino,res);        
        break;
        case 'productos':
            buscarProductos(termino,res);
        break;
    
        default:
            res.status(500).json({
                msg:'Se me olvido hacer la busqueda'
            });
    }
};


module.exports = {
    buscar
}