// 笔记服务插件
function notes(options) {
    // 模式：连通测试
    this.add({service:'note_service', cmd:'ping'}, (msg, respond) => {
        console.log('\n[receive] ping notes plugin, note_service\n')
        respond(null, {response:'notes service is available', data:msg.data})
    })

    // 模式：获取笔记
    this.add({service:'note_service', cmd:'get'}, (msg, respond) => {
        var note_id = msg.args.params.id
        
        this.make('note_db').load$({ id: note_id }, (err, note) => {
            console.log('\n[receive] get note by id : ' + note.id + ' - ' + note.title)
            respond(err, {
                id: note.id, 
                title: note.title,
                author: note.author,
                content: note.content
            })
        })
    })

    // 模式：创建笔记
    this.add({service:'note_service', cmd:'create'}, (msg, respond) => {
        var note_data = {
            title: msg.args.body.title,
            author: msg.args.body.author,
            content: msg.args.body.content
        }
        
        this.make('note_db').data$(note_data).save$((err, note) => {
            console.log('\n[receive] create note : ' + note.id + ' - ' + note.title)
            respond(err, { id: note.id })
        })
    })

    // 模式：更新笔记
    this.add({service:'note_service', cmd:'update'}, (msg, respond) => {
        var note_data = {
            id: msg.args.body.id,
            title: msg.args.body.title,
            author: msg.args.body.author,
            content: msg.args.body.content
        }

        this.make('note_db').data$(note_data).save$((err, note) => {
            console.log('\n[receive] update note : ' + note.id + ' - ' + note.title)
            respond(err, { id: note.id })
        })
    })

    // 模式：删除笔记
    this.add({service:'note_service', cmd:'delete'}, (msg, respond) => {
        var note_id = msg.args.body.id

        this.make('note_db').remove$({ id: note_id }, (err, data) => {
            console.log('\n[receive] delete note : ' + note_id)
            respond(err, null)
        })
    })

    // 模式：获取所有笔记
    this.add({service:'note_service', cmd:'get_all'}, (msg, respond) => {
        var username = msg.args.query.author
        this.make('note_db').list$({ author: username }, (err, data) => {
            console.log('\n[receive] get all ' + data.length + ' notes of ' + username)
            var result = []
            for (var i = 0; i < data.length; i++) {
                result.push({
                    id: data[i].id,
                    title: data[i].title,
                    author: data[i].author,
                    content: data[i].content,
                })
            }
            respond(err, result)
        })
    })
}

module.exports = notes