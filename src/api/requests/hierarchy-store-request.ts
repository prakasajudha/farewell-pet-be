
import { Type } from "class-transformer";
import { IsArray,IsOptional, IsBoolean, IsDateString, IsNotEmpty, IsNumber, IsNumberString, IsString, IsUUID, Max, Min, ValidateNested } from "class-validator";

class HierarchyItemData {
    @IsOptional()
    @IsString()
    name: string

    @IsOptional()
    @IsString()
    item: string

}
class hierarchyData {
    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsString()
    type: string

    @Type(() => HierarchyItemData)
    @ValidateNested()
    @IsNotEmpty()
    items!: HierarchyItemData[]
}
 
export default class hierarchyStoreRequest {
    @Type(() => hierarchyData)
    @ValidateNested()
    @IsNotEmpty()
    data!: hierarchyData
}
