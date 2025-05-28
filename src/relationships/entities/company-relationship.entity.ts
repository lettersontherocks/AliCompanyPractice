import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class CompanyRelationship {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 10 })
  company_code: string;


  @Column({ type: 'varchar', length: 10, nullable: true })
  parent_company: string | null;
}
