import { Table, Column, Model, HasMany, DataType, PrimaryKey, ForeignKey, BelongsTo, Unique, IsNull, HasOne } from 'sequelize-typescript';
import { InvoiceItem } from './invoice-items.model';
import { Tenant } from './tenant.model';

@Table({
  timestamps: true,
  tableName: 'products',
})
export class Product extends Model {
  @PrimaryKey
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column
  name: string;

  @Column
  type: 'Tile' | 'Others';

  @Column
  brand: string;

  @Column
  quality: string;

  @Column
  quantity: number;

  @Column({
    type: DataType.DOUBLE
  })
  price: number; // purchase price

  @Column({
    type: DataType.DOUBLE,
    allowNull: true,
  })
  width: number; // in meters

  @Column({
    type: DataType.DOUBLE,
    allowNull: true,
  })
  height: number; // in meters

  @ForeignKey(() => Tenant)
  @Column({
    type: DataType.UUID,
    references: {
      model: 'tenants',
      key: 'id',
    }
  })
  tenantId: string;

  @BelongsTo(() => Tenant, 'id')
  tenant: Tenant;

}