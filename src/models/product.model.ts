import { Table, Column, Model, HasMany, DataType, PrimaryKey, ForeignKey, BelongsTo, Unique, IsNull, HasOne } from 'sequelize-typescript';
import { Tenant } from './tenant.model';

@Table({
  timestamps: true,
  tableName: 'products'
})
export class Product extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID
  })
  id: string;

  @Column
  name: string;

  @Column
  price: number; // purchase price

  @Column
  @IsNull
  width: number; // in meters

  @Column
  @IsNull
  height: number; // in meters

  @ForeignKey(() => Tenant)
  @Column({
    type: DataType.UUID
  })
  tenantId: string;

  @HasOne(() => Tenant)
  tenant: Tenant;

}