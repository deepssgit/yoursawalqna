const express= require("express");
const { append } = require("express/lib/response");

const router = express.Router()

router.get("/",function(req,res){
    res.render("ask-question")
})



const questionModel = require("../models/models.js")


const fs = require('fs');
const path = require('path');

const multer = require('multer');
  
// const upload = multer({ dest: 'uploads/' })

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname + '-' + Date.now())
    }
});
  
var upload = multer({ storage: storage });
  





router.post("/",upload.single("files"),function(req,res){
    const question_cateogary=req.body.cateogaries
    const question_title=req.body.title
    const question_tags=req.body.tags
    const question_details=req.body.details

    var today = new Date();

var dateQuest = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();


const Question = new questionModel({
            title:question_title,
             cateogary:question_cateogary,
             tags:question_tags,
             details:question_details,
             img: {
                data: fs.readFileSync(path.join( 'C:/Users/Anonymous/Desktop/questions/uploads/' + req.file.filename)),
                contentType: 'image/png'
            },
            date:dateQuest
             
})

Question.save()
    // console.log(question_tag);
    // console.log(Question);
    console.log("Question Submitted successfully")
    res.redirect("/questions")
})


router.get("/questions",function(req,res){
    questionModel.find({},function(err,founditems){
        // var thumb = new Buffer(founditems.image.data).toString('base64')

        res.render("questions",{newQuestions:founditems})
        //  console.log(founditems);
    })
   
})

router.post("/questions",function(req,res){
    const QuestionID = req.body.question_details
    console.log(QuestionID);
    questionModel.findOne({_id:QuestionID},function(err,foundOne){
        console.log(foundOne.title);


        res.render("question-details",{Question:foundOne,Answers:foundOne.answers,Questcomments:foundOne.questComment})
        // console.log(Answers);
    })

})

var MongoClient = require('mongodb').MongoClient;

router.post("/answers",function(req,res){
    const Questionid = req.body.answer_details
    // console.log(Questionid);
    const User_answer=req.body.message

    questionModel.findOne({_id:Questionid},function(err,foundOne){

        var today = new Date();

        var dateAns = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        const objid=foundOne._id
        console.log(objid);
        console.log(req.file.filename);
        MongoClient.connect('mongodb://localhost:27017', function(err, client) {
        if(err) throw err;
        var db =client.db("questionsDB")
        var collection = db.collection('questions');
        collection.updateOne({_id:objid},{ $push:{answers:{answer:User_answer,date_answer:dateAns}}})
        console.log(User_answer);
        res.redirect("/questions")

        })
        
    })

    // ,img:{data:fs.readFileSync(path.join( 'C:/Users/Anonymous/Desktop/questions/uploads/' + req.file.filename)),contentType:'image/png'}
})

router.post("/comments",function(req,res){
    const Questionid = req.body.comment_details
    // console.log(Questionid);
    const User_comment=req.body.message_comment

    questionModel.findOne({_id:Questionid},function(err,foundOne){
        const objid=foundOne._id

        var today = new Date();

        var datecomm = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

        MongoClient.connect('mongodb://localhost:27017', function(err, client) {
        if(err) throw err;
        var db =client.db("questionsDB")
        var collection = db.collection('questions');
        collection.updateOne({_id:objid},{ $push:{questComment:{qcommment:User_comment,date_comment:datecomm}}})
        console.log(User_comment);
        res.redirect("/questions")

        })
        
    })

   
})

router.post("/answercomment",function(req,res){
    const Questionid = req.body.answercomment_details
    // console.log(Questionid);
    const User_comment=req.body.messageanswer_comment

    questionModel.findOne({_id:Questionid},function(err,foundOne){
        const objid=foundOne._id
        MongoClient.connect('mongodb://localhost:27017', function(err, client) {
        if(err) throw err;
        var db =client.db("questionsDB")
        var collection = db.collection('questions');
        collection.updateOne({_id:objid},{ $push:{answers:{comment:{commentbody:User_comment}}}})
        console.log(User_comment);
        res.redirect("/questions")

        })
        
    })

   
})

router.post("/search",function(req,res){
    tag=req.body.search_querry
    console.log(tag);
    questionModel.find({title:{$regex:tag,$options:"i"}},function(err,founditems){
        // var thumb = new Buffer(founditems.image.data).toString('base64')

        res.render("questions",{newQuestions:founditems})
        //  console.log(founditems);
    })
   
})

router.post("/upvote",function(req,res){
    qid=req.body.upvote
    console.log(qid);
    questionModel.findOne({_id:qid},function(err,foundOne){
        const objid=foundOne._id
        const upvote=foundOne.upvotes + 1
        MongoClient.connect('mongodb://localhost:27017', function(err, client) {
        if(err) throw err;
        var db =client.db("questionsDB")
        var collection = db.collection('questions');
        collection.updateOne({_id:objid},{ $set:{upvotes:upvote}})
        console.log(upvote);
        res.redirect("/questions")

        })

    })
})

module.exports = router