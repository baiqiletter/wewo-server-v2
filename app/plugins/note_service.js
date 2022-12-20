// note_service 插件

// 定义
function note_service( options ) {
    // 初始化插件
    this.add('init:note_service', (msg, respond) => {
        this.act('role:web', { routes: {
            prefix: '/note',
            pin:    'service:note_service, cmd:*',
            map: {
                get: { GET: true, suffix: '/:id' },
                create: { POST: true },
                update: { POST: true },
                delete: { POST: true },
                get_all: { GET: true },
            }
        }}, respond)
    })
}

module.exports = note_service