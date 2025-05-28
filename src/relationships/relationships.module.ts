import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RelationshipsService } from './relationships.service';
import { RelationshipsController } from './relationships.controller';
import { CompanyRelationship } from './entities/company-relationship.entity';
import { Company } from '../companies/entities/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyRelationship, Company])],
  controllers: [RelationshipsController],
  providers: [RelationshipsService],
})
export class RelationshipsModule {}
