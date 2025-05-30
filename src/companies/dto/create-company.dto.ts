import {
    IsInt,
    IsString,
    IsNumber,
    IsOptional,
    Min,
    MaxLength,
  } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
  
export class CreateCompanyDto {
  @ApiProperty({ example: 'C001', description: '公司代码' })
  @IsString()
  company_code: string;

  @ApiProperty({ example: 'Future Tech Ltd.', description: '公司名称' })
  @IsString()
  company_name: string;

  @ApiProperty({ example: '2', description: '公司等级' })
  @IsString()
  level: string;

  @ApiProperty({ example: 'China', description: '国家' })
  @IsString()
  country: string;

  @ApiProperty({ example: 'Shenzhen', description: '城市' })
  @IsString()
  city: string;

  @ApiProperty({ example: 2015, description: '成立年份' })
  @IsInt()
  founded_year: number;

  @ApiProperty({ example: 1000000, description: '年收入' })
  @IsNumber()
  annual_revenue: number;

  @ApiProperty({ example: 500, description: '员工人数' })
  @IsInt()
  employees: number;
}
  