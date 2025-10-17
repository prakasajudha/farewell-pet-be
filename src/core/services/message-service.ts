import _ from "lodash";
import { MessageHistory } from "../models/MessageHistory";
import { User } from "../models/User";
import { Browse, Pages } from "../../util/types";
import { parseSortParam } from "../../util/sort";
import configurationService from "./configuration-service";
import emailService from "./email-service";

// Message version constant
const CURR_VERSION = 2;

const browse = async (condition: object, sort: object, page: Pages): Promise<Browse> => {
    const messages: MessageHistory[] = await MessageHistory.find({
        where: condition,
        take: page.size,
        order: sort,
        skip: page.offset,
        relations: ['sender', 'recipient']
    });

    const total: number = await MessageHistory.countBy(condition);

    return {
        data: messages,
        total
    };
};

const getAllNotPrivate = async () => {
    console.log("📬 Getting all non-private messages...");

    const messages = await MessageHistory.find({
        where: { is_private: false },
        relations: ['sender', 'recipient'],
        order: { created_at: 'DESC' }
    });

    console.log(`✅ Found ${messages.length} non-private messages`);

    // Kembalikan data lengkap tapi sembunyikan detail sensitif
    const sanitizedMessages = messages.map(msg => ({
        id: msg.id,
        message: msg.message,
        is_private: msg.is_private,
        is_favorited: msg.is_favorited,
        version: msg.version,
        created_by: msg.created_by,
        created_at: msg.created_at,
        // Sender: tidak perlu kirim nickname karena sudah ada di created_by
        sender: {
            // Tidak ada: id, name, email, nickname
        },
        // Recipient: biarkan nama, sembunyikan nickname
        recipient: {
            name: msg.recipient?.name || "Unknown"
            // Tidak ada: id, email, nickname
        }
    }));

    return sanitizedMessages;
};

const getAllByUser = async (userId: string) => {
    console.log("👤 Getting all messages received by user:", userId);

    const messages = await MessageHistory.find({
        where: { user_to: userId }, // Hanya pesan yang diterima (recipient)
        relations: ['sender', 'recipient'],
        order: { created_at: 'DESC' }
    });

    console.log(`✅ Found ${messages.length} messages received by user ${userId}`);

    // Kembalikan data lengkap tapi sembunyikan detail sensitif
    const sanitizedMessages = messages.map(msg => ({
        id: msg.id,
        message: msg.message,
        is_private: msg.is_private,
        is_favorited: msg.is_favorited,
        version: msg.version,
        created_by: msg.created_by,
        created_at: msg.created_at,
        // Sender: tidak perlu kirim nickname karena sudah ada di created_by
        sender: {
            // Tidak ada: id, name, email, nickname
        },
        // Recipient: biarkan nama, sembunyikan nickname
        recipient: {
            name: msg.recipient?.name || "Unknown"
            // Tidak ada: id, email, nickname
        }
    }));

    return sanitizedMessages;
};

const getFavoritedMessages = async (userId: string) => {
    console.log("⭐ Getting all favorited messages...");

    // Get all messages that are favorited (global favorites)
    const messages = await MessageHistory.find({
        where: { is_favorited: true },
        relations: ['sender', 'recipient'],
        order: { created_at: 'DESC' }
    });

    console.log(`✅ Found ${messages.length} favorited messages`);

    // Kembalikan data lengkap tapi sembunyikan detail sensitif
    const sanitizedMessages = messages.map(msg => ({
        id: msg.id,
        message: msg.message,
        is_private: msg.is_private,
        is_favorited: msg.is_favorited,
        version: msg.version,
        created_by: msg.created_by,
        created_at: msg.created_at,
        // Sender: tidak perlu kirim nickname karena sudah ada di created_by
        sender: {
            // Tidak ada: id, name, email, nickname
        },
        // Recipient: biarkan nama, sembunyikan nickname
        recipient: {
            name: msg.recipient?.name || "Unknown"
            // Tidak ada: id, email, nickname
        }
    }));

    return sanitizedMessages;
};

const createMessage = async (userFromId: string, recipientTo: string, isPrivate: boolean, message: string) => {
    console.log("💬 Creating new message...");
    console.log("👤 From User ID:", userFromId);
    console.log("👤 To User ID:", recipientTo);
    console.log("🔒 Is Private:", isPrivate);
    console.log("📝 Message:", message);

    // Check if message sending is enabled
    try {
        const sendMessageConfig = await configurationService.getByCode('SEND_MESSAGE');
        if (!sendMessageConfig.is_active) {
            console.log("❌ Message sending is disabled");
            throw new Error("Mengirim Pesan sudah di non aktifkan kamu tidak bisa kirim pesan");
        }
        console.log("✅ Message sending is enabled");
    } catch (error: any) {
        if (error.message === "Configuration not found") {
            console.log("❌ SEND_MESSAGE configuration not found");
            throw new Error("Mengirim Pesan sudah di non aktifkan kamu tidak bisa kirim pesan");
        }
        throw error;
    }

    // Check if recipient exists
    const recipient = await User.findOne({ where: { id: recipientTo } });
    if (!recipient) {
        console.log("❌ Recipient not found");
        throw new Error("Recipient not found");
    }

    console.log("✅ Recipient found:", recipient.name);

    // Get sender info for email notification
    const sender = await User.findOne({ where: { id: userFromId } });
    if (!sender) {
        console.log("❌ Sender not found");
        throw new Error("Sender not found");
    }

    console.log("✅ Sender found:", sender.name);

    const newMessage = new MessageHistory();
    newMessage.user_from = userFromId;
    newMessage.user_to = recipientTo;
    newMessage.is_private = isPrivate;
    newMessage.message = message;
    newMessage.created_by = sender.nickname || "Anonymous";
    newMessage.created_at = new Date();
    newMessage.version = CURR_VERSION;

    await newMessage.save();

    console.log("✅ Message created successfully with ID:", newMessage.id);

    // Send email notification for private messages
    if (isPrivate) {
        try {
            console.log("📧 Sending email notification for private message...");
            await emailService.sendPrivateMessageNotification(
                recipient.email,
                recipient.name,
                sender.nickname || "Anonymous"
            );
            console.log("✅ Email notification sent successfully");
        } catch (emailError) {
            console.error("❌ Failed to send email notification:", emailError);
            // Don't throw error here, just log it - message should still be saved
        }
    }

    // Return message without sender details
    const savedMessage = await MessageHistory.findOne({
        where: { id: newMessage.id },
        relations: ['sender', 'recipient']
    });

    // Kembalikan data lengkap tapi sembunyikan detail sensitif
    return {
        id: savedMessage.id,
        message: savedMessage.message,
        is_private: savedMessage.is_private,
        is_favorited: savedMessage.is_favorited,
        version: savedMessage.version,
        created_by: savedMessage.created_by,
        created_at: savedMessage.created_at,
        // Sender: tidak perlu kirim nickname karena sudah ada di created_by
        sender: {
            // Tidak ada: id, name, email, nickname
        },
        // Recipient: biarkan nama, sembunyikan nickname
        recipient: {
            name: savedMessage.recipient?.name || "Unknown"
            // Tidak ada: id, email, nickname
        }
    };
};

const getMessageStats = async (userId: string) => {
    console.log("📊 Getting message statistics for user:", userId);

    // Hitung total pesan private yang diterima
    const totalPrivate = await MessageHistory.count({
        where: {
            user_to: userId,
            is_private: true
        }
    });

    // Hitung total pesan public yang diterima
    const totalPublicReceived = await MessageHistory.count({
        where: {
            user_to: userId,
            is_private: false
        }
    });

    // Hitung total semua pesan public (global)
    const totalPublicGlobal = await MessageHistory.count({
        where: {
            is_private: false
        }
    });

    // Hitung total semua pesan (private + public yang diterima)
    const totalMessages = totalPrivate + totalPublicReceived;

    console.log(`✅ Found ${totalPrivate} private messages, ${totalPublicReceived} public messages received, ${totalPublicGlobal} total public messages globally, and ${totalMessages} total messages for user ${userId}`);

    return {
        total_private: totalPrivate,
        total_public: totalPublicGlobal, // Total public sekarang adalah semua pesan public global
        total: totalMessages
    };
};

const getGlobalMessageStats = async () => {
    console.log("📊 Getting global message statistics...");

    // Hitung total pesan private
    const totalPrivateMessages = await MessageHistory.count({
        where: {
            is_private: true
        }
    });

    // Hitung total pesan public
    const totalPublicMessages = await MessageHistory.count({
        where: {
            is_private: false
        }
    });

    // Hitung total semua pesan
    const totalMessages = await MessageHistory.count();

    console.log(`✅ Found ${totalPrivateMessages} private, ${totalPublicMessages} public, and ${totalMessages} total messages`);

    return {
        total_private_message: totalPrivateMessages,
        total_public_message: totalPublicMessages,
        total_message: totalMessages
    };
};

const toggleFavorite = async (messageId: string, userId: string) => {
    console.log("⭐ Toggling favorite status for message:", messageId, "by user:", userId);

    // Check if message exists
    const message = await MessageHistory.findOne({ where: { id: messageId } });
    if (!message) {
        console.log("❌ Message not found");
        throw new Error("Message not found");
    }

    // User can favorite any message (no authorization check needed)
    // Toggle the favorite status
    message.is_favorited = !message.is_favorited;
    await message.save();

    console.log(`✅ Message ${messageId} favorite status toggled to: ${message.is_favorited}`);

    return {
        id: message.id,
        is_favorited: message.is_favorited,
        message: message.message,
        version: message.version,
        created_by: message.created_by,
        created_at: message.created_at
    };
};

export default {
    browse,
    getAllNotPrivate,
    getAllByUser,
    getFavoritedMessages,
    createMessage,
    getMessageStats,
    getGlobalMessageStats,
    toggleFavorite
};
