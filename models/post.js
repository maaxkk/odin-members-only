const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true, maxLength: 250},
    author: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    createdAt: {type: Date},
})

PostSchema.virtual('createdAt_ago').get(function() {
    let dateAgoUnixInSeconds = Math.floor((Date.now() - this.createdAt) / 1000);
    let output;
    let minutes;
    let hours;
    let seconds;
    if (dateAgoUnixInSeconds > (60 * 60)) {
        hours = Math.floor(dateAgoUnixInSeconds / (60 * 60))
        minutes = Math.floor((dateAgoUnixInSeconds - (hours * (60 * 60))) / 60);
        seconds = Math.floor((dateAgoUnixInSeconds - (hours * (60 * 60)) - (minutes * 60)));
        output = `${hours + ' hr'} ${minutes + ' min'} ${seconds + ' sec'} ago`
    } else if (dateAgoUnixInSeconds > 60) {
        minutes = Math.floor(dateAgoUnixInSeconds / 60);
        seconds = Math.floor(dateAgoUnixInSeconds - (minutes * 60));
        output = `${minutes + ' min'} ${seconds} sec ago`
    } else {
        output = `${dateAgoUnixInSeconds + ' sec'} ago`
    }
    return `${output}`
})


module.exports = mongoose.model('Post', PostSchema)
