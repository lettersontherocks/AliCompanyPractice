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
  import { ApiTags, ApiOperation, ApiParam, ApiQuery, ApiBody, ApiOkResponse} from '@nestjs/swagger';  
  
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
    @ApiQuery({ name: 'page', required: false, type: Number, description: '页码,从1开始' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: '每页条数' })
    @ApiQuery({ name: 'sortBy',
                required: false,
                enum: ['company_code', 'company_name', 'level', 'country', 'city', 'annual_revenue', 'employees', 'founded_year'],
                description: '排序字段' })
    @ApiQuery({ name: 'order', required: false, enum: ['asc', 'desc'], description: '升序或降序' })
    @ApiOkResponse({
      description: '分页公司列表',
      schema: {
        example: {
          data: [{ company_code: 'C001', company_name: 'Alibaba', level: '1', country: 'China', city: 'Hangzhou', founded_year: 1999, annual_revenue: 1000000000, employees: 100000 }],
          total: 100,
          page: 1,
          limit: 10
        }
      }
    })
    @Get()
    findAll(  
      @Query('page') page = 1,
      @Query('limit') limit = 10,
      @Query('sortBy') sortBy: string = 'company_code',
      @Query('order') order: 'asc' | 'desc' = 'asc'
    ) {
      return this.companiesService.findAll(page, limit, sortBy, order);
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
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'sortBy', required: false, enum: ['company_code', 'company_name', 'level', 'country', 'city', 'annual_revenue', 'employees', 'founded_year'] })
    @ApiQuery({ name: 'order', required: false, enum: ['asc', 'desc'] })
    @ApiOkResponse({
      description: '分页公司查询结果',
      schema: {
        example: {
          data: [{ company_code: 'C001', company_name: 'Alibaba', level: '1', country: 'China', city: 'Hangzhou', founded_year: 1999, annual_revenue: 1000000000, employees: 100000 }],
          total: 50,
          page: 1,
          limit: 10
        }
      }
    })
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
    

    @ApiOperation({ summary: '按维度统计公司数量' })
    @ApiQuery({ name: 'dimension', required: true, type: [String], description: '维度字段 level, country ' })
    @ApiQuery({ name: 'founded_year_min', required: false, type: Number })
    @ApiQuery({ name: 'founded_year_max', required: false, type: Number })
    @ApiQuery({ name: 'annual_revenue_min', required: false, type: Number })
    @ApiQuery({ name: 'annual_revenue_max', required: false, type: Number })
    @ApiQuery({ name: 'employees_min', required: false, type: Number })
    @ApiQuery({ name: 'employees_max', required: false, type: Number })
    @ApiQuery({ name: 'country', required: false, type: String })
    @ApiQuery({ name: 'city', required: false, type: String })
    @ApiQuery({ name: 'level', required: false, type: String })
    @ApiOkResponse({
      description: '公司维度聚合结果',
      schema: {
        example: [
          { country: 'China', level: '1', count: 5 },
          { country: 'USA', level: '2', count: 3 },
        ],
      },
    })
    @Get('stats')
    getCompanyStats(@Query() query: Record<string, string | string[]>) {
      return this.companiesService.getCompanyStats(query);
    }

  }
  