const {validarCampos}=require('../middleware/validar-campos');
const { validarJWT } = require('../middleware/validar-jwt.js');
const { esAdminRole, tieneRole } = require('../middleware/validar-roles.js');




module.exports = {
    validarCampos,
    validarJWT,
    esAdminRole,
    tieneRole
}