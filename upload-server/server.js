// call all the required packages
const express = require('express')
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');
var cors = require('cors');
var fileExtension = require('file-extension')
const fs = require('fs')
var mime = require('mime');
const request = require('request');
//CREATE EXPRESS APP
const app = express();

// cors allow usage of server from different origin only for development
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('body-parser').json({ type: '*/*' }));

//Enable CORS from client-side
app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    next();
});
const userFiles = './';
// Angular DIST output folder
app.use(express.static(path.join(__dirname, 'dist')));
app.use('/files', express.static(userFiles));
//ROUTES WILL GO HERE
app.get('/', function(req, res) {
    res.json({
        message: 'Server Started!'
    });
});

app.post('/download', function(req, res, next) {

    var filePath = path.join(__dirname) + '/' + req.body.filename;
    res.sendFile(filePath);
});

app.put('/files', function(req, res, next) {
    const file = req.body;
    fs.writeFile(userFiles + file.name + '.xml', file.content, (err) => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        } else {
            res.set('Location', userFiles + file.name);
            res.status(200);
            res.send(file);
        }
    });
});
// Configure Storage
var storage = multer.diskStorage({

    // Setting directory on disk to save uploaded files
    destination: function(req, file, cb) {
        cb(null, 'my_uploaded_files')
    },

    // Setting name of file saved
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.' + fileExtension(file.originalname))
    }
});
var upload = multer({
    storage: storage,
    limits: {
        // Setting Image Size Limit to 2MBs
        fileSize: 2000000
    },

    fileFilter(req, file, cb) {
        console.log('storage', storage);
        console.log('req', req);
        console.log('file', file);
        if (!file.originalname.match(/\.(xml|jpeg|png|txt)$/)) {
            //Error
            cb(new Error('Please upload JPG and PNG images only!'))
        }
        //Success
        cb(undefined, true)
    }
})
app.post('/uploadfile', upload.single('uploadedImage'), (req, res, next) => {
    const file = req.file
    if (!file) {
        console.log('file', file);
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400
        return next(error)
    }


    fs.writeFileSync('new-file.xml', 'First NodeJs Code!');
    res.status(200).send({
        statusCode: 200,
        status: 'success',
        uploadedFile: file
    })

}, (error, req, res, next) => {
    console.log('error', error);
    res.status(400).send({
        error: error.message
    })
})

app.listen(3000, () => console.log('Server started on port 3000'));