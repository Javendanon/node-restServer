const express = require('express');
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario');
const app = express();
const jwt = require('jsonwebtoken');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);



app.post('/login',(req,res) => {
    let body = req.body;
    Usuario.findOne({email:body.email}, (err,usuarioDB) => {

        if (err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB){
            return res.status(400).json({
                ok: false,
                err :{
                    message: '(Usuario) o contraseña incorrectos'
                }
            });
        }
        if (!bcrypt.compareSync(body.password,usuarioDB.password)){
            return res.status(400).json({
                ok: false,
                err :{
                    message: 'Usuario o (contraseña) incorrectos'
                }
            });
        }
        let token = jwt.sign({
            usuario: usuarioDB
        },process.env.SEED_LOGIN,{expiresIn:process.env.CADUCIDAD_TOKEN});
        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });
    });
});
//Configuraciones de google

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
    
}
app.post('/google', async (req,res) => {
    
    let token = req.body.idtoken;
    let googleUser = await verify(token)
        .catch(e =>{
            return res.status(403).json({
                ok: false,
                err: e
            })
        });
    
    Usuario.findOne({email:googleUser.email}, (err,usuarioDB) =>{
        if (err){
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (usuarioDB){ // Si existe usuario en db
            if(usuarioDB.google === false){ // Si el usuario de la db no es usuario google
                
                Usuario.findByIdAndUpdate(usuarioDB.id,googleUser,{new:true,runValidators:true},(err,usuario) => {
                    if (err) {
                        return res.status(400).json({
                            ok:false,
                            err
                        });
                    }
                    res.json({
                        ok: true,
                        usuario
                    });
                });
                let token = jwt.sign({  // Marca a)
                    usuario: usuarioDB
                },process.env.SEED_LOGIN,{expiresIn:process.env.CADUCIDAD_TOKEN});
            }  
            return res.json({
                ok: true,
                usuario: usuarioDB,
                token
            });
        } else {
            //Si usuario no existe en db 
            let usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';
            usuario.save((err,usuarioDB) =>{
                if (err){
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }
                let token = jwt.sign({
                    usuario: usuarioDB
                },process.env.SEED_LOGIN,{expiresIn:process.env.CADUCIDAD_TOKEN});
                
                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });
            })
        }
    });
});


module.exports = app;