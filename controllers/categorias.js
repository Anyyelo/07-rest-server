const { response,request }=require('express');
const {Categoria}=require('../models');

//obtener categoria-paginado-total-populate-get
const obtenerCategorias=async(req,res=response)=>{
    const query = {estado:true};
    const {limit=5,desde=0}=req.query;
    const [total,categorias]=await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .populate('usuario','nombre')
            .skip(desde)
            .limit(limit)
    ]);
    res.json({
        total,
        categorias
    });
}

//obtenercategoria-populate-get
const obtenerCategoria=async(req,res=response)=>{
    const {id}=req.params;
    const categoria=await Categoria.findById(id).populate('usuario','nombre')
    res.json({
        categoria
    });
}
//crear categoria-post
const crearCategoria=async (req,res=response)=>{
    const nombre=req.body.nombre.toUpperCase();
    const categoriaDB= await Categoria.findOne({nombre});
    if (categoriaDB){
        return res.status(400).json({
            msg:`La categoria ${categoriaDB.nombre}, ya existe`
        })
    }

    //generar data a guardar

    const data={
        nombre,
        usuario: req.usuario._id
    }

    //crea categoria a partir del modelo
    const categoria = new Categoria(data);

    //guardar en DB

    await categoria.save();

    res.status(201).json(categoria);


}

//actualizar categoria-put
const actualizarCategoria=async(req,res=response)=>{
    const {id}=req.params;
    const {estado,usuario,...resto}=req.body;
    
    resto.nombre=resto.nombre.toUpperCase();//mantener el nombre actualizado en mayusculas
    //resto.usuario=req.usuario._id;//nombre del usuario que actualizo

    const categoria=await Categoria.findByIdAndUpdate(id,resto,{new:true}); //update de datos
    res.json({
        categoria
    });
}
//borrar categoria-estado:false-delate
const borrarCategoria=async(req=request,res=response)=>{
    const {id}=req.params;
    const categoriaborrada= await Categoria.findByIdAndUpdate(id,{estado:false},{new:true});

    res.json({
        categoriaborrada
    });
}

module.exports={
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}