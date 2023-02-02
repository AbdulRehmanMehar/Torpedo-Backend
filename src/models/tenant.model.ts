import { Table, Column, Model, HasMany, DataType, PrimaryKey, BelongsTo } from 'sequelize-typescript';
import { Invoice } from './invoice.model';
import { Payment } from './payments.modal';

@Table({
  timestamps: true,
  tableName: 'tenants'
})
export class Tenant extends Model {

  @PrimaryKey
  @Column({
    type: DataType.UUID
  })
  id: string;

  @Column
  name: string;
}