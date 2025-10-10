import _ from "lodash";
import { Configuration } from "../models/Configuration";
import { Browse, Pages } from "../../util/types";
import { parseSortParam } from "../../util/sort";

const browse = async (condition: object, sort: object, page: Pages): Promise<Browse> => {
    const configurations: Configuration[] = await Configuration.find({
        where: condition,
        take: page.size,
        order: sort,
        skip: page.offset,
    });

    const total: number = await Configuration.countBy(condition);

    return {
        data: configurations,
        total
    };
};

const getByCode = async (code: string) => {
    console.log("🔧 Getting configuration by code:", code);

    const configuration = await Configuration.findOne({
        where: { code },
        select: ['code', 'is_active'] // Only return code and is_active
    });

    if (!configuration) {
        console.log("❌ Configuration not found");
        throw new Error("Configuration not found");
    }

    console.log("✅ Configuration found:", configuration.code, "- Active:", configuration.is_active);

    return configuration;
};

const updateIsActive = async (code: string, isActive: boolean, updatedBy: string) => {
    console.log("🔧 Updating configuration status...");
    console.log("📝 Code:", code);
    console.log("🔄 New Status:", isActive);
    console.log("👤 Updated By:", updatedBy);

    const configuration = await Configuration.findOne({
        where: { code }
    });

    if (!configuration) {
        console.log("❌ Configuration not found");
        throw new Error("Configuration not found");
    }

    console.log("✅ Configuration found:", configuration.code);
    console.log("📊 Current Status:", configuration.is_active);

    configuration.is_active = isActive;
    configuration.updated_by = updatedBy;
    configuration.updated_at = new Date();

    await configuration.save();

    console.log("✅ Configuration updated successfully");
    console.log("📊 New Status:", configuration.is_active);

    // Return only code and is_active
    return {
        code: configuration.code,
        is_active: configuration.is_active
    };
};

const getAllConfigurations = async () => {
    console.log("🔧 Getting all configurations...");

    const configurations = await Configuration.find({
        select: ['code', 'is_active'], // Only return code and is_active
        order: { created_at: 'DESC' }
    });

    console.log(`✅ Found ${configurations.length} configurations`);

    return configurations;
};

export default {
    browse,
    getAllConfigurations,
    getByCode,
    updateIsActive
};
