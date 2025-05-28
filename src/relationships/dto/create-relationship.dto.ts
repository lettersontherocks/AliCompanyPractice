import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateRelationshipDto {
  @ApiProperty({ example: 'C002', description: '子公司代码' })
  @IsString()
  company_code: string;

  @ApiProperty({ example: 'C0', description: '母公司代码' })
  @IsString()
  parent_company: string;
}
