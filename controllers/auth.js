const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt');



const crearUsuario = async (req, resp = response) => {

    const { email, password } = req.body;

    try {

        let usuario = await Usuario.findOne({ email });

        if (usuario) {
            return resp.status(400).json({
                ok: false,
                msg: 'ya existe un usuario registrado con este email'
            });
        }

        usuario = new Usuario(req.body);

        /**Encriptando contraseña */
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        await usuario.save();

        return resp.status(201).json({
            ok: true,
            msg: 'Usuario creado de manera exitosa',
            uid: usuario.id,
            name: usuario.name
        });

    } catch (error) {
        console.log(error);
        return resp.status(500).json({
            ok: false,
            msg: 'error al guardar el registro',
        });

    }
}



const loginUsuario = async (req, resp = response) => {

    const { email, password } = req.body;

    try {

        /**Confirmar email */
        let usuario = await Usuario.findOne({ email });

        if (!usuario) {
            return resp.status(400).json({
                ok: true,
                msg: 'Usuario o contraseña erradas'
            });
        }

        /**Confirmar email */

        const validPassword = bcrypt.compareSync(password, usuario.password);

        if (!validPassword) {
            return resp.status(400).json({
                ok: true,
                msg: 'Usuario o contraseña erradas'
            });
        }

        /**Generar Token */
        const token = await generarJWT(usuario.id, usuario.name);

        return resp.json({
            ok: true,
            msg: 'Ok',
            uid: usuario.id,
            name: usuario.name,
            token
        });

    } catch (error) {
        console.log(error)
        return resp.status(500).json({
            ok: false,
            msg: 'error al autenticar',
        });
    }
}

const revalidarToken = async (req, resp = response) => {


    const { uid, name } = req;

    /**Generar Nuevo Token */
    const token = await generarJWT(uid, name);

    return resp.json({
        ok: true,
        token: token
    });
}



module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken,
   
};