// graph_service 插件

// 定义
function graph_service( options ) {
    // 初始化插件
    this.add('init:graph_service', (msg, respond) => {
        this.act('role:web', { routes: {
            prefix: '/graph',
            pin:    'service:graph_service, cmd:*',
            map: {
                update_link: { POST: true },
                delete_link: { POST: true },
            }
        }}, respond)
    })
}

module.exports = graph_service