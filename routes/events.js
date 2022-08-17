/**
 * Event Routes
 * /api/events
 */

const { Router } = require('express');
const { check } = require('express-validator');

const { isDate } = require('../helpers/isDate');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt')
const { obtenerEventos, crearEvento, actualizarEvento, eliminarEvento } = require('../controllers/events');

const router = Router();

// Todas tienen que pasar por la validacion del JWT
router.use(validarJWT);

// Obtener evento
router.get('/', obtenerEventos);

// Crear eventos
router.post(
    '/',
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'Fecha de inicio es obligatoria').custom(isDate),
        check('end', 'La fecha de finalización es obligatoria').custom(isDate),
        validarCampos
    ],
    crearEvento);

// Actualizar eventos
router.put(
    '/:id',
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'Fecha de inicio es obligatoria').custom(isDate),
        check('end', 'La fecha de finalización es obligatoria').custom(isDate),
        validarCampos
    ],
    actualizarEvento);

//Borrar eventos
router.delete('/:id', eliminarEvento);

module.exports = router;