import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, BeforeInsert, DeleteDateColumn, OneToMany } from "typeorm";
import { v4 as uuidv4 } from 'uuid';
import { MessageHistory } from "./MessageHistory";

export const allowedFilter: Array<string> = []

export const allowedSort: Array<string> = []

@Entity({ name: "users" })
export class User extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    name: string

    @Column({ unique: true })
    email: string

    @Column()
    password: string

    @Column({ default: false })
    is_admin: boolean

    @Column({ default: false })
    is_semi_admin: boolean

    @Column()
    nickname: string

    @Column()
    created_by: string

    @Column()
    created_at: Date

    @Column({ select: false })
    deleted_by: string

    @DeleteDateColumn({ nullable: true, select: false })
    deleted_at: Date

    // Relations
    @OneToMany(() => MessageHistory, message => message.sender)
    sentMessages: MessageHistory[]

    @OneToMany(() => MessageHistory, message => message.recipient)
    receivedMessages: MessageHistory[]

    @BeforeInsert()
    private beforeInsert() {
        this.id = uuidv4();
    }
}
