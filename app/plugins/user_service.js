// user_service 插件

// 定义
function user_service( options ) {
    // 初始化插件
    this.add('init:user_service', (msg, respond) => {
        this.act('role:web', { routes: {
            prefix: '/user',
            pin:    'service:user_service, cmd:*',
            map: {
                login: { POST: true },
                signup: { POST: true }
            }
        }}, respond)
    })
}

module.exports = user_service