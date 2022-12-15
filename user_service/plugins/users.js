// 用户服务插件
function users(options) {
    // 初始化插件
    this.add('init:users', (msg, respond) => {
        this.act('role:web', { routes: {
            prefix: '/user',
            pin:    'service:user_service, cmd:*',
            map: {
                login: { POST: true },
                signup: { POST: true }
            }
        }}, respond)
        console.log('user_service init.')
        respond()
    })
    
    // 模式：连通测试
    this.add({service:'user_service', cmd:'ping'}, (msg, respond) => {
        console.log('\n[receive] ping users plugin, user_service\n')
        respond(null, {response:'users service is available', data:msg.data})
    })

    // 模式：用户注册
    this.add({service:'user_service', cmd:'signup'}, (msg, respond) => {
        var userdata = msg.userdata
        var username = userdata.username
        var password = userdata.password

        // 检查用户名是否存在
        this.make('user_db').load$({username:username}, (err, data) => {
            if (err) {
                respond(err, null)
            }
            else if (data) {
                respond({msg:'user already exists'}, null)
            }
            else {
                // 用户数据写入数据库
                this.make('user_db').data$(userdata).save$((err, data) => {
                    respond(err, {})
                })
            }
        })
    })

    // 模式：用户登陆
    this.add({service:'user_service', cmd:'login'}, (msg, respond) => {
        var userdata = msg.userdata
        var username = userdata.username
        var password = userdata.password

        // 检查账号密码是否匹配
        this.make('user_db').load$({username:username}, (err, data) => {
            if (data) {  // 有返回数据代表账号密码匹配
                if (data.password == password)
                    respond(err, null)
                else
                    respond({msg:'wrong password'}, null)
            }
            else {
                respond({msg:'user does not exist'}, null)
            }
        })
    })
}

module.exports = users