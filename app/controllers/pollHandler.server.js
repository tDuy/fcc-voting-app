'use strict';

var mongoose = require("mongoose");
var Poll = require("../models/polls.js");


function PollHandler () {
    this.addPoll = function addPoll(req, res){
        console.log(JSON.stringify(req.body));
        var newPoll = new Poll();
        newPoll.question = req.body.ques;
        newPoll.user_id = req.user.github.id;
        req.body.op.forEach(option => {
            newPoll.options.push({answer: option, count: 0});
        });
        
        
        // {
        //     question: "Are you a dog person or a cat person?",
        //     options: [
        //      {answer: "Dog", count: 2},
        //      {answer: "Cat", count: 4}
        //     ]
        //     };
        newPoll.save(function createPollCallback(err, result){
            if(err)
                throw err;
            console.log("poll created");
            res.end();
        });
        
        // res.end();
    };
    
    this.getPolls = function getPolls(req, res){
        Poll
            .find({ 'user_id': req.user.github.id })
            .exec(function(err, result){
                if(err)
                    throw err;
                res.json(result);
            });
    };
    
    this.getOnePoll = function getOnePoll(req, res){
        console.log(req.params.pid);
        Poll
            .findOne({'_id': mongoose.Types.ObjectId(req.params.pid)})
            .exec((err, result) => {
                if(err)
                    throw err;
                console.log(JSON.stringify(result));
                res.json(result);
            });
    };
    
    this.deletePoll = function deletePoll(req, res){
        var pollId = req.query.pollId;//console.log(pollId);
        Poll
            .findOneAndRemove({'_id': mongoose.Types.ObjectId(pollId) })
            .exec((err, result) => {
                if(err)
                    throw err;
                res.send({status: 'ok'});
            });
    };
    
    this.vote = function vote(req, res){
        var index = req.body.voteid;console.log(index);
        var poll_id = req.params.pid;
        Poll
            .findOne({ '_id': mongoose.Types.ObjectId(poll_id) })
            .exec((err, result) => {
                if(err)
                    throw err;
                result.options[index].count += 1;
                result.save((err, data) => {
                    if(err)
                        throw err;
                    res.json(data);
                });
            });
    };
}

module.exports = PollHandler;