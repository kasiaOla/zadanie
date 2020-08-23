const express = require('express')
const bodyParser = require('body-parser');
const path = require('path');
var cors = require('cors');
const fs = require('fs')
const app = express();

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(require('body-parser').json({
    type: '*/*'
}));

app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    next();
});
const userFiles = './';
app.use(express.static(path.join(__dirname, 'dist')));
app.use('/files', express.static(userFiles));
app.get('/', function(req, res) {
    res.json({
        message: 'Server Started!'
    });
});

app.post('/get-file', function(req, res, next) {
    const file = req.body;
    fs.writeFile(userFiles + file.name, file.content, (err) => {
        if (err) {
            console.error(err);
            res.sendStatus(500);
        } else {
            res.status(200);
            var filePath = path.join(__dirname) + '/' + file.name;
            res.sendFile(filePath);
        }
    });

});

app.listen(3000, () => console.log('Server started on port 3000'));