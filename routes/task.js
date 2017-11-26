const express = require('express');
const mongoose = require('mongoose');
const router = express.Router(); 
const idea = require('../models/idea')
const { ensureAuthenticated } =require('../helpers/auth');

router.get('/',ensureAuthenticated,(req,res) => { 
    idea.find({user: req.user.id})
    .sort({date:'desc'})
    .then(ideas => { 
        var arraylist = [];
        var chunks = 3;
        for(var i =0;i<ideas.length;i +=chunks){
            arraylist.push(ideas.slice(i,i+chunks));
        }
        res.render('ideas/ideaslist',{
          ideas: arraylist  
        })
    }) 
});

router.get('/add',ensureAuthenticated,(req,res) => {
    res.render("ideas/add")
})

// edit form

router.get('/edit/:id',ensureAuthenticated,(req,res) => {
    idea.findOne({_id:req.params.id}).then(idea => {
        if(idea.user != req.user.id) {
            req.flash('error_msg','Not Authorized');
            res.redirect('/ideas');
        } else {
            res.render("ideas/edit",{
                idea: idea
            }) 
        }
    }) 
})


router.post('/',ensureAuthenticated,(req,res) => {
    let errors = [];

    if(!req.body.title) {
        errors.push({text: 'Please add a title'});
    }
    if(!req.body.details){
        errors.push({text: 'Please add a details'}); 
    }
    if(errors.length > 0 ) {
        res.render('ideas/add',{
            errors: errors,
            title: req.body.title,
            details: req.body.deatils
        });
    } else {
        const ideas = new idea ({
            title: req.body.title,
            details: req.body.details,
            user: req.user.id
        });

        ideas.save().then(ideas => {
        req.flash('success_msg','Task Idea Added.');
            res.redirect('/ideas')
        })
    }
})

router.put('/:id',ensureAuthenticated,(req,res) => {
    idea.findOne({
        _id:req.params.id
    })
    .then(idea => {
        idea.title = req.body.title;
        idea.details = req.body.details;

        idea.save()
        .then(idea => {
        req.flash('success_msg','Task Idea Updated.')
        res.redirect('/ideas')
        })
    });

});

router.delete('/:id',ensureAuthenticated,(req,res) => {
    idea.remove({
        _id: req.params.id
    })
    .then(() => {
        req.flash('success_msg','Task Idea Removed.')
        res.redirect('/ideas');
    })
})

module.exports = router