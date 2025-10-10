import { Plant, PlantType } from "../models/Plant";
import { Browse, Pages } from "../../util/types";

interface CreatePlantData {
    name: string;
    type: PlantType;
    description?: string;
    created_by: string;
    updated_by: string;
}

interface UpdatePlantData {
    name?: string;
    type?: PlantType;
    description?: string;
    updated_by: string;
}

interface PlantCondition {
    type?: PlantType;
    name?: string;
    is_active?: boolean;
}

const browse = async (condition: PlantCondition, sort: object, page: Pages): Promise<Browse> => {
    const cleanCondition = Object.fromEntries(
        Object.entries(condition).filter(([_, value]) => value !== undefined)
    );

    const plants: Plant[] = await Plant.find({
        where: cleanCondition,
        take: page.size,
        order: sort,
        skip: page.offset,
    });

    const total: number = await Plant.countBy(cleanCondition);

    return {
        data: plants,
        total
    };
};

const show = async (id: string): Promise<Plant> => {
    const plant = await Plant.findOne({ where: { id } });
    if (!plant) {
        throw new Error("Plant not found");
    }
    return plant;
};

const create = async (data: CreatePlantData): Promise<Plant> => {
    const plant = new Plant();
    Object.assign(plant, data);
    return await plant.save();
};

const update = async (id: string, data: UpdatePlantData): Promise<Plant> => {
    let plant = await Plant.findOne({ where: { id } });
    if (!plant) {
        throw new Error("Plant not found");
    }

    plant.updated_at = new Date()

    Object.assign(plant, data);
    return await plant.save();
};

const remove = async (id: string, deletedBy: string): Promise<void> => {
    const plant = await Plant.findOne({ where: { id } });
    if (!plant) {
        throw new Error("Plant not found");
    }

    plant.deleted_by = deletedBy;
    plant.deleted_at = new Date();
    await plant.save();
};

export default {
    browse,
    show,
    create,
    update,
    remove,
    PlantType
};
