// graph_service 插件

// 定义
function graph_service( options ) {
    // 初始化插件
    this.add('init:graph_service', (msg, respond) => {
        this.act('role:web', { routes: {
            prefix: '/graph',
            pin:    'service:graph_service, cmd:*',
            map: {
                update: { POST: true },
                delete: { POST: true },
                get_all: { GET: true },
                refresh: { POST: true },
                get_reverse_links: { GET: true },
            }
        }}, respond)
        console.log('graph service initialized')
    })
}

module.exports = graph_service