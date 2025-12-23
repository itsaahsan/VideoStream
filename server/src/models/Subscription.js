const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  subscriber: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subscribedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

subscriptionSchema.index({ subscriber: 1, subscribedTo: 1 }, { unique: true });

module.exports = mongoose.model('Subscription', subscriptionSchema);
