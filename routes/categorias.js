const { Router }=require('express');
const {check}=require('express-validator');
const {validarJWT, validarCampos, esAdminRole}=require('../middleware');
const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require('../controllers/categorias');
const { ExisteCategoriaPorId } = require('../helpers/db-validators');

const router=Router();

//obtener todas las categorias - publico
router.get('/',obtenerCategorias)

// obtener una categoria por id - publico
router.get('/:id',[
    check('id','No es un ID válido').isMongoId(),
    check('id').custom(ExisteCategoriaPorId),
    validarCampos
],obtenerCategoria)

//Crear categoria - privado - cauqluier persona con un token valido
router.post('/',[
    validarJWT,
    check('nombre','El nombre de la categoria es obligatorio').not().isEmpty(),
    validarCampos
],crearCategoria) 

//Actualizar - privado - cualquier con token valido
router.put('/:id',[
    check('id','No es un ID válido').isMongoId(),
    check('id').custom(ExisteCategoriaPorId),
    check('nombre','El nombre de la categoria es obligatorio').not().isEmpty(),
    validarCampos
],actualizarCategoria)

//Borrar categoria - Admin
router.delete('/:id',[
    esAdminRole,
    check('id','No es un ID válido').isMongoId(),
    check('id').custom(ExisteCategoriaPorId),
    validarCampos
],borrarCategoria)

module.exports = router;