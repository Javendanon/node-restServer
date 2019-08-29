


// Port
process.env.PORT = process.env.PORT || 3000;
//Enviroment
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
//Vencimiento del token
// 60s
// 60m
// 24h
// 30d
process.env.CADUCIDAD_TOKEN = 60*60*24*30
//SEED de login
process.env.SEED_LOGIN = process.env.SEED_LOGIN || 'dev-env';


