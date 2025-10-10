import { MessageHistory } from "../models/MessageHistory";
import { User } from "../models/User";

const getTopUsersByMessageCount = async () => {
    console.log("🏆 Getting top 5 users by message count...");

    // Query to get top 5 users based on total messages received
    const topUsers = await MessageHistory
        .createQueryBuilder("message")
        .select("message.user_to", "userId")
        .addSelect("COUNT(message.id)", "totalMessages")
        .groupBy("message.user_to")
        .orderBy("COUNT(message.id)", "DESC")
        .limit(5)
        .getRawMany();

    console.log(`✅ Found ${topUsers.length} top users`);

    // Get user details for each top user
    const leaderboard = await Promise.all(
        topUsers.map(async (userData) => {
            const user = await User.findOne({
                where: { id: userData.userId },
                select: ['name'] // Only select name field
            });

            return {
                name: user?.name || "Unknown User",
                total_messages: parseInt(userData.totalMessages)
            };
        })
    );

    console.log("✅ Leaderboard data prepared successfully");
    return leaderboard;
};

export default {
    getTopUsersByMessageCount
};
