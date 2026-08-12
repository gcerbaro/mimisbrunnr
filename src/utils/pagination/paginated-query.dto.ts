import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, Max, Min } from "class-validator";
import { IPaginatedQuery } from "./paginated.interfaces";

export class PaginatedQueryDto implements IPaginatedQuery{
    @Min(1)
    @IsNumber()
    @ApiProperty({default:1, type: Number})
    page: number = 1;

    @Min(1)
    @Max(500)
    @ApiProperty({default: 100, type: Number, maximum: 500})
    limit: number = 100;
}