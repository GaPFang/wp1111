import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const ScoreCardSchema = new Schema({
    name: String,
    subject: String,
    score: {
        type: Number,
        min: 0,
        max: 100
    }
});
const ScoreCard = mongoose.model('ScoreCard', ScoreCardSchema);

export default ScoreCard;