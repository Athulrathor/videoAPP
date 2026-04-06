import mongoose, { Schema, Types } from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";

const userSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        fullname: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },

        avatar: { type: String },
        avatarPublicId: { type: String },
        coverImage: { type: String },
        coverImagePublicId: { type: String },

        watchHistory: {
            videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
            shorts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Short" }],
        },

        password: { type: String, select: false },
        refreshToken: { type: String, select: false },

        tokenVersion: { type: Number, default: 0 },

        isEmailVerified: { type: Boolean, default: false, index: true },
        emailVerificationToken: String,
        emailVerificationExpiry: Date,

        passwordResetToken: String,
        passwordResetExpiry: Date,

        passwordHistory: {
            type: [String],
            default: [],
            select: false,
            validate: {
                validator: (v) => v.length <= 5,
                message: "Password history cannot exceed 5 entries",
            },
        },

        backupCodes: {
            type: [
                {
                    code: String,
                    used: { type: Boolean, default: false },
                },
            ],
            select: false,
        },

        trustedDevices: [
            {
                token: String,
                expiresAt: Date,
            },
        ],

        passwordChangedAt: { type: Date, default: undefined, select: false },

        loginAttempts: { type: Number, default: 0 },

        failedLoginAttempts: {
            type: [{
                ip: { type: String, required: true },
                timestamp: { type: Date, default: Date.now },
            }],
            default: [],
            validate: { validator: (v) => v.length <= 10 },
            select: false,
        },

        scheduledDeletion: { type: Boolean, default: false, index: true },
        deletionAt: {
            type: Date,
            default: undefined,
            index: { expireAfterSeconds: 0 },
        },

        role: {
            type: String,
            enum: { values: ["user", "admin"], message: "{VALUE} is not a valid role" },
            default: "user",
        },

        lockUntil: Date,

        twoFactorEnabled: { type: Boolean, default: false },
        twoFactorCode: String,
        twoFactorExpiry: Date,
        twoFactorAttempts: { type: Number, default: 0, select: false },
        twoFactorLastAttempt: Date,

        subscriberCount: {
            type: Number,
            default: 0,
        },

        through: { type: Boolean },

    },
    { timestamps: true }
);

// ─── Indexes ─────────────────────────────────────────────────────────────────
userSchema.index({ email: 1, isEmailVerified: 1 });
userSchema.index({ emailVerificationToken: 1 }, { sparse: true });
userSchema.index({ passwordResetToken: 1 }, { sparse: true });
userSchema.index({ "sessions.sessionId": 1 }, { sparse: true });

// Pre-save: hash password
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Pre-save: password history
userSchema.pre("save", async function () {
    if (this.isModified("password")) {
        const oldUser = await this.constructor
            .findById(this._id)
            .select("+password +passwordHistory");

        if (oldUser?.password) {
            this.passwordHistory = this.passwordHistory ?? [];
            this.passwordHistory.unshift(oldUser.password);
            if (this.passwordHistory.length > 5) {
                this.passwordHistory = this.passwordHistory.slice(0, 5);
            }
        }

        this.passwordChangedAt = new Date();
    }
});

// Methods: password
userSchema.methods.isPasswordCorrect = async function (password) {
    return bcrypt.compare(password, this.password);
};

userSchema.methods.canChangePassword = async function (newPassword) {
    if (!this.passwordHistory?.length) return true;
    for (const oldHash of this.passwordHistory) {
        if (await bcrypt.compare(newPassword, oldHash)) return false;
    }
    return true;
};

// Methods: account lock
userSchema.methods.isLocked = function () {
    return !!(this.lockUntil && this.lockUntil > Date.now());
};

userSchema.methods.invalidateTokens = async function () {
    this.tokenVersion += 1;
    await this.save();
};

userSchema.methods.resetLoginAttempts = async function () {
    this.loginAttempts = 0;
    this.lockUntil = undefined;
    await this.save({ validateBeforeSave: false });
};

userSchema.methods.incrementLoginAttempts = async function () {
    if (this.lockUntil && this.lockUntil < Date.now()) {
        return this.updateOne({
            $set: { loginAttempts: 1 },
            $unset: { lockUntil: 1 },
        });
    }

    const updates = { $inc: { loginAttempts: 1 } };
    if (this.loginAttempts + 1 >= 5 && !this.isLocked()) {
        updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 };
    }

    return this.updateOne(updates);
};

userSchema.methods.generatePasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.passwordResetExpiry = Date.now() + 15 * 60 * 1000;
    return resetToken;
};

userSchema.methods.generateEmailVerificationToken = function () {
    const token = crypto.randomBytes(32).toString("hex");
    this.emailVerificationToken = crypto.createHash("sha256").update(token).digest("hex");
    this.emailVerificationExpiry = Date.now() + 24 * 60 * 60 * 1000;
    return token;
};

userSchema.methods.verifyEmailToken = async function (candidateToken) {
    const hashedToken = crypto.createHash("sha256").update(candidateToken).digest("hex");

    if (this.emailVerificationToken !== hashedToken) throw new Error("Invalid verification token");
    if (this.emailVerificationExpiry < Date.now()) throw new Error("Verification token has expired");

    this.emailVerificationToken = undefined;
    this.emailVerificationExpiry = undefined;
    return true;
};

// Methods: 2FA
userSchema.methods.generateTwoFactorCode = async function () {

    const code = crypto.randomInt(100000, 999999).toString();
    this.twoFactorCode = crypto.createHash("sha256").update(code).digest("hex");
    this.twoFactorExpiry = Date.now() + 5 * 60 * 1000;
    this.twoFactorAttempts = 0;

    await this.save({ validateBeforeSave: false });
    return code;
};

userSchema.methods.verifyOtpTwoFactor = async function (candidateCode) {
    if (!this.twoFactorCode || !this.twoFactorExpiry) throw new Error("No OTP generated");

    if (this.twoFactorExpiry < Date.now()) {
        this.twoFactorCode = undefined;
        this.twoFactorExpiry = undefined;
        await this.save({ validateBeforeSave: false });
        throw new Error("OTP expired");
    }

    if (this.twoFactorLastAttempt &&
        Date.now() - this.twoFactorLastAttempt.getTime() < 60 * 1000) {
        throw new Error("Wait before trying again");
    }

    if (this.twoFactorAttempts >= 5) throw new Error("Too many attempts. Try again later.");

    const hashed = crypto.createHash("sha256").update(candidateCode).digest("hex");

    if (hashed !== this.twoFactorCode) {
        this.twoFactorAttempts += 1;
        this.twoFactorLastAttempt = new Date();
        await this.save({ validateBeforeSave: false });
        return false;
    }

    this.twoFactorCode = undefined;
    this.twoFactorExpiry = undefined;
    this.twoFactorAttempts = 0;
    this.twoFactorLastAttempt = undefined;
    await this.save({ validateBeforeSave: false });
    return true;
};

userSchema.methods.generateBackupCodes = async function () {
    const codes = Array.from({ length: 8 }).map(() => {
        const raw = crypto.randomBytes(4).toString("hex").toUpperCase();

        return {
            raw,
            hashed: crypto.createHash("sha256").update(raw).digest("hex"),
        };
    });

    this.backupCodes = codes.map(c => ({
        code: c.hashed,
        used: false
    }));

    await this.save({ validateBeforeSave: false });

    return codes.map(c => c.raw);
};

userSchema.methods.verifyBackupCode = async function (input) {
    const hashed = crypto.createHash("sha256").update(input).digest("hex");

    const match = this.backupCodes.find(
        c => c.code === hashed && !c.used
    );

    if (!match) return false;

    match.used = true;

    await this.save({ validateBeforeSave: false });

    return true;
};

userSchema.methods.enableTwoFactor = async function () {
    if (this.twoFactorEnabled) throw new Error("2FA already enabled");
    this.twoFactorEnabled = true;
    await this.save({ validateBeforeSave: false });
    return true;
};

userSchema.methods.disableTwoFactor = async function (password) {
    const user = await this.constructor.findById(this._id).select("+password");
    if (!await bcrypt.compare(password, user.password)) throw new Error("Invalid password confirmation");

    this.twoFactorEnabled = false;
    this.twoFactorCode = undefined;
    this.twoFactorExpiry = undefined;
    this.twoFactorAttempts = 0;
    await this.save({ validateBeforeSave: false });
    return true;
};

// ─── Methods: deletion ────────────────────────────────────────────────────────
userSchema.methods.scheduleDeletion = async function (duration) {
    this.scheduledDeletion = true;
    this.deletionAt = new Date(duration);
    this.tokenVersion += 1;
    await this.save();
};

userSchema.methods.cancelDeletion = async function () {
    this.scheduledDeletion = false;
    this.deletionAt = undefined;
    await this.save();
};

userSchema.methods.addTrustedDevice = async function () {
    const token = crypto.randomBytes(32).toString("hex");

    this.trustedDevices.push({
        token,
        expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    await this.save({ validateBeforeSave: false });

    return token;
};

userSchema.methods.isTrustedDevice = function (token) {
    return this.trustedDevices.some(
        (d) => d.token === token && d.expiresAt > Date.now()
    );
};

export const User = mongoose.model("User", userSchema);