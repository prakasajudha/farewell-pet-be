import _ from "lodash";
import { MessageHistory } from "../models/MessageHistory";
import { User } from "../models/User";
import { Browse, Pages } from "../../util/types";
import { parseSortParam } from "../../util/sort";

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
        created_at: msg.created_at,
        // Sender: sembunyikan nama, biarkan nickname
        sender: {
            nickname: msg.sender?.nickname || "Anonymous"
            // Tidak ada: id, name, email
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
        created_at: msg.created_at,
        // Sender: sembunyikan nama, biarkan nickname
        sender: {
            nickname: msg.sender?.nickname || "Anonymous"
            // Tidak ada: id, name, email
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

    // Check if recipient exists
    const recipient = await User.findOne({ where: { id: recipientTo } });
    if (!recipient) {
        console.log("❌ Recipient not found");
        throw new Error("Recipient not found");
    }

    console.log("✅ Recipient found:", recipient.name);

    const newMessage = new MessageHistory();
    newMessage.user_from = userFromId;
    newMessage.user_to = recipientTo;
    newMessage.is_private = isPrivate;
    newMessage.message = message;
    newMessage.created_by = userFromId;
    newMessage.created_at = new Date();

    await newMessage.save();

    console.log("✅ Message created successfully with ID:", newMessage.id);

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
        created_at: savedMessage.created_at,
        // Sender: sembunyikan nama, biarkan nickname
        sender: {
            nickname: savedMessage.sender?.nickname || "Anonymous"
            // Tidak ada: id, name, email
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
    const totalPublic = await MessageHistory.count({
        where: {
            user_to: userId,
            is_private: false
        }
    });

    // Hitung total semua pesan (private + public)
    const totalMessages = totalPrivate + totalPublic;

    console.log(`✅ Found ${totalPrivate} private messages, ${totalPublic} public messages, and ${totalMessages} total messages for user ${userId}`);

    return {
        total_private: totalMessages, // Total private sekarang termasuk semua pesan (private + public)
        total_public: totalPublic,
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

export default {
    browse,
    getAllNotPrivate,
    getAllByUser,
    createMessage,
    getMessageStats,
    getGlobalMessageStats
};
