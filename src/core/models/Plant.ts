import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
import { v4 as uuidv4 } from "uuid";

export enum PlantType {
  TUNAS = "tunas",
  TREE = "tree",
  BUSH = "bush"
}

@Entity("plants")
export class Plant extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string = uuidv4();

  @Column()
  name: string;

  @Column({
    type: "enum",
    enum: PlantType
  })
  type: PlantType;

  @Column({ default: true })
  is_active: boolean;

  @Column()
  created_by: string;

  @Column()
  created_at: Date;

  @Column({ nullable: true })
  updated_by: string | null;

  @Column({ nullable: true })
  updated_at: Date | null;

  @Column({ nullable: true })
  deleted_by: string | null;

  @Column({ nullable: true })
  deleted_at: Date | null;
}
