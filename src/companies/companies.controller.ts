import {
    Controller,
    Post,
    Body,
    Get,
    Param,
    Query,
    Patch,
    Delete  } from '@nestjs/common';
  import { CompaniesService } from './companies.service';
  import { CreateCompanyDto } from './dto/create-company.dto';
  import { UpdateCompanyDto } from './dto/update-company.dto';
  import { ApiTags, ApiOperation, ApiParam, ApiQuery, ApiBody} from '@nestjs/swagger';  
  
  @ApiTags('companies') 
  @Controller('companies')
  export class CompaniesController {
    constructor(private readonly companiesService: CompaniesService) {}
  
    @ApiOperation({ summary: '创建新公司' })
    @ApiBody({ type: CreateCompanyDto })
    @Post()
    create(@Body() dto: CreateCompanyDto) {
      return this.companiesService.create(dto);
    }
  
    @ApiOperation({ summary: '获取所有公司' })
    @ApiBody({ type: UpdateCompanyDto })
    @Get()
    findAll() {
      return this.companiesService.findAll();
    }

    @ApiOperation({ summary: '修改字段' })
    @ApiParam({ name: 'code', description: '公司代码' })
    @ApiBody({ type: UpdateCompanyDto })
    @Patch(':code')
    update(
      @Param('code') code: string,
      @Body() dto: UpdateCompanyDto,
    ) {
      return this.companiesService.update(code, dto);
    }

    @ApiOperation({ summary: '按字段,按数值区间/字段组合查询公司(多字段组合查询）' })
    @ApiQuery({ name: 'founded_year_min', required: false, type: Number })
    @ApiQuery({ name: 'founded_year_max', required: false, type: Number })
    @ApiQuery({ name: 'annual_revenue_min', required: false, type: Number })
    @ApiQuery({ name: 'annual_revenue_max', required: false, type: Number })
    @ApiQuery({ name: 'employees_min', required: false, type: Number })
    @ApiQuery({ name: 'employees_max', required: false, type: Number })
    @ApiQuery({ name: 'level', required: false, type: String })
    @ApiQuery({ name: 'country', required: false, type: String })
    @ApiQuery({ name: 'city', required: false, type: String })
    @Get('query')
    query(@Query() query: Record<string, string>) {
      return this.companiesService.queryCompanies(query);
    }

    @ApiOperation({ summary: '删除指定公司' })
    @ApiParam({ name: 'code', description: '公司代码', example: 'C001' })
    @Delete(':code')
    remove(@Param('code') code: string) {
      return this.companiesService.remove(code);
    }


  }
  