const express = require('express');


module.exports = function (app) {
    // set up the routes themselves

    app.get('/', (req, res) => {
        if (req.session.loggedin) {  
            var rooms = app.get("roomcodes"); 
            console.log(rooms);
            if(rooms == undefined){
                res.render('login',{"error": "Invalid code", "player": req.session.username});
            }else{
                if(rooms.indexOf(req.session.roomcode) >= 0){
                    res.render('home',{"player": req.session.username, "roomcode" : req.session.roomcode });
                }else{
                    res.render('login',{"error": "Invalid code", "player": req.session.username});
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
    
 
    app.get('/admin', (req, res) => {
        if (req.session.loggedin && req.session.username == "rosur") {    
            var rooms = app.get("roomcodes");          
            if(req.session.createRoomError != undefined && req.session.createRoomError.length > 0){
                res.render('admin',{"player": req.session.username, "rooms": rooms, "error": req.session.createRoomError});
            }
            else{
                res.render('admin',{"player": req.session.username, "rooms": rooms});
            }
        } else {
            if(req.session.roomcode && req.session.roomcode.length > 0){
                res.redirect("/");
            }else{
                res.render('login');
            }
        }
    });
    
    app.post('/createRoom', function(req, res) {
        var roomcode = req.body.roomcode;
        var rooms = app.get("roomcodes"); 
        req.session.createRoomError = "";       
        if(rooms == undefined){
            app.set('roomcodes', roomcode);              
            res.redirect("/");
        }
        else{
            if(rooms.indexOf(roomcode) >= 0){
                req.session.createRoomError = "Duplicate room code";
                res.redirect("/admin");
            }else{    
                rooms += ", " + roomcode; 
                app.set('roomcodes', rooms);   
                res.redirect("/");
            }
        }
    });
};