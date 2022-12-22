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
    .use('entity')
    // .use(require('seneca-mongo-store'), { uri: 'mongodb://localhost:27017/graph_db' })
    .use('./plugins/graph')
    .listen({port:3003, type:'http'})
