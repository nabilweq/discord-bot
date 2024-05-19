const { Schema, model } = require('mongoose');

const ticketSchema = new Schema({
  guild: String,
  category: String
});

module.exports = model('Ticket', ticketSchema);
