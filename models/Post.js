const mongoose = require('mongoose');
const slug = require('slug');

mongoose.Promise = global.Promise;

const postSchema = new mongoose.Schema({
    photo:String,
    title: {
        type: String,
        trim: true,
        required: 'Precisa de um titulo'
    },
    slug:String,
    body:{
        type: String,
        trim: true
    },
    tags: [String],

    add_at: {type: Date, default: Date.now()}

});


postSchema.pre('save', function(next){
    if(this.isModified('title')){

    this.slug = slug(this.title, {lower:true});
    }
    next();
});

module.exports = mongoose.model('Post', postSchema);