import { writeFileSync } from "fs";
import { upperFirst } from "lodash";

export function createRequest (object: string, columns: Array<any>) {
    let storeColumn = ``
    let updateColumn = ``

    columns.forEach((column: any) => {
        if (!['id', 'created_by', 'created_at','updated_by', 'updated_at', 'deleted_by', 'deleted_at'].includes(column.column_name)) {
            let dataType = 'string'
            let columnType = '@IsString()'
            let empty = column.is_nullable == 'NO' ? '@IsNotEmpty()' : ``

            if (column.data_type == 'boolean') {
                dataType = 'boolean'
                columnType = '@IsBoolean()'
            } else if (['timestamp', 'time'].includes(column.data_type)) {
                dataType = 'Date'
                columnType = '@IsDateString()'
            } else if (['integer'].includes(column.data_type)) {
                dataType = 'number'
                columnType = '@IsNumber()'                
            }
            
            storeColumn += `\n
    ${empty}
    ${columnType}
    ${column.column_name}: ${dataType}`

            updateColumn += `\n
    ${columnType}
    ${column.column_name}: ${dataType}`
        }
    })

    const storeRequest = 
`
import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsDateString, IsNotEmpty, IsNumber, IsNumberString, IsString, IsUUID, Max, Min, ValidateNested } from "class-validator";


class ${upperFirst(object)}Data {
    ${storeColumn}
}

export default class ${upperFirst(object)}StoreRequest {
    @Type(() => ${upperFirst(object)}Data)
    @ValidateNested()
    @IsNotEmpty()
    data!: ${upperFirst(object)}Data
}
`

    const updateRequest = 
`
import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsDateString, IsNotEmpty, IsNumber, IsNumberString, IsString, IsUUID, Max, Min, ValidateNested } from "class-validator";


class ${upperFirst(object)}Data {
    ${updateColumn}
}

export default class ${upperFirst(object)}UpdateRequest {
    @Type(() => ${upperFirst(object)}Data)
    @ValidateNested()
    @IsNotEmpty()
    data!: ${upperFirst(object)}Data
}
`

    writeFileSync(`${__dirname.replace('/console/generator', '/requests/')}${object}-store-request.ts`, storeRequest, {
        flag: 'w',
    });

    writeFileSync(`${__dirname.replace('/console/generator', '/requests/')}${object}-update-request.ts`, updateRequest, {
        flag: 'w',
    });
}