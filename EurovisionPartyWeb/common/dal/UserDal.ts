var User = require('../models/User')

//username: String,
//password: String,
//country: String,
//countryCode: String,
//admin: Boolean,
//points: [String],
//entryDate: Date,
//updated: { type: Date, default: new Date() }

var userCache = null;

export class UserDal {
    public static createUser(username: string, password: string, country: string, countryCode: string, admin: boolean = false) {
        var user = new User({ username: username, password: password, country: country, countryCode: countryCode, admin: admin, entryDate: new Date() });
        user.save(function (err) {
            if (err) {
                console.error("Error creating user: ", err);
            } else {
                console.log("User sucessfully created.");
            }
        });
    }

    public static updateUser(id: string, points: string[]) {
        // update user points
        User.updateOne({ _id: id }, { points: points }, (err) => {
            console.log(err);
        });
    }

    public static async getUser(name: string) {
        return await User.findOne({ 'username': name }).exec();
    }

    public static async getUsers() {
        
        var results = await User.find().sort('country').exec();
        return results;
    }
}
