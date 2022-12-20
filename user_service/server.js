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
    .use(require('seneca-mongo-store'), { uri: 'mongodb://localhost:27017/user_db' })
    .use('./plugins/users')
    .listen({port:3001, type:'http'}) 

// 测试接口
// var userdata = {
//     username: 'test user',
//     password: '123456'
// }
// seneca.act({service:'user_service', cmd:'signup', userdata:userdata}, (err, data) => {
//     if (!err) {
//         console.log('signup success, your account is ' + userdata.username + ', password is ' + userdata.password)
//     }
//     else {
//         console.log('signup failed: ' + err)
//     }
// })
// seneca.act({service:'user_service', cmd:'login', userdata:userdata}, (err, data) => {
//     if (!err) {
//         console.log('login success, your account is ' + userdata.username + ', password is ' + userdata.password)
//     }
//     else {
//         console.log('login failed: ' + err)
//     }
// })