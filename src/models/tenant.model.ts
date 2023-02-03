import { Table, Column, Model, HasMany, DataType, PrimaryKey, BelongsTo, ForeignKey, HasOne } from 'sequelize-typescript';
import { Invoice } from './invoice.model';
import { Payment } from './payments.modal';
import { User } from './user.model';

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

  @Column({
    type: DataType.STRING,
    unique: true,
  })
  name: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID
  })
  adminId: string;

  @HasOne(() => User, 'id')
  admin: User;
}