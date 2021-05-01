import mongoose = require('mongoose');

var Schema = mongoose.Schema;

// represents what a user (acting as a country) scored for a given date (for the same year)
var ScoreSetSchema = new Schema({
    associatedUser: {type: Schema.Types.ObjectId, ref: "User"},
    associatedCountry: {type: Schema.Types.ObjectId, ref: "Country"},
    points: [String],
    entryDate: Date,
    updated: { type: Date, default: new Date() }
});

const ScoreSet = mongoose.model('ScoreSet', ScoreSetSchema);

// create a scoreset only if a user doesn't have one for that year
// update a scoreset if one exists for that user within a year

export class ScoreSetDal {
    public static createScoreSet() {
        
    }

    public static updateScoreSet() {

    }

    // get a single scoreset via scoreset ID
    public static getScoreSetById(id: string) {

    }

    // get all scoresets scored within a year
    public static getScoreSetsForYear(year: number) {

    }

    // get all the scoresets of a given country ID
    public static getScoreSetsByCountry(id: string) {

    }

    // get all the scoresets of a given user ID
    public static getScoreSetByUser(id: string) {
        
    }
}