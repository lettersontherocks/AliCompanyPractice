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

  async findAll(
    page: number,
    limit: number,
    sortBy: string,
    order: 'asc' | 'desc'
  ) {
    const skip = (page - 1) * limit;

    const allowedSortFields = ['company_code', 'company_name', 'level', 'country', 'city', 'annual_revenue', 'employees', 'founded_year'];
    if (!allowedSortFields.includes(sortBy)) {
      sortBy = 'company_code'; 
    }


    const [data, total] = await this.companyRepo.findAndCount({
      skip,
      take: limit,
      order: {
        [sortBy]: order,
      },
    });

    return {
      data,
      total,
      page,
      limit,
    };
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

    const allowedSortFields = [...allowedTextFields, ...numericFields];
    // 分页
    const page = query.page ? Number(query.page) : 1;
    const limit = query.limit ? Number(query.limit) : 10;
    const skip = (page - 1) * limit;

    // 排序
    let sortBy = query.sortBy || 'company_code';
    let order: 'ASC' | 'DESC' = (query.order || 'asc').toUpperCase() as 'ASC' | 'DESC';
    if (!allowedSortFields.includes(sortBy)) sortBy = 'company_code';

    const [data, total] = await qb
      .orderBy(`company.${sortBy}`, order)
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

  async remove(code: string) {
    const company = await this.companyRepo.findOneBy({ company_code: code });

    if (!company) {
      throw new BadRequestException(`Company with code ${code} not found.`);
    }

    return this.companyRepo.remove(company);
  }

  async getCompanyStats(query: Record<string, string | string[]>) {
    const qb = this.companyRepo.createQueryBuilder('company');

    const allowedDims = ['company_code', 'company_name', 'level', 'country', 'city'];
    const numericFields = ['founded_year', 'annual_revenue', 'employees'];

    // dimension
    const dimensionsRaw = query.dimension;
    const dimensions: string[] = Array.isArray(dimensionsRaw) ? dimensionsRaw : [dimensionsRaw];
    const validDims = dimensions.filter(dim => allowedDims.includes(dim));

    if (validDims.length === 0) {
      throw new Error('至少提供一个合法的 dimension 参数');
    }

    qb.select(validDims.map(d => `company.${d}`));
    qb.addSelect('COUNT(*)', 'count');
    validDims.forEach(dim => qb.addGroupBy(`company.${dim}`));

    // filter
    for (const field of numericFields) {
      const minKey = `${field}_min`;
      const maxKey = `${field}_max`;

      if (query[minKey]) {
        qb.andWhere(`company.${field} >= :${minKey}`, { [minKey]: Number(query[minKey]) });
      }
      if (query[maxKey]) {
        qb.andWhere(`company.${field} <= :${maxKey}`, { [maxKey]: Number(query[maxKey]) });
      }
    }
    
    const textFilters = ['country', 'city', 'level'];
    for (const field of textFilters) {
      if (query[field]) {
        qb.andWhere(`company.${field} = :${field}`, { [field]: query[field] });
      }
    }

    return qb.getRawMany();
  }
}
