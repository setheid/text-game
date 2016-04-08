'use strict';

let express = require('express');
let server = express();

server.use(express.static(`${__dirname}/public`)).listen(3000, () => console.log('server up on 3000'));
