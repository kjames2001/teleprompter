const express = require('express');
const cors = require('cors');
const multipart = require('connect-multiparty');
const path = require('path');
const fs = require('fs');

const app = express();
const uploadPath = path.join(__dirname, 'uploads');
const port = process.env.PORT || 3000;

app.use(cors());

const multipartMiddleware = multipart();

if (!fs.existsSync(uploadPath)){
    fs.mkdirSync(uploadPath, { recursive: true });
}

app.use(express.static(__dirname));

app.post('/upload', multipartMiddleware, function(req, res) {
    if (!req.files || !req.files.upload) {
        return res.status(400).send('No file uploaded');
    }
    fs.readFile(req.files.upload.path, function (err, data) {
        var newPath = uploadPath + '/' + req.files.upload.name;
        fs.writeFile(newPath, data, function (err) { 
            if (err) {
                console.log({err: err});
                return res.status(500).send('Upload failed');
            }
            if(req.query.command == "QuickUpload"){
                res.send({
                    "uploaded": 1,
                    "fileName": req.files.upload.name,
                    "url": '/uploads/' + req.files.upload.name
                });
            } else {
                var html = "";
                html += "<script type='text/javascript'>";
                html += "    var funcNum = " + req.query.CKEditorFuncNum + ";";
                html += "    var url     = \"/uploads/" + req.files.upload.name + "\";";
                html += "    var message = \"Uploaded file successfully\";";
                html += "    window.parent.CKEDITOR.tools.callFunction(funcNum, url, message);";
                html += "</script>";
                res.send(html);
            }
        });
    });
});

app.use('/uploads', express.static(uploadPath));

app.listen(port, function () {
  console.log('Teleprompter server running on port ' + port);
});
