import { Table, Column, Model, HasMany, DataType, PrimaryKey, ForeignKey, BelongsTo, Unique, HasOne } from 'sequelize-typescript';
import { Address } from './address.model';
import { Tenant } from './tenant.model';

@Table({
  timestamps: true,
  tableName: 'customers'
})
export class Customer extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID
  })
  id: string;

  @Column
  name: string;

  @Column
  @Unique
  phone: string;

  @ForeignKey(() => Tenant)
  @Column({
    type: DataType.UUID
  })
  tenantId: string;

  @HasOne(() => Tenant)
  tenant: Tenant;

  @HasMany(() => Address)
  address: Address[];

}