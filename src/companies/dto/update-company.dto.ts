import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional } from 'class-validator';

export class UpdateCompanyDto {
  @ApiPropertyOptional({ example: 'C001', description: '公司代码' })
  @IsOptional()
  @IsString()
  company_code?: string;

  @ApiPropertyOptional({ example: 'Future Tech Ltd.', description: '公司名称' })
  @IsOptional()
  @IsString()
  company_name?: string;

  @ApiPropertyOptional({ example: '1', description: '公司等级' })
  @IsOptional()
  @IsString()
  level?: string;

  @ApiPropertyOptional({ example: 'China', description: '国家' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ example: 'Beijing', description: '城市' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: 2010, description: '成立年份' })
  @IsOptional()
  @IsInt()
  founded_year?: number;

  @ApiPropertyOptional({ example: 1000000, description: '年收入' })
  @IsOptional()
  @IsInt()
  annual_revenue?: number;

  @ApiPropertyOptional({ example: 500, description: '员工人数' })
  @IsOptional()
  @IsInt()
  employees?: number;
}
