const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const _ = require('lodash');

const app = express();

// enable files upload
app.use(fileUpload({
    createParentPath: true
}));

//add other middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));

// enable minio OSS
var Minio = require('minio')

var minioClient = new Minio.Client({
    endPoint: 'localhost',
    port: 9000,
    useSSL: false,
    accessKey: 'minio',
    secretKey: '12345678'
});

var Fs = require('fs')
const stringRandom = require('string-random')

//start app 
const port = process.env.PORT || 3004;

app.listen(port, () => 
  console.log(`App is listening on port ${port}.`)
);

app.post('/image', async (req, res) => {
    // console.log(req)
    if(!req.files) {
        res.send({
            status: false,
            message: 'No file uploaded'
        });
    } else {
        let image = req.files.image.data;
        let extension = req.files.image.name.split('.').pop();
        let filename = stringRandom(16, { number: true }) + '.' + extension
        let content_type = req.files.image.type

        // upload image to minio server
        minioClient.putObject('image', filename, image, content_type, function(err) {
            if (err) return console.log(err)
            console.log('upload image ' + filename + ' success')
        })

        //send response
        res.send({
            status: true,
            message: 'File is uploaded',
            image: filename
        });
    }
});

app.get('/image/:filename',async (req, res) => {
    var filename = req.params.filename
    
    minioClient.getObject('image', filename, function (err, dataStream) {
        if (err) return console.log(err)

        // 给客户端返回一个文件流 type类型
        res.set( 'content-type', {"png": "image/png","jpg": "image/jpeg"} );//设置返回类型

        var responseData = [];  //存储文件流
        if (dataStream) {  //判断状态
            dataStream.on( 'data', function( chunk ) {
            responseData.push( chunk );
        });
        dataStream.on( 'end', function() {
            var finalData = Buffer.concat( responseData );
            res.write( finalData );
            res.end();
        });
    }
        
    })
})