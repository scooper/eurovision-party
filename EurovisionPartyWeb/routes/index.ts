/*
 * GET home page.
 */
import express = require('express');
const router = express.Router();

router.get('/', (req: express.Request, res: express.Response) => {
    var year = (new Date).getFullYear();
    res.render('index', { title: 'Home', loggedIn: req.session['loggedin'], admin: req.session['admin'], username: req.session['username'], year: year });
});

export default router;