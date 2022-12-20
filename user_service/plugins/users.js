// 用户服务插件
function users(options) {
    // 模式：连通测试
    this.add({service:'user_service', cmd:'ping'}, (msg, respond) => {
        console.log('\n[receive] ping users plugin, user_service\n')
        respond(null, {response:'users service is available', data:msg.data})
    })

    // 模式：用户注册
    this.add({service:'user_service', cmd:'signup'}, (msg, respond) => {
        var userdata = msg.args.body.userdata
        var username = userdata.username
        var password = userdata.password

        // 检查用户名是否存在
        this.make('user_db').load$({username:username}, (err, data) => {
            if (err) {
                respond({result: 'failure', msg: 'unkown error'}, null)
            }
            else if (data) {
                respond({result: 'failure', msg:'user already exists'}, null)
            }
            else {
                // 用户数据写入数据库
                this.make('user_db').data$(userdata).save$((err, data) => {
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
        console.log('\n[receive] user login: ' + username + ' ' + password)
        // 检查账号密码是否匹配
        this.make('user_db').load$({username:username}, (err, data) => {
            if (err) {
                respond({result: 'failure', msg: 'unkown error'}, null)
            }
            if (data) {  // 有返回数据代表账号密码匹配
                if (data.password == password)
                    respond({result: 'success'}, null)
                else
                    respond({result: 'failure', msg:'wrong password'}, null)
            }
            else {
                respond({result: 'failure', msg:'user does not exist'}, null)
            }
        })
    })
}

module.exports = users