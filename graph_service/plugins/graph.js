// 图谱服务插件
function graph(options) {
    // 模式：连通测试
    this.add({service:'graph_service', cmd:'ping'}, (msg, respond) => {
        console.log('\n[receive] ping graph plugin, graph_service\n')
        respond(null, {response:'graph service is available', data:msg.data})
    })

    // 模式：建立/更新指定笔记的正向链接（因为新建/更新笔记时只会改变正向链接，反向链接是隐含的关联）
    this.add({service:'graph_service', cmd:'update'}, (msg, respond) => {
        // 将链接 { note: id, linked_notes: [ids], author: user} 写入数据库
        var link_data = {
            note: msg.args.body.note,
            linked_notes: msg.args.body.linked_notes,
            author: msg.args.body.author
        }

        // 需要验证条目是否已存在，存在则为更新，否则为新建
        // 是否应该同时保存笔记的id和标题（用于在图谱中显示）？不需要，因为图谱的节点和链接数据是分开的，graph_service只负责链接部分
        this.make('graph_db').load$({ note: link_data.note }, (err, data) => {
            console.log('\n[receive] update note links : ' + link_data.note + ' -> ' + link_data.linked_notes.length)
            if (data) {  // 已存在，更新现有数据（先删除后新建）
                this.make('graph_db').remove$({ note: link_data.note }, (err, data) => {
                    this.make('graph_db').data$(link_data).save$((err, data) => {
                        respond(err, null)
                    })
                })
            }
            else {  // 不存在，新建条目
                this.make('graph_db').data$(link_data).save$((err, data) => {
                    respond(err, null)
                })
            }
        })
    })

    // 模式：删除指定笔记的所有相关链接
    this.add({service:'graph_service', cmd:'delete'}, (msg, respond) => {
        // 删除笔记时，删除相关链接
        var note_id = msg.args.body.note

        this.make('graph_db').remove$({ note: note_id }, (err, data) => {
            console.log('\n[receive] delete note links : ' + note_id)
            console.log(data)
            respond(err, null)
        })
    })

    // 模式：获取当前用户所有链接
    this.add({service:'graph_service', cmd:'get_all'}, (msg, respond) => {
        var username = msg.args.query.author

        this.make('graph_db').list$({ author: username }, (err, data) => {
            console.log('\n[receive] get links of all ' + data.length + ' notes of ' + username)
            // console.log(data)
            var result = []
            for (var i = 0; i < data.length; i++) {
                result.push({
                    note: data[i].note,
                    linked_notes: data[i].linked_notes
                })
            }
            console.log(result)
            respond(err, result)
        })
    })

    // 模式：重新生成当前用户的所有链接
    this.add({service:'graph_service', cmd:'refresh'}, (msg, respond) => {
        // { links: [ { note: id, linked_notes: [ids] } ], author: user }
        var links = msg.args.body.links
        var username = msg.args.body.author

        this.make('graph_db').remove$({ author: username }, (err, data) => {
            console.log('\n[receive] refresh all links of ' + username)

            for (var i = 0; i < links.length; i++) {
                this.make('graph_db').save$({
                    note: links[i].note,
                    linked_notes: links[i].linked_notes,
                    author: username
                }, () => {})
            }

            respond(err, { result: 'success' })
        })
    })
}

module.exports = graph