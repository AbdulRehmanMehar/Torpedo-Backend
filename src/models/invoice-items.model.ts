import { Table, Column, Model, HasMany, DataType, PrimaryKey, ForeignKey, BelongsTo, Unique, HasOne } from 'sequelize-typescript';
import { Product } from './product.model';
import { Tenant } from './tenant.model';

@Table({
  timestamps: true,
  tableName: 'invoice_items'
})
export class InvoiceItem extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID
  })
  id: string;

  @ForeignKey(() => Tenant)
  @Column({
    type: DataType.UUID
  })
  tenantId: string;

  @ForeignKey(() => Product)
  @Column({
    type: DataType.UUID
  })
  productId: string;

  @Column
  price: string; // sell price

  @HasOne(() => Product, 'id')
  product: Product;

  @HasOne(() => Tenant, 'id')
  tenant: Tenant;

}