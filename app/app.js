var SenecaWeb = require('seneca-web')
var Express = require('express')
var Router = Express.Router
var context = new Router()

var senecaWebConfig = {
	context: context,
	adapter: require('seneca-web-adapter-express'),
	options: { parseBody: false }
}

var app = Express()
	.use( require('body-parser').json() )
	.use( context )

app.use(Express.static(__dirname + '/public'))
app.get('/', function (req, res) {
	res.render(__dirname + '/public/index.html')
})
app.listen(3000)


// 获取配置信息
const Config = require('./config')
const Protocol = Config.Protocol
const ServiceList = Config.ServiceList

// 启用Seneca
var seneca = require('seneca')()
	.use( SenecaWeb, senecaWebConfig )
	.use( './plugins/test' )
	.client( { type:Protocol, pin:'service:'+ServiceList.user_service.name, port:ServiceList.user_service.port } )
	.client( { type:Protocol, pin:'service:'+ServiceList.note_service.name, port:ServiceList.note_service.port } )
	.client( { type:Protocol, pin:'service:'+ServiceList.graph_service.name, port:ServiceList.graph_service.port } )
	.client( { type:Protocol, pin:'service:'+ServiceList.image_hosting.name, port:ServiceList.image_hosting.port } )
