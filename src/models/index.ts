import Sequelize from 'sequelize';
import { sequelize } from '../config/db';
import * as config from '../config/config';
import { Invoice } from './invoice.model';
import { Payment } from './payments.modal';
import { Tenant } from './tenant.model';
import { Address } from './address.model';
import { Customer } from './customer.model';
import { InvoiceItem } from './invoice-items.model';

sequelize.addModels([Tenant, Invoice, Payment, Address, Customer, InvoiceItem]);


export { Sequelize, sequelize, Tenant, Invoice, Payment, Address, Customer, InvoiceItem };



