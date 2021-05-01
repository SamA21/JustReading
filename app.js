const express = require('express');
const exphbs = require('express-handlebars');
var session = require('express-session');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
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

app.post('/login', function(req, res) {
    var username = req.body.username;
    var roomcode = req.body.roomcode;
    if(username && roomcode){
        if (username.length > 0) {
            req.session.loggedin = true;
            req.session.username = username;      
            req.session.roomcode = roomcode;          
            res.redirect("/");
        } else {
            res.send('Please enter a username');
        }			
    }else {
        res.send('Please enter a username/ roomcode');
    }

});

app.get('/', (req, res) => {
    if (req.session.loggedin) {  
        var rooms = app.get("roomcodes"); 
        console.log(rooms);
        if(rooms == undefined){
            rooms = req.session.roomcode;                
            app.set('roomcodes', rooms);    
            res.render('home',{"player": req.session.username, "roomcode" : req.session.roomcode });
        }else{
            if(rooms.indexOf(req.session.roomcode) >= 0){
                res.render('home',{"player": req.session.username, "roomcode" : req.session.roomcode });
            }
            //else{
            //    rooms += ", " + req.session.roomcode; 
            //    app.set('roomcodes', rooms);    
            //    res.render('home',{"player": req.session.username, "roomcode" : req.session.roomcode });
            //}
        }        
	} else {
        res.render('login');
	}
});

app.get('/admin', (req, res) => {
    if (req.session.loggedin && req.session.username == "rosur") {    
        var rooms = app.get("roomcodes");          
        res.render('admin',{"player": req.session.username, "rooms": rooms});
	} else {
        if(req.session.roomcode && req.session.roomcode.length > 0){
            res.redirect("/");
        }else{
            res.render('login');
        }
	}
});

io.on('connection', (socket) => {
    socket.on('chat message', msg => {
        io.emit('chat message', msg);
    });
});

http.listen(port, () => {
    console.log(`Socket.IO server running at http://localhost:${port}/`);
});
