import { Table, Column, Model, HasMany, DataType, PrimaryKey, ForeignKey, BelongsTo, Unique, HasOne } from 'sequelize-typescript';
import { Customer } from './customer.model';
import { Tenant } from './tenant.model';

@Table({
  timestamps: true,
  tableName: 'addresses'
})
export class Address extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID
  })
  id: string;

  @Column
  address: string;

  @ForeignKey(() => Customer)
  @Column({
    type: DataType.UUID
  })
  customerId: Customer;

  @BelongsTo(() => Customer)
  customer: Customer;

  @ForeignKey(() => Tenant)
  @Column({
    type: DataType.UUID
  })
  tenantId: string;

  @HasOne(() => Tenant, 'id')
  tenant: Tenant;

}