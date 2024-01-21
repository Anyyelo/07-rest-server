const { Router }=require('express');
const {usuariosGet,usuariosPut,usuariosPost,usuariosPath,usuariosDelete}=require("../controllers/usuarios.js");
const {check}=require('express-validator');

const {esRolValido,ExisteEmail,ExisteUsuarioPorId}=require('../helpers/db-validators.js');
//exportaciones middleware
// const {validarCampos}=require('../middleware/validar-campos');
// const { validarJWT } = require('../middleware/validar-jwt.js');
// const { esAdminRole, tieneRole } = require('../middleware/validar-roles.js');

const {
    validarCampos,
    validarJWT,
    esAdminRole,
    tieneRole
    }=require('../middleware');
const router=Router();


 //GET
router.get('/',usuariosGet);
//PUT
router.put('/:id',[
    check('id','No es un ID válido').isMongoId(),
    check('id').custom(ExisteUsuarioPorId),
    validarCampos
],usuariosPut); 
//POST
router.post('/',[
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('password','La contraseña debe ser más de 6 letras').isLength({min:6}),
    check('correo','El correo no es válido').isEmail(),
    check('correo').custom(ExisteEmail),
    //check('rol','No es un rol valido').isIn(['ADMIN_ROLE','USER_ROLE']),//forma de manejar el rol
    check('rol').custom(esRolValido),
    validarCampos
],usuariosPost);
//DELETE
router.delete('/:id',[
    validarJWT,
    //esAdminRole, // middleware que fuerza a tener admin_role para realizar la acccion
    tieneRole('ADMIN_ROLE','VENTAS_ROLE'), //middleware que permite definir varios roles
    check('id','No es un ID válido').isMongoId(),
    check('id').custom(ExisteUsuarioPorId),
    validarCampos
],usuariosDelete);
//PATCH
router.patch('/',usuariosPath);

module.exports = router;