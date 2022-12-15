// 图谱服务插件
function graph(options) {
    // 初始化插件
    this.add('init:graph', (msg, respond) => {
        this.act('role:web', { routes: {
            prefix: '/graph',
            pin:    'service:graph_service, cmd:*',
            map: {
                update_link: { POST: true },
                delete_link: { POST: true },
            }
        }}, respond)
        console.log('graph_service init.')
        respond()
    })

    // 模式：建立链接
    this.add({service:'graph_service', cmd:'update_link'}, (msg, respond) => {
        // TODO: 将链接 { note: id, linked_notes: [ids], author: user} 写入数据库
        // 需要验证条目是否已存在
        // 如何在 linked_notes: [...] 中查找是否存在某篇笔记的id？
        // 是否应该同时保存笔记的id和标题（用于在图谱中显示）？比如 linked_notes: [ { id:..., title:... }, ...]
    })

    // 模式：更新链接
    this.add({service:'graph_service', cmd:'delete_link'}, (msg, respond) => {
        // TODO: 删除笔记时，删除相关链接
    })
}

module.exports = graph