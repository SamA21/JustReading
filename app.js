var path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');
var session = require('express-session');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var sass = require('node-sass-middleware');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

app.engine('hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs'
}));

app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(session({secret: "secret key12112"}));
app.use(sass({
        src: __dirname + '/assets/sass', //where the sass files are 
        dest: __dirname + '/assets/css', //where css should go,
        prefix: '/assets/css',  
        outputStyle: 'expanded',
        debug: true // obvious
    })
);   
app.use("/assets", express.static(path.resolve(__dirname, 'assets')));

require("./routes/index")(app);


io.on('connection', (socket) => {
    socket.on('chat message', msg => {
        io.emit('chat message', msg);
    });
});

http.listen(port, () => {
    console.log(`Socket.IO server running at http://localhost:${port}/`);
});
