require('seneca')()
    .use('./plugins/notes')
    .listen({port:3002, type:'http'})