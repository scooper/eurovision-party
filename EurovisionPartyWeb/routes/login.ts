/*
 * GET home page.
 */
import express = require('express');
import userhelper = require('../common/dal/UserDal');
const router = express.Router();

router.get('/login', (req: express.Request, res: express.Response) => {
    if (req.session['loggedin']) {
        res.redirect('/');
        return;
    }

    res.render('login', { title: '', loggedIn: req.session['loggedin'], admin: req.session['admin'], username: req.session['username'] });
});


router.post('/login', async (req: express.Request, res: express.Response) => {
    var username: string = req.body.username.toLowerCase();
    var password: string = req.body.password.toLowerCase();

    var user = await userhelper.UserDal.getUser(username);

    if (user != null && user.password == password) {
        req.session['loggedin'] = true;
        req.session['username'] = user.username;
        req.session['admin'] = user.admin;
    }
    // get user, check password, init session

    // redirect to user score page
    res.redirect('/');
});

router.get('/logout', (req: express.Request, res: express.Response) => {
    req.session.destroy((err) => {
        console.log(err);
    });

    res.redirect('/u/login');
});

export default router;