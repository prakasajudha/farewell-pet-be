import { DataSource } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { Plant, PlantType } from "../../core/models/Plant";

export class PlantSeeder {
  public async run(dataSource: DataSource): Promise<void> {
    const plantsRepository = dataSource.getRepository(Plant);
    const count = await plantsRepository.count();

    if (count > 0) {
        return;
    }

    const plants: Partial<Plant>[] = [];
    
    // Original 10 plants
    plants.push(
      {
        id: uuidv4(),
        name: "Opuntia ficus-indica",
        type: PlantType.TUNAS,
        is_active: true,
        created_by: "system",
        created_at: new Date(),
        updated_by: null,
        updated_at: null,
        deleted_by: null,
        deleted_at: null
      },
      {
        id: uuidv4(),
        name: "Opuntia engelmannii",
        type: PlantType.TUNAS,
        is_active: true,
        created_by: "system",
        created_at: new Date(),
        updated_by: null,
        updated_at: null,
        deleted_by: null,
        deleted_at: null
      },
      {
        id: uuidv4(),
        name: "Oak Tree",
        type: PlantType.TREE,
        is_active: true,
        created_by: "system",
        created_at: new Date(),
        updated_by: null,
        updated_at: null,
        deleted_by: null,
        deleted_at: null
      },
      {
        id: uuidv4(),
        name: "Pine Tree",
        type: PlantType.TREE,
        is_active: true,
        created_by: "system",
        created_at: new Date(),
        updated_by: null,
        updated_at: null,
        deleted_by: null,
        deleted_at: null
      },
      {
        id: uuidv4(),
        name: "Maple Tree",
        type: PlantType.TREE,
        is_active: true,
        created_by: "system",
        created_at: new Date(),
        updated_by: null,
        updated_at: null,
        deleted_by: null,
        deleted_at: null
      },
      {
        id: uuidv4(),
        name: "Rose Bush",
        type: PlantType.BUSH,
        is_active: true,
        created_by: "system",
        created_at: new Date(),
        updated_by: null,
        updated_at: null,
        deleted_by: null,
        deleted_at: null
      },
      {
        id: uuidv4(),
        name: "Blueberry Bush",
        type: PlantType.BUSH,
        is_active: true,
        created_by: "system",
        created_at: new Date(),
        updated_by: null,
        updated_at: null,
        deleted_by: null,
        deleted_at: null
      },
      {
        id: uuidv4(),
        name: "Nopal Cactus",
        type: PlantType.TUNAS,
        is_active: true,
        created_by: "system",
        created_at: new Date(),
        updated_by: null,
        updated_at: null,
        deleted_by: null,
        deleted_at: null
      },
      {
        id: uuidv4(),
        name: "Redwood Tree",
        type: PlantType.TREE,
        is_active: true,
        created_by: "system",
        created_at: new Date(),
        updated_by: null,
        updated_at: null,
        deleted_by: null,
        deleted_at: null
      },
      {
        id: uuidv4(),
        name: "Lavender Bush",
        type: PlantType.BUSH,
        is_active: true,
        created_by: "system",
        created_at: new Date(),
        updated_by: null,
        updated_at: null,
        deleted_by: null,
        deleted_at: null
      }
    );

    const tunaNames = [
      "Prickly Pear", "Barbary Fig", "Indian Fig", "Bunny Ears Cactus", "Beavertail Cactus",
      "Blind Prickly Pear", "Cactus Apple", "Drooping Prickly Pear", "Engelmann's Prickly Pear", "Fragile Prickly Pear",
      "Klein's Prickly Pear", "Mission Prickly Pear", "Plains Prickly Pear", "Purple Prickly Pear", "Santa Rita Prickly Pear",
      "Spineless Prickly Pear", "Texas Prickly Pear", "Tuberous Prickly Pear", "Wheel Cactus", "Yellow Prickly Pear",
      "Jumping Cholla", "Pencil Cactus", "Golden Barrel Cactus", "Saguaro Cactus", "Organ Pipe Cactus",
      "Fishhook Barrel", "Hedgehog Cactus", "Christmas Cactus", "Easter Cactus", "Star Cactus"
    ];
    
    const treeNames = [
      "Birch Tree", "Cedar Tree", "Cypress Tree", "Elm Tree", "Fir Tree",
      "Hemlock Tree", "Juniper Tree", "Larch Tree", "Magnolia Tree", "Poplar Tree",
      "Spruce Tree", "Sycamore Tree", "Walnut Tree", "Willow Tree", "Ash Tree",
      "Aspen Tree", "Beech Tree", "Cherry Tree", "Chestnut Tree", "Cottonwood Tree",
      "Dogwood Tree", "Hickory Tree", "Linden Tree", "Locust Tree", "Mahogany Tree",
      "Mulberry Tree", "Palm Tree", "Pecan Tree", "Sequoia Tree", "Teak Tree"
    ];
    
    const bushNames = [
      "Azalea Bush", "Boxwood Bush", "Butterfly Bush", "Camellia Bush", "Elderberry Bush",
      "Forsythia Bush", "Gardenia Bush", "Hibiscus Bush", "Holly Bush", "Honeysuckle Bush",
      "Hydrangea Bush", "Juniper Bush", "Lilac Bush", "Oleander Bush", "Privet Bush",
      "Raspberry Bush", "Rhododendron Bush", "Spirea Bush", "Viburnum Bush", "Weigela Bush",
      "Barberry Bush", "Blackberry Bush", "Cranberry Bush", "Gooseberry Bush", "Hazelnut Bush",
      "Quince Bush", "Serviceberry Bush", "Sumac Bush", "Witch Hazel Bush", "Yew Bush"
    ];

    // Add Tunas
    for (let i = 0; i < 30; i++) {
      plants.push({
        id: uuidv4(),
        name: tunaNames[i],
        type: PlantType.TUNAS,
        is_active: true,
        created_by: "system",
        created_at: new Date(),
        updated_by: null,
        updated_at: null,
        deleted_by: null,
        deleted_at: null
      });
    }

    // Add Trees
    for (let i = 0; i < 30; i++) {
      plants.push({
        id: uuidv4(),
        name: treeNames[i],
        type: PlantType.TREE,
        is_active: true,
        created_by: "system",
        created_at: new Date(),
        updated_by: null,
        updated_at: null,
        deleted_by: null,
        deleted_at: null
      });
    }

    // Add Bushes
    for (let i = 0; i < 30; i++) {
      plants.push({
        id: uuidv4(),
        name: bushNames[i],
        type: PlantType.BUSH,
        is_active: true,
        created_by: "system",
        created_at: new Date(),
        updated_by: null,
        updated_at: null,
        deleted_by: null,
        deleted_at: null
      });
    }

    await plantsRepository.save(plants);
  }
}