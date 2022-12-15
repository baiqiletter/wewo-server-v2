// test 插件

// 引用配置文件、获取配置信息
const Config = require('../config');
const ServiceList = Config.ServiceList;

// 定义
function test( options ) {
    this.add('service:test,path:ping', (msg, respond) => {
        var service = msg.args.params.service;
        var data = msg.args.query.data;

        // 检查是否有此服务
        if (!ServiceList[service]) {
            respond({err: 'Sorry, service is not access!'}, null);
            return;
        }

        console.log('\n[request] ping ' + service + '\n')

        this.act('service:' + service + ',cmd:ping', {
            service: service,
            data: data
        }, respond)
    })

    this.add('init:test', (msg, respond) => {
        this.act('role:web', {routes: {
            prefix: '/test',
            pin:    'service:test,path:*',
            map: {
                ping: { GET: true, suffix: '/:service' },
            }
        }}, respond)
    })
}

module.exports = test