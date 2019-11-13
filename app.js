//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
mongoose.connect('mongodb://localhost:27017/Dragonballs',{useNewUrlParser: true});

const dragonBallSchema = {
    _id: Number,
    title: String,
    description: String,
    img: String
    
}

const Character = mongoose.model('Character', dragonBallSchema);

app.get('/', function (req,res) {
    res.render('Home')
        
})
///////////////////////Resquests targeting a all characters//////////////////////////////

app.route('/dragonballs')

.get(function(req,res){
    Character.find({}, function(err, foundDragonBalls){
        if (!err) {
            res.send(foundDragonBalls);
            
        }else {
            res.send(err);
        }
        
    })
})
.post(function(req,res){
    const newCharacter = new Character({
        _id: req.body._id,
        title: req.body.title,
        description: req.body.description,
        img: req.body.img
    })

    newCharacter.save(function(err){
        if (!err) {
            res.send('Succesfully added a new character');
            
        }else {
            res.send(err);
        }
    });
})
.delete(function(req,res){
    Character.deleteMany(function(err){
        if (!err) {
            res.send('Succesfully deleted all characters');
            
        }else {
            res.send(err);
        }
    }); 
})

///////////////////////Resquests targeting a specific character//////////////////////////////

app.route('/dragonballs/:characterID')
.get(function(req,res){
    Character.findOne({
        _id: req.params.characterID
    }, function(err,foundCharacter){       
        
        if (foundCharacter) {
            res.send(foundCharacter)
        } else {
            res.send('No character matching your search')
        }
    })
})
.put(function(req,res){
    Character.update(
        {_id: req.params.characterID},
        {_id: req.body._id,title: req.body.title,description: req.body.description, img: req.body.img},
        {overwrite: true},
        function(err) {
            if (!err) {
                res.send('Succesfully updated character')
            }
        }

    )
})
.patch(function(req,res) {
    Character.update(
        {_id:req.params.characterID},
        {$set: req.body},
        function (err) {
            if (!err) {
                res.send('Succesfully updated character');
            } else {
                res.send(err);
            }
        }
    );
})
.delete(function(req,res){
    Character.deleteOne(
        {_id: req.params.characterID},        
        function(err){
        if (!err) {
            res.send('Succesfully deleted this character');
            
        }else {
            res.send(err);
        }
    }); 
})


let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

app.listen(port, function() {
  console.log("Server started succesfully");
});
