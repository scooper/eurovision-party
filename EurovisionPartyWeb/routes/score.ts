/*
 * GET scoring page.
 */
import express = require('express');
const router = express.Router();
import { UserDal } from '../common/dal/UserDal';
import { PointsHelper } from '../common/helpers/PointsHelper';

const pointBoxes = [12,10,8,7,6,5,4,3,2,1];

router.get('/', async (req: express.Request, res: express.Response) => {
    if (!req.session['loggedin']) {
        res.redirect('/u/login');
        return;
    }

    var messages = null;
    if ('messages' in req.session) {
        messages = req.session['messages'];
        delete req.session['messages']; // clear error from session
    }

    var currentUser = await UserDal.getUser(req.session['username']);  
    var numCountries = await UserDal.getUserCount();

    res.render('score', { title: currentUser.country, loggedIn: req.session['loggedin'], admin: req.session['admin'], username: req.session['username'], messages: messages, numCountries: numCountries });
});

router.post('/submit', async (req: express.Request, res: express.Response) => {
    if (!req.session['loggedin']) {
        res.redirect('/u/login');
        return;
    }

    var messages = null;
    var map = new Object();
    // go through input boxes and save results
    for (var point of pointBoxes) {
        var result = req.body['_' + point + 'PointBox'];
        if (result == 'NONE')
            continue;
        if (result in map) {
            // this means someone has managed to add a duplicate country, so show error message
            messages = new Object({ errors: ["You cannot submit duplicate countries!"] });
            req.session['messages'] = messages;
            break;
        }
        map[result] = point.toString();
    }

    var currentUser = await UserDal.getUser(req.session['username']);
    // if there has been no messages set (in this case that means no errors)
    if (messages == null) {
        messages = new Object({ info: ["Thank you for submitting!"] });
        req.session['messages'] = messages;
        var stringPoints = PointsHelper.mapToArrString(map);
        await UserDal.updateUser(currentUser._id, stringPoints);
    }

    res.redirect('/score'); 
});

router.post('/api/getcountries', async (req: express.Request, res: express.Response) => {
    var users = await UserDal.getUsers();
    var selectedPoints = new Object();
    var strippedDownUsers = [];
    for (var user of users) {
        if (user.username == req.session['username']) {
            selectedPoints = PointsHelper.stringArrToInverseMap(user.points);
            continue;
        }
        strippedDownUsers.push({
            countryCode: user.countryCode,
            country: user.country,
            username: user.username
        });
    }

    res.json({ users: strippedDownUsers, selected: selectedPoints });
});

export default router;