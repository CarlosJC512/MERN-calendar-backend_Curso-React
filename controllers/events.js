const { response } = require('express');
const Evento = require('../models/Evento');


const obtenerEventos = async (req, res = response) => {

    const eventos = await Evento.find()
        .populate('user', 'name');

    res.status(201).json({
        ok: true,
        eventos
    });
}

const crearEvento = async (req, res = response) => {

    const evento = new Evento(req.body);

    try {

        evento.user = req.uid;

        const eventoGuardado = await evento.save();

        res.status(201).json({
            ok: true,
            evento: eventoGuardado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Contacte al administrador'
        });
    }
}

const actualizarEvento = async (req, res = response) => {

    const { id } = req.params;
    const uid = req.uid;

    try {

        const evento = await Evento.findById(id);

        if (!evento) {
            return res.status(404).json({
                ok: false,
                msg: `No existe un evento con el id ${id}`
            })
        }

        if (evento.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'Mo tiene privilegio para editar este evento'
            });

        }

        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        const eventoActualizado = await Evento.findByIdAndUpdate(id, nuevoEvento, { new: true });

        res.json({
            ok: true,
            evento: eventoActualizado
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Contacte al administrador'
        });
    }

}

const eliminarEvento = async (req, res = response) => {

    const { id } = req.params;
    const uid = req.uid;

    try {

        const evento = await Evento.findById(id);

        if (!evento) {
            return res.status(404).json({
                ok: false,
                msg: `No existe un evento con el id ${id}`
            })
        }

        if (evento.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'Mo tiene privilegio para borrar este evento'
            });

        }

        const eventoBorrado = await Evento.findByIdAndDelete(id);

        res.json({
            ok: true,
            evento: eventoBorrado,
            msg: 'Archivo eliminado'
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Contacte al administrador'
        });
    }
}

module.exports = {
    obtenerEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento
}