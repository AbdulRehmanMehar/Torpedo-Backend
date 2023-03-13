import Sequelize from 'sequelize';
import * as config from '../config/config';
import { Invoice } from './invoice.model';
import { Payment } from './payments.modal';
import { Tenant } from './tenant.model';
import { Address } from './address.model';
import { Customer } from './customer.model';
import { Product } from './product.model';
import { User } from './user.model';
import { InvoiceItem } from './invoice-items.model';

export { Tenant, Invoice, Payment, Address, Customer, InvoiceItem, Product, User };