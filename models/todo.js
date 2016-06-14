var mongoose = require('mongoose');

var todoSchema = new mongoose.Schema({
    name: { type:String },
    completed: { type:Boolean },
    note: { type:String },
    updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Todo', todoSchema);
