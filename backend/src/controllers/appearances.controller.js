import mongoose, { isValidObjectId } from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Appearances } from "../models/appearance.model.js";
import { json } from "express";

const setSettings = asyncHandler(async (req,res) => {
    try {
        const { theme, backgroundType, customBackground, fontSize, fontFamily, layoutDensity, accentColor, animationsEnabled, highContrast, reducedMotion, sidebarStyle } = req.body;

        const appearance = await Appearances.findOneAndUpdate(
            { userId: req.user._id }, {
            $set: {
                theme: theme,
                backgroundType: backgroundType,
                customBackground: customBackground,
                fontSize: fontSize,
                fontFamily: fontFamily,
                layoutDensity: layoutDensity,
                accentColor: accentColor,
                animationsEnabled: animationsEnabled,
                highContrast: highContrast,
                reducedMotion: reducedMotion,
                sidebarStyle: sidebarStyle,
            }
        },
            { new: true }
        );

        let createNewSetting;

        if (!appearance) {
            createNewSetting = await Appearances.create({
                userId: req.user._id,
                theme: theme,
                backgroundType: backgroundType,
                customBackground: customBackground,
                fontSize: fontSize,
                fontFamily: fontFamily,
                layoutDensity: layoutDensity,
                accentColor: accentColor,
                animationsEnabled: animationsEnabled,
                highContrast: highContrast,
                reducedMotion: reducedMotion,
                sidebarStyle: sidebarStyle,
            });
        }
            // throw new ApiError(401, "Setting not found!");

        res.status(200).json(new ApiResponse(200, (!appearance ? createNewSetting : appearance), "Appearance setting updated!"));
    } catch (error) {
        console.log(error);
        throw new ApiError(500, error.message, "Error in getting setting appearances!");
    }
});

const getSettings = asyncHandler(async (req,res) => {

    try {

        const appearance = await Appearances.findOne({ userId: req.user._id });

        if (!appearance) throw new ApiError(401, "Setting not found!");

        res.status(200).json(new ApiResponse(200, appearance, "Appearance setting fetched!"));

    } catch (error) {
        console.log(error);
        throw new ApiError(500, error.message, "Error in getting setting appearances!");
    }
});

export {
    setSettings,
    getSettings
};

