/*
 * GET home page.
 */
import express = require('express');
const router = express.Router();

router.get('/', (req: express.Request, res: express.Response) => {
    res.render('index', { title: 'Home', loggedIn: req.session['loggedin'], admin: req.session['admin'], username: req.session['username'] });
});

export default router;