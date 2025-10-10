import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, BeforeInsert } from "typeorm";
import { v4 as uuidv4 } from 'uuid';

export const allowedFilter: Array<string> = ['code', 'is_active']

export const allowedSort: Array<string> = ['created_at', 'updated_at']

@Entity({ name: "configurations" })
export class Configuration extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ unique: true })
    code: string

    @Column({ default: false })
    is_active: boolean

    @Column()
    created_by: string

    @Column()
    created_at: Date

    @Column()
    updated_by: string

    @Column()
    updated_at: Date

    @Column({ select: false })
    deleted_by: string

    @Column({ select: false, nullable: true })
    deleted_at: Date

    @BeforeInsert()
    private beforeInsert() {
        this.id = uuidv4();
    }
}
