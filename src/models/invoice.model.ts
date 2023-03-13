import { Table, Column, Model, HasMany, DataType, PrimaryKey, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Customer } from './customer.model';
import { InvoiceItem } from './invoice-items.model';
import { Payment } from './payments.modal';
import { Tenant } from './tenant.model';

@Table({
  timestamps: true,
  tableName: 'invoices'
})
export class Invoice extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @ForeignKey(() => Customer)
  @Column({
    type: DataType.UUID
  })
  customerId: string;

  @Column
  netPayable: number;

  @ForeignKey(() => Tenant)
  @Column({
    type: DataType.UUID
  })
  tenantId: string;

  @BelongsTo(() => Tenant)
  tenant: Tenant;

  @HasMany(() => Payment)
  payments: Payment[];

  @BelongsTo(() => Customer)
  customer: Customer;

  @HasMany(() => InvoiceItem)
  invoiceItems: InvoiceItem[];
}