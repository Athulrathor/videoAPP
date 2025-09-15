import mongoose, { Schema } from "mongoose";
import MongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


const appearancesSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        theme: { type: String, enum: ['light', 'dark', 'auto'], default: 'light' },
        backgroundType: { type: String, default: 'default' },
        customBackground: { type: String, default: '' },
        fontSize: { type: String, enum: ['small', 'medium', 'large', 'xl'], default: 'medium' },
        fontFamily: { type: String, default: 'inter' },
        layoutDensity: { type: String, enum: ['compact', 'comfortable', 'spacious'], default: 'comfortable' },
        accentColor: { type: String, default: 'blue' },
        animationsEnabled: { type: Boolean, default: true },
        highContrast: { type: Boolean, default: false },
        reducedMotion: { type: Boolean, default: false },
        sidebarStyle: { type: String, default: 'default' }
    },
    {
        timestamps: true,
    }
);


export const Appearances = mongoose.model("Appearances", appearancesSchema);