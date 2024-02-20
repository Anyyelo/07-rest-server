const { Router }=require('express');
const {check}=require('express-validator');
const {validarJWT, validarCampos, esAdminRole}=require('../middleware');
const { ExisteProductoPorId, ExisteCategoriaPorId } = require('../helpers/db-validators');
const { obtenerProductos, obtenerProducto, crearProducto, actualizarProducto, borrarProducto } = require('../controllers/productos');

const router=Router();

//obtener todos los productos - publico
router.get('/',obtenerProductos)

// obtener un producto por id - publico
router.get('/:id',[
    check('id','No es un ID válido').isMongoId(),
    check('id').custom(ExisteProductoPorId),
    validarCampos
],obtenerProducto)

//Crear producto - privado - cualquier persona con un token valido
router.post('/',[
    validarJWT,
    check('nombre','El nombre del producto es obligatorio').not().isEmpty(),
    check('categoria','La categoria del producto es obligatoria').not().isEmpty(),
    //check('precio','El precio del producto es obligatorio').not().isEmpty(),
    //check('descripcion','La descripcion del producto es obligatorio').not().isEmpty(),
    check('categoria','No es un id de Mongo').isMongoId(),
    check('categoria').custom(ExisteCategoriaPorId),
    validarCampos
],crearProducto) 

//Actualizar - privado - cualquier con token valido
router.put('/:id',[
    validarJWT,
    check('id','No es un ID válido').isMongoId(),
    check('id').custom(ExisteProductoPorId),
    validarCampos
],actualizarProducto)

//Borrar producto - Admin
router.delete('/:id',[
    validarJWT,
    check('id','No es un ID válido').isMongoId(),
    check('id').custom(ExisteProductoPorId),
    validarCampos
],borrarProducto)

module.exports = router;