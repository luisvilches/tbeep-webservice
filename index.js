const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const request = require('request');

const app = express();var Schema = mongoose.Schema;
var Schema = mongoose.Schema;


///////////////////////////////////////////////////////////////////////
/////////////////// SCHEMA DEL MODELO /////////////////////////////////
///////////////////////////////////////////////////////////////////////

var beep = new Schema({

	ENTIDAD: String,
	DIRECCION: String,
	COMUNA: String,
	HORARIO: String,
	LATITUD: String,
	LONGITUD: String

});
var beep = mongoose.model('beep',beep);


///////////////////////////////////////////////////////////////////////
////////////////// CONFIGURACIONES ////////////////////////////////////
///////////////////////////////////////////////////////////////////////


app.use(cors());
app.use(bodyParser.urlencoded({extend: false}));
app.use(bodyParser.json());
app.set('port', process.env.PORT || 3000);

//////////////////////////////////////////////////////////////////////
/////////////// CONECCION A LA BASE DE DATOS /////////////////////////
//////////////////////////////////////////////////////////////////////

mongoose.connect('mongodb://luisvilches:andres2230@ds017584.mlab.com:17584/restful', function(err,res){
	if (err) {
		console.log("problemas al conectar con la base de datos" + err)
	};
});

///////////////////////////////////////////////////////////////////////
////////////////// CONSULTA PARADERO///////////////////////////////////
///////////////////////////////////////////////////////////////////////


app.get('v1/paradero/:paradero',function(req,res){
	var paradero = req.params.paradero;
	var dev = "PB1202";

	request('http://www.transantiago.cl/predictor/prediccion?codsimt='+paradero, function (error, response, body) {
	  if (!error && response.statusCode == 200) {

	  	var o = JSON.parse(body);

	  	res.json(o);

	  }
	});
});
///////////////////////////////////////////////////////////////////////
/////////////////// CONSULTA SALDO/////////////////////////////////////
///////////////////////////////////////////////////////////////////////
app.get('v1/saldo/:tarjeta',function(req,res){
	var tarjeta = req.params.tarjeta;
	var dev = "21567952";

	request('http://www.metrosantiago.cl/contents/guia-viajero/includes/consultarTarjeta/'+tarjeta, function (error, response, body) {
	  if (!error && response.statusCode == 200) {

	  	var o = JSON.parse(body);
	  	const estado = o[0].estado;
	  	const mensaje = o[0].mensaje;
	  	const saldo = o[1].saldo;
	  	const fecha = o[1].fecha;

	  	result = {
	  		status: estado,
	  		estado: mensaje,
	  		saldo: saldo,
	  		fecha: fecha,
	  		numero: tarjeta
	  	};

	  	res.json(result);
	  	console.log(result);

	  }
	});
});


///////////////////////////////////////////////////////////////////////
/////////////////// CONSULTA REQCORRIDO////////////////////////////////
///////////////////////////////////////////////////////////////////////

app.get('v1/recorrido/:recorrido',function(req,res){
	var recorrido = req.params.recorrido;
	var dev = "B12";

	request('http://www.transantiago.cl/restservice/rest/getrecorrido/'+recorrido, function (error, response, body) {
	  if (!error && response.statusCode == 200) {

	  	var o = JSON.parse(body);

	  	res.json(o);

	  }
	});
});

///////////////////////////////////////////////////////////////////////
/////////////////// PUNTOS DE RECARGA//////////////////////////////////
///////////////////////////////////////////////////////////////////////

// GET
app.get('v1/puntos/recarga', function(req,res,next){
	beep.find(function(err,data){
		if (err) {
			console.log(err);
		};
		res.json({result:{records:data}});
	});
});



//POST
app.post('v1/agregar/punto',function(req,res,next){

	var data = new beep(req.body);
	data.save(function(err){
		if (err) {console.log(err)};
		res.status(200).jsonp(data);
	});
});


///////////////////////////////////////////////////////////////////////
////////////////// PUERTO DEL SERVIDOR ////////////////////////////////
///////////////////////////////////////////////////////////////////////

app.listen(app.get('port'), function () {
	console.log("App started at http://localhost:" + app.get('port'));
});