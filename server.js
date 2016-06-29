const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/next_meal';
const app = require(__dirname + '/_server');

app(PORT, MONGODB_URI, () => process.stdout.write('Server up on port ' + PORT + '!\n'));
