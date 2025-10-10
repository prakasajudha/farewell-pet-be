import _ from "lodash";
import { User } from "../models/User";
import { Browse, Pages } from "../../util/types";
import jwt from 'jsonwebtoken';
import { hashPassword, verifyPassword } from "../../util/password";

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // In production, use environment variable
const JWT_EXPIRES_IN = '1d';

const generateToken = (user: User): string => {
    const payload = {
        email: user.email,
        name: user.name,
        id: user.id,
        is_admin: user.is_admin
    };

    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

const browse = async (condition: object, sort: object, page: Pages): Promise<Browse> => {
    const users: User[] = await User.find({
        where: condition,
        take: page.size,
        order: sort,
        skip: page.offset,
    });

    const total: number = await User.countBy(condition);

    return {
        data: users,
        total
    };
};

const login = async (email: string, password: string) => {
    if (!email || !password) {
        throw new Error("Email and password are required");
    }

    const user = await User.findOne({
        where: { email: email },
        select: ['id', 'name', 'email', 'password', 'is_admin', 'nickname'] // Explicitly select password
    });

    if (!user) {
        throw new Error("Invalid credentials");
    }

    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
        throw new Error("Invalid credentials");
    }

    const token = generateToken(user);

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        nickname: user.nickname,
        is_admin: user.is_admin,
        token
    };
};

const register = async (name: string, email: string, password: string, nickname: string) => {
    if (!name || !email || !password || !nickname) {
        throw new Error("All fields are required");
    }

    const existingUser = await User.findOne({
        where: { email: email }
    });

    if (existingUser) {
        throw new Error("Email already exists");
    }

    const hashedPassword = await hashPassword(password);

    const newUser = new User();
    newUser.name = name;
    newUser.email = email;
    newUser.password = hashedPassword;
    newUser.nickname = nickname;
    newUser.is_admin = false;
    newUser.created_by = email;
    newUser.created_at = new Date();

    await newUser.save();

    const token = generateToken(newUser);

    return {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        nickname: newUser.nickname,
        is_admin: newUser.is_admin,
        token
    };
};

const getAllUsers = async () => {
    console.log("👥 Getting all users (name and ID only)...");

    const users = await User.find({
        select: ['id', 'name'] // Hanya ID dan nama
    });

    console.log(`✅ Found ${users.length} users`);

    return users;
};

const getUserById = async (id: string) => {
    const user = await User.findOne({
        where: { id },
        select: ['id', 'name', 'email', 'nickname', 'is_admin', 'created_at', 'created_by']
    });

    if (!user) {
        throw new Error("User not found");
    }

    return user;
};

const changePassword = async (userId: string, oldPassword: string, newPassword: string) => {
    if (!oldPassword || !newPassword) {
        throw new Error("Old password and new password are required");
    }

    console.log("🔄 CHANGE PASSWORD ATTEMPT:");
    console.log("👤 User ID:", userId);
    console.log("🔑 Old Password:", oldPassword);
    console.log("🔑 New Password:", newPassword);

    // Get user with password
    const user = await User.findOne({
        where: { id: userId },
        select: ['id', 'name', 'email', 'password']
    });

    if (!user) {
        console.log("❌ User not found");
        throw new Error("User not found");
    }

    console.log("👤 User found:", user.name);

    // Verify old password
    const isValidOldPassword = await verifyPassword(oldPassword, user.password);
    console.log("✅ Old Password Valid:", isValidOldPassword);

    if (!isValidOldPassword) {
        console.log("❌ Invalid old password");
        throw new Error("Invalid old password");
    }

    // Hash new password
    console.log("🔄 Hashing new password...");
    const hashedNewPassword = await hashPassword(newPassword);
    console.log("🔐 New Hashed Password:", hashedNewPassword);

    // Update password
    user.password = hashedNewPassword;
    await user.save();

    console.log("✅ Password changed successfully");

    return {
        message: "Password changed successfully"
    };
};

export default {
    browse,
    login,
    register,
    getAllUsers,
    getUserById,
    changePassword
};