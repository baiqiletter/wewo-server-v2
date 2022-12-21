// 用户服务插件
function users(options) {
    // 模式：连通测试
    this.add({service:'user_service', cmd:'ping'}, (msg, respond) => {
        console.log('[receive] ping users plugin, user_service')
        respond(null, {response:'users service is available', data:msg.data})
    })

    // 模式：用户注册
    this.add({service:'user_service', cmd:'signup'}, (msg, respond) => {
        var userdata = msg.args.body.userdata
        var username = userdata.username
        var password = userdata.password
        console.log('[receive] user signup: ' + username)

        // 检查用户名是否存在
        this.make('user_db').load$({username:username}, (err, data) => {
            if (err) {
                console.log('user signup failed: ' + username)
                respond({result: 'failure', msg: 'unkown error'}, null)
            }
            else if (data) {
                console.log('user signup failed: ' + username)
                respond({result: 'failure', msg:'user already exists'}, null)
            }
            else {
                // 用户数据写入数据库
                this.make('user_db').data$(userdata).save$((err, data) => {
                    console.log('user signup success: ' + username)
                    respond({result: 'success'}, {})
                })
            }
        })
    })

    // 模式：用户登陆
    this.add({service:'user_service', cmd:'login'}, (msg, respond) => {
        var userdata = msg.args.body.userdata
        var username = userdata.username
        var password = userdata.password
        console.log('[receive] user login: ' + username)
        // 检查账号密码是否匹配
        this.make('user_db').load$({username:username}, (err, data) => {
            if (err) {
                console.log('user login failed (unkown error): ' + username)
                respond({result: 'failure', msg: 'unkown error'}, null)
            }
            if (data) {  // 有返回数据代表账号密码匹配
                if (data.password == password) {
                    console.log('user login success: ' + username)
                    respond({result: 'success'}, null)
                }
                else {
                    console.log('user login failed (wrong password): ' + username)
                    respond({result: 'failure', msg:'wrong password'}, null)
                }
            }
            else {
                console.log('user login failed (user does not exist): ' + username)
                respond({result: 'failure', msg:'user does not exist'}, null)
            }
        })
    })
}

module.exports = users