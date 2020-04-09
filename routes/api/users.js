const express = require('express');
const router = express.Router();
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const keys = require('../../config/keys')
const passport = require('passport')

//Load input validation
const validateLoginInput = require('../../validation/login')
const validateRegisterInput = require('../../validation/register')

//Load user import
const User = require('../../models/User')

//@route POST api/users/register
//@desc Users Registration
//@access Public
router.post('/register', (req, res) => {

    const { errors, isValid } = validateRegisterInput(req.body)

    if (!isValid) {
        return res.status(400).json(errors)
    }

    User.findOne({ email: req.body.email })
        .then(user => {
            if (user) {
                return res.status(400).json({ email: 'Email already registered' })
            } else {
                const avatar = gravatar.url(req.body.email, {
                    s: '200',
                    r: 'pg',
                    d: 'mm'
                })
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                    avatar
                })

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash
                        newUser
                            .save()
                            .then(user => res.json(user))
                            .catch(err => res.json(err))
                    })
                })
            }
        })
})

//@route DELETE api/users/delete
//@desc Users deletion
//@access Public
router.delete(
    "/delete",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        User.findOneAndRemove({ _id: req.user.id })
            .then(() => res.json({ success: true })
                .catch(err => res.json(err))
            );
    }
);

//@route POST api/users/login
//@desc Users Login
//@access Public
router.post('/login', (req, res) => {

    const { errors, isValid } = validateLoginInput(req.body);

    //Check Validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email })
        .then(user => {
            //check user exists
            if (!user) {
                errors.email = 'User not found';
                return res.status(404).json(errors);
            }

            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        //User Matched

                        const payload = {
                            id: user.id,
                            name: user.name,
                            avatar: user.avatar
                        }
                        //Sign Token
                        jwt.sign(
                            payload,
                            keys.secretKey,
                            { expiresIn: 3600 },
                            (err, token) => {
                                res.json({
                                    success: true,
                                    token: 'Bearer ' + token
                                })

                            });
                    } else {
                        errors.password = 'Invalid Password'
                        res.status(400).json(errors)
                    }
                })
        })
})

//@route GET api/users
//@desc Return all users
//@access Private
router.get("/", (req, res) => {
    User.find()
        .sort({ date: -1 })
        .then(users => res.json(users))
        .catch(err => res.status(404).json({ nousers: "no users found" }));
});


//@route GET api/users/current
//@desc Return current user
//@access Private
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json(req.user);
})

module.exports = router;