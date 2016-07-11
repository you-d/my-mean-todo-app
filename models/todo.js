var mongoose = require('mongoose');

var todoSchema = new mongoose.Schema({
    name: { type:String },
    completed: { type:Boolean },
    note: { type:String },
    updated_at: { type: Date, default: Date.now },
    owner: { type:String, trim: true },
});

module.exports = mongoose.model('Todo', todoSchema);
