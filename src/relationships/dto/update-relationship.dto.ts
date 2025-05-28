import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateRelationshipDto {
  @ApiProperty({ example: 'C003', description: '新的母公司代码' })
  @IsString()
  parent_company: string;
}
