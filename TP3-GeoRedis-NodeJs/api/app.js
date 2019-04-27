var redis =require('redis')
var express = require('express')
var app = express()
var port = 8000
var bodyParser = require('body-parser');

var cliente = redis.createClient(6379, 'redis')
app.set('port', port)
app.engine('pug', require('pug').__express)
app.set('view engine', 'pug');
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use(express.static('public'));
app.use(bodyParser());

const rubro = ['Cervecerias', 'Universidades', 'Farmacias', 'Emergencias', 
                    'Supermercados'];

cliente.on('connect', function(){
	console.log('Conectando a redis...');
})



app.get('/', function(req, res){
	
	cliente.flushdb();
	
	cliente.geoadd(rubro[0], '-32.481724', '-58.232680', 'Ambar');
    cliente.geoadd(rubro[0], '-32.477309', '-58.248241', 'Lagash');
    cliente.geoadd(rubro[0], '-32.479665', '-58.235397', '7 Colinas');
    cliente.geoadd(rubro[0], '-32.480086', '-58.233925', 'Drakkar');
	cliente.geoadd(rubro[0], '-32.481020', '-58.237924', 'Tractor');
	cliente.geoadd(rubro[0], '-32.484650', '-58.237062', 'Bigua');
	

	cliente.geoadd(rubro[1], '-32.478936', '-58.233322', 'UDAER FCyT');
	cliente.geoadd(rubro[1], '-32.495646', '-58.229553', 'UTN');
	cliente.geoadd(rubro[1], '-32.480391', '-58.260260', 'UNER');
    cliente.geoadd(rubro[1], '-32.481262', '-58.229353', 'UCU');
	cliente.geoadd(rubro[1], '-32.471502', '-58.234675', 'UADER Humanidades');
	

	cliente.geoadd(rubro[2], '-32.482952', '-58.228075', 'Farmacia Bancaria');
	cliente.geoadd(rubro[2], '-32.491844', '-58.258164', 'Farmacia VIVA');
    cliente.geoadd(rubro[2], '-32.479664', '-58.234344', 'Farmacia Circulo Católico');
    cliente.geoadd(rubro[2], '-32.486442', '-58.230976', 'Farmacia Suarez');
	cliente.geoadd(rubro[2], '-32.485926', '-58.233003', 'Farmacia Alberdi');
	
    
	cliente.geoadd(rubro[3], '-32.485500', '-58.230304', 'Swiss Medical');
    cliente.geoadd(rubro[3], '-32.481122', '-58.260520', 'Hospital J.J Urquiza');
	cliente.geoadd(rubro[3], '-32.479653', '-58.235543', 'Cooperativa Médica');
    cliente.geoadd(rubro[3], '-32.483169', '-58.230086', 'Clínica Uruguay');
    cliente.geoadd(rubro[3], '-32.477082', '-58.232193', 'Santa Clara Pet');

	
	cliente.geoadd(rubro[4], '-32.480280', '-58.221783', 'Supermercado Del Puerto');
    cliente.geoadd(rubro[4], '-32.489210', '-58.230321', 'Supermercado Gran Rex');
    cliente.geoadd(rubro[4], '-32.485982', '-58.232626', 'Supermercado Supremo');
	cliente.geoadd(rubro[4], '-32.488524', '-58.241835', 'Supermercado Dia');
	cliente.geoadd(rubro[4], '-32.488254', '-58.241857', 'Supermercado El Rey');
	cliente.geoadd(rubro[4], '-32.480280', '-58.221783', 'Supermercado Maycon');
	

	res.render('index')
})

app.get('/geopos', function(req, res){
	app.get('/', (req, res) => res.render('index'));
	var r= `${req.query.r}`

	
	cliente.georadius(rubro[r], '-32.481111', '-58.260520', '50', 'km', function(err, value){
		res.render('lugar',{
			v: value
		
		});
	});	
});

app.post('/georadio', function(req, res){
	app.get('/', (req, res) => res.render('index'));
	var lat= req.body.lat
	var long= req.body.long
	
	
	cliente.georadius(rubro[0], -lat, -long, '5', 'km','withdist','withcoord', function(err, value0){	
		cliente.georadius(rubro[1], -lat, -long, '5', 'km','withdist','withcoord', function(err, value1){
		cliente.georadius(rubro[2], -lat, -long, '5', 'km','withdist','withcoord', function(err, value2){
		cliente.georadius(rubro[3], -lat, -long, '5', 'km','withdist','withcoord', function(err, value3){
		cliente.georadius(rubro[4], -lat, -long, '5', 'km','withdist','withcoord', function(err, value4){
			
		
	res.render('radio',{
		radio0:value0,
		radio1:value1,
		radio2:value2,
		radio3:value3,
		radio4:value4
	});		
		
});
});
});
});
});	
	
});

app.post('/dist', function(req, res){
	var lat = req.body.lat
	var long= req.body.long
	cliente.geoadd(req.body.grupo, -lat, -long, 'yo');
	cliente.geodist(req.body.grupo,'yo', req.body.lugar, 'km', function(err, value){
		
		res.render('dist',{
			dist:value
		})
	})	
	
});



app.listen(app.get('port'), (err) => {
	console.log(`Servidor corriendo en el puerto ${app.get('port')}`)
})


