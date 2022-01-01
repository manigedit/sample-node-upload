require('dotenv').config();
const express = require('express');
const cors = require('cors')
const morgan = require('morgan');
const PORT = process.env.npm_package_config_port || process.env.PORT || 4008;



const app = module.exports = express();

app.use(express.json())
app.options('*', cors())
app.use(cors())
app.use(morgan('dev'));


app.use('/ping', (req, res) =>{
    res.send('pong');
});


const {singleFileUploadMiddleware, uploadFileTos3 } = require('./utploadUtil');


app.use('/test-upload', singleFileUploadMiddleware, async (req, res) =>{
    console.log('Body is ', req.body);
    console.log('File is ', req.file);
    const resp = await uploadFileTos3(req.file, 'users/data');
    //todo: save this for the user
    res.send({status: 'success', data: {link: resp.Location}})
});


app.listen(PORT, async () => {
    console.log(`App listening started on port ${PORT}`);
});