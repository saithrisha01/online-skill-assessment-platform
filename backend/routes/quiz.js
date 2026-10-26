const express = require("express");

const router = express.Router();



router.get("/", (req,res)=>{


    const questions = [

        {
            id:1,
            question:"Which language is used for web development?",
            options:[
                "HTML",
                "Python",
                "Java"
            ],
            answer:"HTML"
        },


        {
            id:2,
            question:"Which framework is used with Node.js?",
            options:[
                "Express",
                "Django",
                "Flask"
            ],
            answer:"Express"
        },


        {
            id:3,
            question:"Which database is cloud based?",
            options:[
                "MongoDB Atlas",
                "MS Paint",
                "Notepad"
            ],
            answer:"MongoDB Atlas"
        }

    ];


    res.json(questions);


});


module.exports = router;