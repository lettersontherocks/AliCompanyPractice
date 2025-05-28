import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompaniesModule } from './companies/companies.module';
import { Company } from './companies/entities/company.entity';
import { RelationshipsModule } from './relationships/relationships.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql', 
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Deemo1over',
      database: 'AliCompany',
      autoLoadEntities: true,
    }),
    CompaniesModule,
    RelationshipsModule,
  ],
})
export class AppModule {}
