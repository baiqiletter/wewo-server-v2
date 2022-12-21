var Minio = require('minio')

var minioClient = new Minio.Client({
    endPoint: 'localhost',
    port: 9000,
    useSSL: true,
    accessKey: 'minio',
    secretKey: '12345678'
});

const stringRandom = require('string-random')


// 图床插件
function images( options ) {
    // 模式：连通测试
    this.add({service:'image_hosting', cmd:'ping'}, (msg, respond) => {
        console.log('[receive] ping images plugin, image_hosting')
        respond(null, {response:'images service is available', data:msg.data})
    })

    // 模式：上传图片
    this.add({service:'image_hosting', cmd:'upload'}, (msg, respond) => {
        console.log('upload image')
        var file = ''
        var filename = stringRandom(16, { number: true }) + '.jpg'
        console.log(msg)

        minioClient.fPutObject('image', filename, file, function(err) {
            if (err) return console.log(err)
            console.log('upload image ' + filename + ' success')
        })
        respond(null, { image: filename })
    })

    // 模式：下载图片
    this.add({service:'image_hosting', cmd:'download'}, (msg, respond) => {
        console.log('download image')
        var filename = msg.args.params.filename

        minioClient.fGetObject('image', filename, file, function(err) {
            if (err) return console.log(err)
            console.log('download image ' + filename + ' success')
        })
        respond(null, { image: filename })
    })
}

module.exports = images