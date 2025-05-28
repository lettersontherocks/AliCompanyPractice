import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Company {
  @PrimaryColumn()
  company_code: string;

  @Column()
  company_name: string;

  @Column()
  level: string;

  @Column()
  country: string;

  @Column()
  city: string;

  @Column()
  founded_year: number;

  @Column()
  annual_revenue: number;

  @Column()
  employees: number;
}
