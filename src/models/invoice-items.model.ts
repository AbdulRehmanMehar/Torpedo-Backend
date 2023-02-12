import { Table, Column, Model, HasMany, DataType, PrimaryKey, ForeignKey, BelongsTo, Unique, HasOne } from 'sequelize-typescript';
import { Invoice } from './invoice.model';
import { Product } from './product.model';
import { Tenant } from './tenant.model';

@Table({
  timestamps: true,
  tableName: 'invoice_items'
})
export class InvoiceItem extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
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


  @ForeignKey(() => Invoice)
  @Column({
    type: DataType.UUID
  })
  invoiceId: string;

  @Column
  price: number; // sell price

  @Column
  quantity: number; // sell price

  @BelongsTo(() => Product)
  product: Product;

  @BelongsTo(() => Tenant)
  tenant: Tenant;

  @BelongsTo(() => Invoice)
  invoice: Invoice;
}