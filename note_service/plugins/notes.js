// 笔记服务插件
function notes(options) {
    // 初始化插件
    this.add('init:notes', (msg, respond) => {
        this.act('role:web', { routes: {
            prefix: '/note',
            pin:    'service:note_service, cmd:*',
            map: {
                get: { GET: true },
                create: { POST: true },
                update: { POST: true },
                delete: { POST: true },
                get_all: { GET: true },
            }
        }}, respond)
        console.log('note_service init.')
        respond()
    })

    // 模式：获取笔记
    this.add({service:'note_service', cmd:'get'}, (msg, respond) => {
        var note_id = msg.id
        
        this.make('note_db').load$({ id: note_id }, (err, note) => {
            console.log('\nget note by id : ' + note.id + '-' + note.title)
            respond(err, { id: note.id, note: note })
        })
    })

    // 模式：创建笔记
    this.add({service:'note_service', cmd:'create'}, (msg, respond) => {
        var note = msg.note
        
        this.make('note_db').data$(note).save$((err, note) => {
            console.log('\ncreate note : ' + note.id + '-' + note.title)
            respond(err, { id: note.id })
        })
    })

    // 模式：更新笔记
    this.add({service:'note', cmd:'update'}, (msg, respond) => {
        var note = msg.note  // 应有 id 字段

        this.make('note_db').data$(note).save$((err, note) => {
            console.log('\nupdate note : ' + note.id + '-' + note.title)
            respond(err, { id: note.id })
        })
    })

    // 模式：删除笔记
    this.add({service:'note_service', cmd:'delete'}, (msg, respond) => {
        var note_id = msg.id

        this.make('note_db').remove$({ id: note_id }, (err, data) => {
            console.log('\ndelete note : ' + note_id)
            respond(err, null)
        })
    })

    // 模式：获取所有笔记
    this.add({service:'note_service', cmd:'get_all'}, (msg, respond) => {
        var username = msg.author
        this.make('note_db').list$({ author: username }, (err, data) => {
            console.log('\nget all notes of ' + username)
            console.log(data)
            respond(err, data)
        })
    })
}

module.exports = notes