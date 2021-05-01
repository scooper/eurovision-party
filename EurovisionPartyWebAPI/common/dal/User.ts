import mongoose = require('mongoose');
import bcrypt = require('bcryptjs')
import { DalResponse } from './DalResponse';

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    name: String,
    username: {type: String, unique: true},
    password: String,
    country: {type: Schema.Types.ObjectId, ref: 'Country'},
    admin: Boolean,
    entryDate: Date,
    updated: {type: Date, default: new Date()}
});

const User = mongoose.model('User', UserSchema);

export class UserDal {
    public static async createUser(name: string, username: string, password: string) {

        var hashedPassword = bcrypt.hashSync(password, 8);
        var user = new User({ name: name, username: username, password: hashedPassword, admin: false, entryDate: new Date()});
        return await user.save()
            .then((obj) => {
                return new DalResponse(obj, true);
            })
            .catch((err) => {
                return new DalResponse(null, false, err.message, err.code);
            });
    }

    public static async updateUser(id: string, name: string, username: string, password: string, countryId: string) {
        
        var updateObj: Record<string, any> = { };
        if(name != null) updateObj.name = name;
        if(username != null) updateObj.username = username;
        if(password != null) {
            var hashedPassword = bcrypt.hashSync(password, 8);
            updateObj.password = hashedPassword;
        }
        if(countryId != null) updateObj.country = countryId;

        return await User.updateOne({_id: id}, updateObj)
            .then((obj) => {
                return new DalResponse(obj, true);
            })
            .catch((err) => {
                return new DalResponse(null, false, err.message, err.code);
            });
    }

    public static async getUserByName(name: string) {
        return await User.findOne({'username': name})
            .then((obj) => {
                return new DalResponse(obj, true);
            })
            .catch((err) => {
                return new DalResponse(null, false, err.message, err.code);
            });
    }

    public static async getUsersByPartialName(term: string) {
        return await User.find({name: {$regex: term, $options: "i"}})
            .then((obj) => {
                return new DalResponse(obj, true);
            })
            .catch((err) => {
                return new DalResponse(null, false, err.message, err.code)
            });
    }

    public static async getAllUsers() {  
        return await User.find()
            .sort('name')
            .then((obj) => {
                return new DalResponse(obj, true);
            })
            .catch((err) => {
                return new DalResponse(null, false, err.message, err.code);
            });
    }
}
