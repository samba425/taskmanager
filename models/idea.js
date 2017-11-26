const mongoose = require('mongoose');
const schema = mongoose.Schema;

const Idea = new schema({
    title: {
        type: String,required: true
    },
    details: {
        type:String,
        required: true
    }, 
      user: {
        type:String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model("Ideas", Idea);