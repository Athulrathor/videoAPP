import mongoose, { isValidObjectId, Schema } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    
    try {

        const { tweet } = req.body;

        if (!tweet || tweet.trim() == "") {
          throw new ApiError(401, "Oops user tweet is empty!");
        }

        if (!tweet) {
          throw new ApiError(400, "user is not authorized!");
        }

        const createTweetOfUser = await Tweet.create({
          content: tweet,
          owner: req.user._id,
        });

        if (!createTweetOfUser) {
            ApiError(403, "Created tweet is missing!");
        }

        return res.status(200).json(new ApiResponse(200, createTweetOfUser, "Tweet is created successfully!"));
        
    } catch (error) {
        throw new ApiError(500,error.message, "Error in the create tweet section!");
    }
});

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    
    try {

        const userId = req.user._id;

        const getTweet = await Tweet.find({
            owner: userId
        });

        if (!getTweet) {
            throw new ApiError(400, "User tweet not found!");
        }

        return res.status(200).json(new ApiResponse(200, getTweet, "Tweet are fetched successfully!"));

    } catch (error) {
      throw new ApiError(500, "Error in the getting the tweet!");
    }
});

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    
    try {

        const { tweetId } = req.params;

        const { newTweet } = req.body;

        if (!tweetId) {
          throw new ApiError(400, "Tweet id is missing!");
        }

        if (!newTweet) {
            throw new ApiError(400, "New tweet is missing!");
        }

        const updateTweetOfUser = await Tweet.findOneAndUpdate({ _id:tweetId },
            {
                $set: {
                    content: newTweet,
                }
            }
        );

        // const updateTweetOfUser = await Tweet.aggregate([
        //   {
        //     $match: {
        //       owner: req.user._id,
        //     },
        //   },
        //   {
        //     $set: {
        //       content: newTweet,
        //     },
        //   },
        // ]);

        if (!updateTweetOfUser) {
            throw new ApiError(401, "Error in updating tweet!");
        }

        return res.status(200).json(new ApiResponse(200, updateTweetOfUser, "New tweet updated successfully!"));

    } catch (error) {
      throw new ApiError(500,error.message, "Error in the update tweet!");
    }
});

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    
    try {

        const { tweetId } = req.params;

        const userId = req.user._id;

        if (!userId) {
            throw new ApiError(400, "Error in getting user id!");
        }

        const deleteTweet = await Tweet.deleteOne({ owner: userId,_id:tweetId });

        if (deleteTweet.deletedCount === 1) {
            return res.status(200).json(new ApiResponse(200, deleteTweet, "Tweet is deleted successfully!"));
        }

    } catch (error) {
      throw new ApiError(500, "Error in the delete tweet!");
    }
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
