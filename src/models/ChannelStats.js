const { model, Schema } = require('mongoose');

module.exports = model('channelstatus', new Schema({
    id: String,
    type:Number,
    guild: String,
    format: String,
}))