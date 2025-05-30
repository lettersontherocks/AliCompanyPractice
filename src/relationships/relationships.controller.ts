import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { RelationshipsService } from './relationships.service';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiQuery} from '@nestjs/swagger';
import { CreateRelationshipDto } from './dto/create-relationship.dto';
import { UpdateRelationshipDto } from './dto/update-relationship.dto';

@ApiTags('relationships') 
@Controller('relationships')
export class RelationshipsController {
  constructor(private readonly relationshipsService: RelationshipsService) {}

  @ApiOperation({ summary: '创建公司与母公司的关系' })
  @Post()
  create(@Body() dto: CreateRelationshipDto) {
    return this.relationshipsService.createRelationship(dto.company_code, dto.parent_company);
  }

  @ApiOperation({ summary: '获取所有关系数据' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: '页码，从1开始' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: '每页条数' })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['company_code', 'parent_company'],
    description: '排序字段',
  })
  @ApiQuery({
    name: 'order',
    required: false,
    enum: ['asc', 'desc'],
    description: '排序顺序',
  })
  @Get()
  findAll(  @Query('page') page = 1,
            @Query('limit') limit = 10,
            @Query('sortBy') sortBy = 'company_code',
            @Query('order') order: 'asc' | 'desc' = 'asc',
  ) {
    return this.relationshipsService.findAll(page, limit, sortBy, order);
  }

  @ApiOperation({ summary: '获取指定公司对应的母公司' })
  @ApiParam({ name: 'code', description: '子公司代码', example: 'C002' })
  @Get(':code/parent')
  findParent(@Param('code') code: string) {
    return this.relationshipsService.findParentByCode(code);
  }

  @ApiOperation({ summary: '获取指定母公司对应的所有子公司（分页 + 排序）' })
  @ApiParam({ name: 'code', description: '母公司代码', example: 'C001' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: '页码，从1开始' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: '每页条数' })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['company_code', 'company_name', 'founded_year', 'annual_revenue', 'employees'], description: '排序字段' })
  @ApiQuery({ name: 'order', required: false, enum: ['asc', 'desc'], description: '升序或降序' })
  @Get(':code/children')
  findChildren(
    @Param('code') code: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('sortBy') sortBy = 'company_code',
    @Query('order') order: 'asc' | 'desc' = 'asc',
  ) {
    return this.relationshipsService.findChildrenByCode(code, page, limit, sortBy, order);
  }


  @ApiOperation({ summary: '修改某个公司的母公司' })
  @ApiParam({ name: 'code', description: '子公司代码', example: 'C003' })
  @ApiBody({ schema: {
  type: 'object',
  properties: {
    parent_company: { type: 'string', example: 'C001' },
  },
}})
  @Patch(':code/parent')
  updateParent(
    @Param('code') code: string,
    @Body() dto: UpdateRelationshipDto,
  ) {
    return this.relationshipsService.updateParent(code, dto.parent_company);
  }

  @ApiOperation({ summary: '删除某个子公司与母公司的关系' })
  @ApiParam({ name: 'code', description: '子公司代码', example: 'C002' })
  @Delete(':code/parent')
  removeRelationship(@Param('code') code: string) {
    return this.relationshipsService.removeRelationship(code);
  }


}
