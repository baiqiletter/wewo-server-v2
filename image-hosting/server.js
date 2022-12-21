var SenecaWeb = require('seneca-web')
var Express = require('express')
var Router = Express.Router
var context = new Router()
var senecaWebConfig = {
	context: context,
	adapter: require('seneca-web-adapter-express'),
	options: { parseBody: false }
}

const seneca = require('seneca')()
    .use(SenecaWeb, senecaWebConfig)
    .use('./plugins/images')
    .listen({port:3004, type:'http'}) 