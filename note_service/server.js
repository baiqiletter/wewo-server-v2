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
    .use(require('seneca-mongo-store'), { uri: 'mongodb://localhost:27017/note_db' })
    .use('./plugins/notes')
    .listen({port:3002, type:'http'})

// 1. 测试连通性

// const note = {
//     title: '留学日记',
//     author: '胡适',
//     content: '# 留学日记\n胡适之啊胡适之！你怎么能如此堕落！先前订下的学习计划你都忘了吗？子曰：“吾日三省吾身。”不能再这样下去了！\n'
// }

// seneca.act({service:'note_service', cmd:'create', note: note}, (err, data) => {
//     let note_id = data.id
//     console.log('\ncallback (note, create) : ' + note_id)

//     seneca.act({service:'note_service', cmd:'get', id:note_id}, (err, data) => {
//         console.log('\ncallback (note, get) : ' + data.id)
//     })
// })

// 2. 测试接口

// target_note_id = '6399d85ccba7f247792dc8de'

// seneca.act({service:'note_service', cmd:'create', note: note}, (err, data) => {
//     if (!err) {
//         console.log('\ncallback create success ' + data.id)
//     }
// })
// seneca.act({service:'note_service', cmd:'get', id: target_note_id}, (err, data) => {
//     if (!err) {
//         console.log('\ncallback get success ' + data.id)
//     }
// })
// seneca.act({service:'note_service', cmd:'update', note: note}, (err, data) => {
//     if (!err) {
//         console.log('\ncallback update success ' + data.id)
//     }
// })
// seneca.act({service:'note_service', cmd:'delete', id: target_note_id}, (err, data) => {
//     if (!err) {
//         console.log('\ncallback delete success ' + target_note_id)
//     }
// })
// seneca.act({service:'note_service', cmd:'get_all', author:'胡适'}, (err, data) => {
//     if (!err) {
//         console.log('\ncallback get_all success, total ' + data.length + ' notes')
//     }
// })