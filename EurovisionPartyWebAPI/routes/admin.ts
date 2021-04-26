/*
 * GET admin page.
 */
import express = require('express');
const router = express.Router();
import session = require('express-session');
import { UserDal } from '../common/dal/UserDal';
import { PointsHelper } from '../common/helpers/PointsHelper';

router.get('/', (req: express.Request, res: express.Response) => {
    // check user is an admin in session
    if (!req.session['loggedin'] || !req.session['admin']) {
        res.redirect('/');
        return;
    }

    res.render('admin', { title: 'Admin', loggedIn: req.session['loggedin'], admin: req.session['admin'], username: req.session['username']});
});

router.post('/u/create', (req: express.Request, res: express.Response) => {
    // check user is an admin in session
    if (!req.session['loggedin'] || !req.session['admin']) {
        res.redirect('/');
        return;
    }

    // check user is an admin in session
    var rawcountry = req.body.country.toLowerCase();
    var username = rawcountry.split(/\s+/).join('');
    var country = rawcountry.replace(/\w\S*/g, (txt) => { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
    var countrycode = req.body.countrycode.toUpperCase();


    // create user in DB
    UserDal.createUser(username, "2020", country, countrycode);

    res.redirect('/admin');
});

router.get('/results', (req: express.Request, res: express.Response) => {
    // check user is an admin in session
    if (!req.session['loggedin'] || !req.session['admin']) {
        res.redirect('/');
        return;
    }

    res.render('results', { title: 'Results', loggedIn: req.session['loggedin'], admin: req.session['admin'], username: req.session['username'] })
});

router.get('/lock', (req: express.Request, res: express.Response) => {
    // check user is an admin in session
    if (!req.session['loggedin'] || !req.session['admin']) {
        res.redirect('/');
        return;
    }

    res.redirect('/admin');
});

router.post('/api/getfancyresults', async (req: express.Request, res: express.Response) => {
    // check user is an admin in session
    if (!req.session['loggedin'] || !req.session['admin']) {
        res.json({ results: {} });
        return;
    }

    var stepScores = [];
    var countryInfo = {};
    var allCountries = {};
    var users = await UserDal.getUsers();

    // build scores object
    for (var user of users) {
        if (user.points.length != 0) {
            var inverse = PointsHelper.stringArrToInverseMap(user.points);
            stepScores.push({ start: user.country },
                { 7654321: { 7: inverse[7] || 0, 6: inverse[6] || 0, 5: inverse[5] || 0, 4: inverse[4] || 0, 3: inverse[3] || 0, 2: inverse[2] || 0, 1: inverse[1] || 0 } },
                { 8: inverse[8] || 0 },
                { 10: inverse[10] || 0 },
                { 12: inverse[12] || 0 },
                { end: user.country });
            countryInfo[user.countryCode] = { country: user.country, username: user.username, points: inverse }
        }
        allCountries[user.countryCode] = { country: user.country, username: user.username }
    }

    res.json({ stepScores: stepScores, countryInfo: countryInfo, allCountries: allCountries });
});

router.post('/api/getresultsraw', async (req: express.Request, res: express.Response) => {
    // check user is an admin in session
    if (!req.session['loggedin'] || !req.session['admin']) {
        res.json({ results: {}});
        return;
    }

    var countries = new Object();
    var scores = new Object();
    var users = await UserDal.getUsers();

    // probably a better way of doing all this if I'd bother to relook at it

    // build score/country object
    for (var user of users) {
        countries[user.countryCode] = user.country;
        var points = PointsHelper.stringArrToMap(user.points);
        for (let [key, value] of Object.entries(points)) {
            if (!(key in scores)) {
                scores[key] = value;
            }
            else {
                scores[key] = scores[key] + value;
            }
             
        }
    }

    // build an array of all countries and score combined (which will be sortable)
    var results = [];
    for (let [key, value] of Object.entries(countries)) {
        var score = 0;
        if (key in scores)
            score = scores[key];
        results.push([key, value, score]);
    }

    // sort by score Desc
    results.sort((a, b) => {
        return b[2] - a[2];
    });

    res.json({ results: results });
});

export default router;