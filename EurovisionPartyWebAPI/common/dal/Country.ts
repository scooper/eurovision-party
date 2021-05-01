import mongoose = require('mongoose');
import { DalResponse } from './DalResponse';

var Schema = mongoose.Schema;

var CountrySchema = new Schema({
    countryName: String,
    countryCode: String,
    entryDate: Date,
    updated: { type: Date, default: new Date() }
});

const Country = mongoose.model('Country', CountrySchema);

export class CountryDal {
    public static async createCountry(countryCode: string, countryName: string) {
        var country = new Country({countryCode: countryCode, countryName: countryName, entryDate: new Date()});
        return await country.save()
            .then((obj) => {
                return new DalResponse(obj, true);
            })
            .catch((err) => {
                return new DalResponse(null, false, err.message, err.code);
            });
    }

    // maybe use an is null style, update anything we give it and ignore the other fields
    public static async updateCountry(id: string, countryCode: string, countryName: string) {

        var updateObj: Record<string, any> = { };
        if(countryCode != null) updateObj.countryCode = countryCode;
        if(countryName != null) updateObj.countryName = countryName;

        return await Country.updateOne({_id: id}, updateObj)
            .then((obj) => {
                return new DalResponse(obj, true);
            })
            .catch((err) => {
                return new DalResponse(null, false, err.message, err.code);
            });
    }

    public static async getCountryByName(countryName: string) {

    }

    public static async getCountryByCountryCode(countryCode: string) {

    }

    public static async getCountries() {
        
    }

    public static async getCountriesByPartialName(term: string) {

    }
}