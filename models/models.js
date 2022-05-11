const express = require("express");

const mongoose = require("mongoose")

const questionSchema = new mongoose.Schema({
    title: String,
    cateogary: String,
    tags: [String],
    img:
    {
        data: Buffer,
        contentType: String
    },
    details: String,


    
    answers: [{
        answer: String,
        date_answer: String,
        img:{
            data: Buffer,
            contentType: String
        },
        comment: [
            {
                commentbody:String,
                commentdate:String
            }
        ]
    }]
    ,

    date: String,
    questComment: [{
        qcommment: String,
        date_comment: String
    }
    ],
    upvotes:{
type:Number,
default:0
    },
    downvotes:Number,
})

module.exports = mongoose.model("Question", questionSchema)