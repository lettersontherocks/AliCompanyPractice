import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './entities/company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
  ) {}

  async create(dto: CreateCompanyDto) {
    const company = this.companyRepo.create(dto);
    return this.companyRepo.save(company);
  }

  async findAll() {
    return this.companyRepo.find();
  }
  
  async update(code: string, dto: UpdateCompanyDto) {
  const company = await this.companyRepo.findOneBy({ company_code: code });

  if (!company) {
    throw new BadRequestException(`Company with code ${code} not found.`);
  }

  const updated = Object.assign(company, dto);

  return this.companyRepo.save(updated);
  }

  async queryCompanies(query: Record<string, string>) {
    const qb = this.companyRepo.createQueryBuilder('company');

    const allowedTextFields = [
      'company_code',
      'company_name',
      'level',
      'country',
      'city',
    ];
    const numericFields = ['founded_year', 'annual_revenue', 'employees'];

    // 字符串处理
    for (const key of allowedTextFields) {
      if (key === 'company_name' && query[key]) {
        qb.andWhere('company.company_name LIKE :name', {
          name: `%${query[key]}%`, // 对于 company_name 字段，使用模糊匹配
        });
      } else if (query[key]) {
        qb.andWhere(`company.${key} = :${key}`, { [key]: query[key] });
      }
    }

    // 对于数值，支持 _min / _max
    for (const field of numericFields) {
      const minKey = `${field}_min`;
      const maxKey = `${field}_max`;

      if (query[minKey]) {
        qb.andWhere(`company.${field} >= :${minKey}`, {
          [minKey]: Number(query[minKey]),
        });
      }
      if (query[maxKey]) {
        qb.andWhere(`company.${field} <= :${maxKey}`, {
          [maxKey]: Number(query[maxKey]),
        });
      }
    }

    return qb.getMany();
  }

  async remove(code: string) {
    const company = await this.companyRepo.findOneBy({ company_code: code });

    if (!company) {
      throw new BadRequestException(`Company with code ${code} not found.`);
    }

    return this.companyRepo.remove(company);
  }
  
}
