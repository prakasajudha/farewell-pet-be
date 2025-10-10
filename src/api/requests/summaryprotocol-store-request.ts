
import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsDateString, IsNotEmpty, IsNumber, IsNumberString, IsString, IsUUID, Max, Min, ValidateNested } from "class-validator";


class SummaryProtocolData {
    @IsNotEmpty()
    @IsString()
    form_id: string

    @IsNotEmpty()
    @IsString()
    batch_number: string
}

export default class SummaryProtocolStoreRequest {
    @Type(() => SummaryProtocolData)
    @ValidateNested()
    @IsNotEmpty()
    data!: SummaryProtocolData
}
