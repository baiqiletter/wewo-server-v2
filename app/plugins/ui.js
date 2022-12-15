// ui 插件

function ui( options ) {
    this.add('service:ui,path:home', (msg, respond) => {
        var service = msg.args.params.service;
        var data = msg.args.query.data;

        respond({msg:'This is homepage'});
    })

    this.add('init:ui', (msg, respond) => {
        this.act('role:web', {routes: {
            prefix: '/',
            pin:    'service:ui,path:*',
            map: {
                home: { GET: true },
            }
        }}, respond)
    })
}

module.exports = ui