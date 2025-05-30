import { Injectable, BadRequestException, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyRelationship } from './entities/company-relationship.entity';
import { Company } from '../companies/entities/company.entity';

@Injectable()
export class RelationshipsService {
  constructor(
    @InjectRepository(CompanyRelationship)
    private readonly relRepo: Repository<CompanyRelationship>,

    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
  ) {}

  async createRelationship(company_code: string, parent_company: string | null) {
    const relationship = this.relRepo.create({
      company_code,
      parent_company,
    });

    return this.relRepo.save(relationship);
  }

  async findAll(
    page: number,
    limit: number,
    sortBy: string,
    order: 'asc' | 'desc',
  ) {
      const skip = (page - 1) * limit;
      const allowedSortFields = ['company_code', 'parent_company'];
      if (!allowedSortFields.includes(sortBy)) sortBy = 'company_code';

      const [data, total] = await this.relRepo.findAndCount({
        skip,
        take: limit,
        order: {
          [sortBy]: order
        },
        relations: ['childCompany', 'parentCompany'],
      });

      return {
        data,
        total,
        page,
        limit,
      };
  }

  async findParentByCode(code: string) {
    const rel = await this.relRepo.findOneBy({ company_code: code });

    if (!rel || !rel.parent_company) {
      return null; 
    }

    return this.companyRepo.findOneBy({ company_code: rel.parent_company });
  }

  async findChildrenByCode(
    code: string,
    page: number,
    limit: number,
    sortBy: string,
    order: 'asc' | 'desc',
  ) {
      const relations = await this.relRepo.findBy({ parent_company: code });
      if (relations.length === 0) {
        return { data: [], total: 0, page, limit };
      }

      const childCodes = relations.map(rel => rel.company_code);

      const allowedSortFields = ['company_code', 'company_name', 'level', 'country', 'city', 'founded_year', 'annual_revenue', 'employees'];
      if (!allowedSortFields.includes(sortBy)) sortBy = 'company_code';
      const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

      const skip = (page - 1) * limit;

      const [data, total] = await this.companyRepo
        .createQueryBuilder('company')
        .where('company.company_code IN (:...codes)', { codes: childCodes })
        .orderBy(`company.${sortBy}`, sortOrder)
        .skip(skip)
        .take(limit)
        .getManyAndCount();

      return {
        data,
        total,
        page,
        limit,
      };
  }

  async updateParent(code: string, newParent: string) {
    const relation = await this.relRepo.findOneBy({ company_code: code });

    if (!relation) {
      throw new NotFoundException(`No relationship found for company ${code}`);
    }

    // Check if the new parent company exists
    const parent = await this.companyRepo.findOneBy({ company_code: newParent });
    if (!parent) {
      throw new BadRequestException(`Parent company ${newParent} does not exist`);
    }

    relation.parent_company = newParent;
    return this.relRepo.save(relation);
  }
  
  async removeRelationship(code: string) {
    const rel = await this.relRepo.findOneBy({ company_code: code });

    if (!rel) {
      throw new BadRequestException(`Relationship with company code ${code} not found.`);
    }

    return this.relRepo.remove(rel);
  }
}
