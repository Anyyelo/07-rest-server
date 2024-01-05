const { Router }=require('express');
const {usuariosGet,usuariosPut,usuariosPost,usuariosPath,usuariosDelete}=require("../controllers/usuarios.js");

const router=Router();

 //GET
router.get('/',usuariosGet);
//PUT
router.put('/:id',usuariosPut);
//POST
router.post('/',usuariosPost);
//DELETE
router.delete('/',usuariosDelete);
//PATCH
router.patch('/',usuariosPath);

module.exports = router;