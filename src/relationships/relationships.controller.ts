import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete
} from '@nestjs/common';
import { RelationshipsService } from './relationships.service';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
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
  @Get()
  findAll() {
    return this.relationshipsService.findAll();
  }

  @ApiOperation({ summary: '获取指定公司对应的母公司' })
  @ApiParam({ name: 'code', description: '子公司代码', example: 'C002' })
  @Get(':code/parent')
  findParent(@Param('code') code: string) {
    return this.relationshipsService.findParentByCode(code);
  }

  @ApiOperation({ summary: '获取指定母公司对应的所有子公司' })
  @ApiParam({ name: 'code', description: '母公司代码', example: 'C001' })
  @Get(':code/children')
  findChildren(@Param('code') code: string) {
    return this.relationshipsService.findChildrenByCode(code);
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
