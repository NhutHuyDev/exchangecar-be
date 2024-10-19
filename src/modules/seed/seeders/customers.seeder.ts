import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '@/modules/auth/entities/role.entity';
import { SeederInterface } from '../seeder.interface';
import { AuthCredential } from '@/modules/auth/entities/auth_credential.entity';
import SystemRole from '@/constraints/systemRoles.enum.constraint';
import { hash } from '@/utils/hash.util';
import * as path from 'node:path';
import * as fs from 'fs';
import { Customer } from '@/modules/customer/entities/customer.entity';
import { CustomerWishlist } from '@/modules/customer/entities/customer_wishlist.entity';

@Injectable()
export class CustomersSeeder implements SeederInterface {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository(CustomerWishlist)
    private readonly customerWishlistRepository: Repository<CustomerWishlist>,
    @InjectRepository(AuthCredential)
    private readonly authCredentialRepository: Repository<AuthCredential>,
  ) {}

  async seed() {
    const customerRole = await this.roleRepository.findOne({
      where: {
        role_title: SystemRole.Individual_Customer,
      },
    });

    if (!customerRole) {
      throw new Error('Individual customer role not found in the database');
    }

    const customersPath = path.join(
      __dirname,
      '../../../../docs/mock_data/mock_customers.json',
    );

    const customersJson: {
      first_name: string;
      last_name: string;
      mobile_phone: string;
      email: string;
      password: string;
    }[] = JSON.parse(fs.readFileSync(customersPath, 'utf-8'));

    for (const customerInfo of customersJson) {
      const authCredential = await this.authCredentialRepository.save({
        cred_login: customerInfo.mobile_phone,
        cred_password: hash(customerInfo.password),
        roles: [customerRole],
      });

      const customer = await this.customerRepository.save({
        first_name: customerInfo.first_name,
        last_name: customerInfo.last_name,
        mobile_phone: customerInfo.mobile_phone,
        email: customerInfo.email,
        auth_credential: authCredential,
      });

      await this.customerWishlistRepository.save({
        customer: customer
      })
    }
  }
}
