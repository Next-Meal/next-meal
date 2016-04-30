
var PORT = process.env.PORT || 3000;
var app = require(__dirname + '/_server.js');

app(PORT, 'mongodb://localhost/user_db', () => console.log('server up on port: ' + PORT));

