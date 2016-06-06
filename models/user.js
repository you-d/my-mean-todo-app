var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  email: { type:String, trim: true },
  firstname: { type:String, trim: true },
  lastname: {type:String, trim: true },
  password: { type:String }
});

mongoose.model('User', userSchema);
