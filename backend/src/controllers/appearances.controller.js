import mongoose, { isValidObjectId } from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Appearances } from "../models/appearance.model.js";

const setSettings = asyncHandler(async (res,req) => {

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

        if (!appearance) throw new ApiError(401, "Setting not found!");

        res.status(200).json(new ApiResponse(200, appearance, "Appearance setting updated!"));
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

