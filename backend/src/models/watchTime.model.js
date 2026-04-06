const watchHistorySchema = new Schema({
    user: { type: ObjectId, ref: "User" },
    video: { type: ObjectId, ref: "Video" },

    watchTime: Number,     // seconds watched
    duration: Number,      // total video length
    progress: Number,      // % watched

    completed: Boolean,    // watched > 90%

    lastWatchedAt: Date,
}, { timestamps: true });

// POST /watch/update
// {
//     videoId,
//         watchTime: 120,
//             duration: 300
// }

// engagementScore = watchTime / duration

// score =
//     (watchTimeRatio * 0.4) +
//     (likes * 0.2) +
//     (recency * 0.2) +
//     (similarCategory * 0.2)

// [
//     {
//         $addFields: {
//             score: {
//                 $add: [
//                     { $multiply: ["$views", 0.2] },
//                     { $multiply: ["$likesCount", 0.3] },
//                     {
//                         $divide: [
//                             { $subtract: [new Date(), "$createdAt"] },
//                             1000 * 60 * 60 * 24
//                         ]
//                     }
//                 ]
//             }
//         }
//     },
//     { $sort: { score: -1 } }
// ]

// sort by total views
// trendingScore =
//     (viewsLast24h * 0.6) +
//     (likesLast24h * 0.3) +
//     (commentsLast24h * 0.1)

// videoStats: {
//     views24h: Number,
//         likes24h: Number,
// }

// every 1 hour:
//   update trending scores
//   update category popularity

// userFeedCache[userId] = [videoIds]