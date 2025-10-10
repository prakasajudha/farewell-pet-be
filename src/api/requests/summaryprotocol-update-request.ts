
import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsDateString, IsNotEmpty, IsNumber, IsNumberString, IsString, IsUUID, Max, Min, ValidateNested } from "class-validator";


class SummaryProtocolData {
    

    @IsString()
    hierarchy_id: string

    @IsString()
    form_id: string

    @IsString()
    batch_number: string

    @IsBoolean()
    is_active: boolean
}

export default class SummaryProtocolUpdateRequest {
    @Type(() => SummaryProtocolData)
    @ValidateNested()
    @IsNotEmpty()
    data!: SummaryProtocolData
}
