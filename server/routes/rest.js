const express = require('express');
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario');
const app = express();
const jwt = require('jsonwebtoken');

sumaRut = (rut) => {
    let suma = 0;
    let k=2;
    lengthRut = rut.length;
    rutInvertido = '';
    while(lengthRut>=0){
        rutInvertido += rut.charAt(lengthRut)
        lengthRut--;
    }
    for (let i=0;i<rut.length;i++){

        if (i<6){
            suma += rutInvertido[i]*k
            k++
        }
        else if (i==6){
            k=2
            suma += rutInvertido[i]*k
        }
        else {
            k++
            suma+= rutInvertido[i]*k
        }
    }
    return suma;
}

app.post('/VerificaRut',(req,res) => {
    let body = req.body;
    let CompleteRut = body.rut.split('-')
    let rutUsable = CompleteRut[0]
    if (rutUsable.length<7){
        res.json({
            ok: false,
            msg: `El rut ingresado ${body.rut} no es válido`
        })
    }
    suma = sumaRut(rutUsable)
    
    dv = (11-(suma%11))
    
    if (dv == CompleteRut[1]){
        if (dv==10){
            res.json({
                ok:true,
                msg: `El rut ingresado ${body.rut} es válido y tiene como dígito verificador K`
            })
        } else if (dv == 11){
            res.json({
                ok:true,
                msg: `El rut ingresado ${body.rut} es válido y tiene como digito verificador 0`
            })
        }
        res.json({
            ok:true,
            msg: `El rut ingresado ${body.rut} es válido y tiene como dígito verificador ${dv}`
        })
    }
    res.json({
        ok: false,
        msg: `El rut ingresado ${body.rut} es inválido o el formato está errado`
    })
    
});
app.post('/NombrePropio',(req,res) => {
    body = req.body
    nombres = body.nombres.toLowerCase()
    nombreEdit = nombres.split(' ')
    for (let i=0;i<nombreEdit.length;i++){
        nombreEdit[i] = nombreEdit[i].charAt(0).toUpperCase() + nombreEdit[i].slice(1)
    }
    nombres = nombreEdit.join(' ')
    apellido_m = body.apellido_m.toLowerCase()
    apellido_p = body.apellido_p.toLowerCase()
    genero = body.genero
    if (genero=='M')
        genero = 'Sr.'
    else if (genero=='F')
        genero = 'Sra.'
    res.json({
        ok:true,
        msg: `Hola ${genero} ${nombres} ${apellido_p.charAt(0).toUpperCase() + apellido_p.slice(1)} ${apellido_m.charAt(0).toUpperCase() + apellido_m.slice(1)}`
    })
});

module.exports = app;