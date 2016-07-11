var express = require('express');
var router = express.Router();

var path = require('path');
var mongoose = require('mongoose');

var todoModel = require( path.join(__dirname, '../models/todo') );

/* GET => /todos */
// find all documents
router.get('/', function(req, res, next) {
    todoModel.find(function(err, todos) {
        if(err) return next(err);

        res.json(todos);
    });
});

/* GET => /todos/:id */
// find a document by id
router.get('/:id', function(req, res, next) {
    // Notice that req.params matches the placeholder name we set while
    // defining the route.
    todoModel.findById(req.params.id, function(err, post) {
        if(err) return next(err);
        res.json(post);
    });
});

/* POST => /todos */
// create a document
router.post('/', function(req, res, next) {
    todoModel.create(req.body, function(err, post) {
        if(err) return next(err);
        res.json(post);
    });
});

/* PUT => /todos/:id */
// update a document
router.put('/:id', function(req, res, next) {
    todoModel.findByIdAndUpdate(req.params.id, req.body, function(err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* DELETE => /todos/:id */
router.delete('/:id', function(req, res, next) {
    todoModel.findByIdAndRemove(req.params.id, req.body, function(err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

module.exports = router;
