/*
 * GET home page.
 */
import express = require('express');
const router = express.Router();
import { UserDal } from '../common/dal/User';

router.get('/', (req: express.Request, res: express.Response) => {
    res.render('index', { title: 'Home', loggedIn: req.session['loggedin'], admin: req.session['admin'], username: req.session['username'] });
});

// TEST
router.post('/addUserTest', async (req: express.Request, res: express.Response) => {
    var name = req.body.name;
    var username = req.body.username.toLowerCase();
    var password = req.body.password;

    var response = await UserDal.createUser(name, username, password);

    if(response.success) {
        console.log('success!');
    }
});

export default router;