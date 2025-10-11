import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn, BeforeInsert } from "typeorm";
import { v4 as uuidv4 } from 'uuid';
import { User } from "./User";

export const allowedFilter: Array<string> = ['user_from', 'user_to', 'is_private']

export const allowedSort: Array<string> = ['created_at']

@Entity({ name: "message_history" })
export class MessageHistory extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    user_from: string

    @Column()
    user_to: string

    @Column({ default: false })
    is_private: boolean

    @Column({ default: false })
    is_favorited: boolean

    @Column()
    message: string

    @Column()
    created_by: string

    @Column()
    created_at: Date

    @Column({ select: false })
    deleted_by: string

    @Column({ select: false, nullable: true })
    deleted_at: Date

    // Relations
    @ManyToOne(() => User, user => user.sentMessages)
    @JoinColumn({ name: "user_from" })
    sender: User

    @ManyToOne(() => User, user => user.receivedMessages)
    @JoinColumn({ name: "user_to" })
    recipient: User

    @BeforeInsert()
    private beforeInsert() {
        this.id = uuidv4();
    }
}
