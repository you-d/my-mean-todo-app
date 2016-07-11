var mongoose = require('mongoose');

var avatarSchema = new mongoose.Schema({
    name: { type:String },
    model: { type:String }.
    level: { type:Number },
    maxHp: { type:Number },
    currentHp: { type:Number },
    maxEn: { type:Number },
    currentEn: { type:Number },
    backpack: { type:Array },
    updated_at: { type: Date, default: Date.now },
    owner: { type:string, trim: true },
});

module.exports = mongoose.model('Avatar', avatarSchema);
