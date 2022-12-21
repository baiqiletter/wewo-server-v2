// image_hosting 插件

// 定义
function image_hosting( options ) {
    // 初始化插件
    this.add('init:image_hosting', (msg, respond) => {
        this.act('role:web', { routes: {
            prefix: '/image',
            pin:    'service:image_hosting, cmd:*',
            map: {
                upload: { POST: true },
                download: { GET: true, suffix: '/:filename' },
            }
        }}, respond)
        console.log('image hosting initialized')
    })
}

module.exports = image_hosting