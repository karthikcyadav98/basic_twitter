const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const passport = require('passport')

//Load model
const Tweet = require('../../models/Tweet')

//Load Tweet validator
const validateTweetInput = require('../../validation/tweet')

//@route GET api/tweets
//@desc Create tweets
//@access public
router.get("/", (req, res) => {
    Tweet.find()
        .sort({ date: -1 })
        .then(tweets => res.json(tweets))
        .catch(err => res.status(404).json({ notweets: "no tweets found" }));
});

//@route GET api/tweets/:id
//@desc Get tweets by id
//@access public
router.get("/:id", (req, res) => {
    Tweet.findById(req.params.id)
        .then(tweets => res.json(tweets))
        .catch(err =>
            res.status(404).json({ notweetfound: "no tweet found of this id" })
        );
});

//@route POST api/tweets
//@desc Create tweets
//@access Private
router.post(
    "/",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        const { errors, isValid } = validateTweetInput(req.body);

        //check validation
        if (!isValid) {
            return res.status(400).json(errors);
        }

        const newTweet = new Tweet({
            text: req.body.text,
            name: req.body.name,
            avatar: req.body.avatar,
            user: req.body.id
        });

        newTweet.save().then(tweet => res.json(tweet));
    }
);

// @route   DELETE api/tweets/:id
// @desc    Delete tweet
// @access  Private
router.delete(
    "/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        Tweet.findByIdAndDelete(req.params.id)
            .then(() => {
                res.json({ success: true });
            })
            .catch(err => res.status(404).json({ tweetnotfound: "No tweet found" }));
    }
);

// @route   POST api/tweets/like/:id
// @desc    Like tweet
// @access  Private
router.post(
    "/like/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        Tweet.findById(req.params.id)
            .then(tweet => {
                if (
                    tweet.likes.filter(like => like.user.toString() === req.user.id)
                        .length > 0
                ) {
                    return res
                        .status(400)
                        .json({ alreadyliked: "User already liked this tweet" });
                }

                // Add user id to likes array
                tweet.likes.unshift({ user: req.user.id });

                tweet.save().then(tweet => res.json(tweet));
            })
            .catch(err => res.status(404).json({ tweetnotfound: "No tweet found" }));
    }
);

// @route   POST api/tweets/unlike/:id
// @desc    Unlike tweet
// @access  Private
router.post(
    "/unlike/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        Tweet.findById(req.params.id)
            .then(tweet => {
                if (
                    tweet.likes.filter(like => like.user.toString() === req.user.id)
                        .length === 0
                ) {
                    return res
                        .status(400)
                        .json({ notliked: "You have not yet liked this tweet" });
                }

                // Get remove index
                const removeIndex = tweet.likes
                    .map(item => item.user.toString())
                    .indexOf(req.user.id);

                // Splice out of array
                tweet.likes.splice(removeIndex, 1);

                // Save
                tweet.save().then(tweet => res.json(tweet));
            })
            .catch(err => res.status(404).json({ tweetnotfound: "No tweet found" }));
    }
);

// @route   POST api/tweets/comment/:id
// @desc    Add comment to tweet
// @access  Private
router.post(
    "/comment/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        const { errors, isValid } = validateTweetInput(req.body);

        // Check Validation
        if (!isValid) {
            // If any errors, send 400 with errors object
            return res.status(400).json(errors);
        }

        Tweet.findById(req.params.id)
            .then(tweet => {
                const newComment = {
                    text: req.body.text,
                    name: req.body.name,
                    avatar: req.body.avatar,
                    user: req.user.id
                };

                // Add to comments array
                tweet.comments.unshift(newComment);

                // Save
                tweet.save().then(tweet => res.json(tweet));
            })
            .catch(err => res.status(404).json({ tweetnotfound: "No tweet found" }));
    }
);

// @route   DELETE api/tweets/comment/:id/:comment_id
// @desc    Remove comment from tweet
// @access  Private
router.delete(
    "/comment/:id/:comment_id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        Tweet.findById(req.params.id)
            .then(tweet => {
                // Check to see if comment exists
                if (
                    tweet.comments.filter(
                        comment => comment._id.toString() === req.params.comment_id
                    ).length === 0
                ) {
                    return res
                        .status(404)
                        .json({ commentnotexists: "Comment does not exist" });
                }

                // Get remove index
                const removeIndex = tweet.comments
                    .map(item => item._id.toString())
                    .indexOf(req.params.comment_id);

                // Splice comment out of array
                tweet.comments.splice(removeIndex, 1);

                tweet.save().then(tweet => res.json(tweet));
            })
            .catch(err => res.status(404).json({ tweetnotfound: "No tweet found" }));
    }
);

module.exports = router;