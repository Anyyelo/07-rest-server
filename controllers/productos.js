const { response,request }=require('express');
const {Producto}=require('../models');

//obtener producto-paginado-total-populate-get
const obtenerProductos=async(req,res=response)=>{
    const query = {estado:true};
    const {limit=5,desde=0}=req.query;
    try {
        const [total,productos]=await Promise.all([
            Producto.countDocuments(query),
            Producto.find(query)
                .populate('usuario','nombre')
                .populate('categoria','nombre')
                .skip(desde)
                .limit(limit)
        ]); 
        res.json({
            total,
            productos
        });
    } catch (error) {
        res.status(500).json({
            msg:'Error al obtener los productos'
        })
    }
   
}

//obtenerproducto-populate-get
const obtenerProducto=async(req,res=response)=>{
    const {id}=req.params;
    try {
        const producto= await Producto.findById({_id:id})
            //.populate('usuario','nombre')
            //.populate('categoria','nombre');
        
        res.json({producto});
    } catch (error) {
        res.status(500).json({
            msg:'Error al obtener el producto'
        })
    }
}
//crear producto-post
const crearProducto=async (req,res=response)=>{
    const {estado,usuario,...body}=req.body;

    try {
        const productoDB= await Producto.findOne({nombre:body.nombre});
        if (productoDB){
            return res.status(400).json({
                msg:`El producto ${productoDB.nombre}, ya existe`
            })
        }

        //generar data a guardar

        const data={
            ...body,
            nombre:body.nombre.toUpperCase(),
            usuario: req.usuario._id
        }

        //crea categoria a partir del modelo
        const producto = new Producto(data);

        //guardar en DB

        await producto.save();

        res.status(201).json(producto);

    } catch (error) {
        res.status(500).json({
            msg:'Error al crear el producto'
        })
    }

}
//actualizar producto-put

const actualizarProducto=async(req,res=response)=>{
    const {id}=req.params;
    const {estado,usuario,...resto}=req.body;

    resto.nombre=resto.nombre.toUpperCase();//mantener el nombre actualizado en mayusculas
    resto.usuario=req.usuario._id;//nombre del usuario que actualizo

    try {
        const producto=await Producto.findByIdAndUpdate(id,resto,{new:true}); //update de datos
        res.json({
            producto
        });
    } catch (error) {
        res.status(500).json({
            msg:'Error actualizando producto'
        })
    }
}
//borrar producto-estado:false-delate
const borrarProducto=async(req=request,res=response)=>{
    const {id}=req.params;
    try {
        const productoborrado= await Producto.findByIdAndUpdate(id,{estado:false},{new:true});

        res.json({
            productoborrado
        });
    } catch (error) {
        res.status(500).json({
            msg:'Error eliminando producto'
        })
    }
}

module.exports={
    crearProducto,
    obtenerProductos,
    obtenerProducto,    
    actualizarProducto,
    borrarProducto
}