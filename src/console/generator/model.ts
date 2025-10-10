import { table } from 'console';
import { connection } from './../../lib/database';
import { writeFileSync } from "fs";
import _, { upperFirst } from "lodash";

export async function createModel (object: string, model: string, columns: Array<any>) {

    let filterColumn = `[`
    let entityColumn = ``

    columns.forEach((column: any) => {
        filterColumn += `
            "${column.column_name}",`

        if (!['id', 'created_by', 'created_at','updated_by', 'updated_at', 'deleted_by', 'deleted_at'].includes(column.column_name)) {
            let dataType = 'string'
            let uuid = ''

            if (column.data_type == 'uuid') uuid = '"uuid"'
            
            if (column.data_type == 'boolean') dataType = 'boolean'
            else if (['timestamp', 'time'].includes(column.data_type)) dataType = 'Date'
            else if (['integer'].includes(column.data_type)) dataType = 'number'
            
            entityColumn += `
    @Column(${uuid})
    ${column.column_name}: ${dataType}
    `
        }
    })

    filterColumn += `
        ]`

    const dataModel = `
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, JoinColumn, BeforeInsert, DeleteDateColumn, OneToMany } from "typeorm";
import { v4 as uuidv4 } from 'uuid';

export const allowedFilter: Array<string> = ${filterColumn}

export const allowedSort: Array<string> = ${filterColumn}

@Entity({name : "${model}"})
export class ${upperFirst(object)}s extends BaseEntity{

    @PrimaryGeneratedColumn('uuid')
    id: string
    ${entityColumn}
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

    @DeleteDateColumn({ nullable: true, select: false})
    deleted_at: Date

    @BeforeInsert()
    private beforeInsert() {
        this.id = uuidv4();
    }
}    
    `

    writeFileSync(`${__dirname.replace('/console/generator', '/models/')}${upperFirst(object)}.ts`, dataModel, {
        flag: 'w',
    });
}
