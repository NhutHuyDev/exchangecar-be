import { Car, CarOrigin, CarStatus } from '@/modules/cars/entities/car.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SeederInterface } from '../seeder.interface';
import { CarGallery } from '@/modules/cars/entities/car_galleries.entity';
import * as path from 'node:path';
import * as fs from 'fs';
import { Customer } from '@/modules/customer/entities/customer.entity';
import { Staff } from '@/modules/staffs/entities/staff.entity';
import {
  CarPost,
  CarPostStatus,
} from '@/modules/carPosts/entities/car_post.entity';

@Injectable()
export class CarPostsSeeder implements SeederInterface {
  constructor(
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,
    @InjectRepository(CarGallery)
    private readonly carGalleryRepository: Repository<CarGallery>,
    @InjectRepository(CarPost)
    private readonly carPostRepository: Repository<CarPost>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
  ) {}

  async seed() {
    const customers = await this.customerRepository.find();
    const staffs = await this.staffRepository.find();

    const carPostsPath = path.join(
      __dirname,
      '../../../../data/car_posts.json',
    );

    const carPostsJson: {
      car_galleries: string[];
      car_name: string;
      car_brand: string;
      car_model: string;
      car_variant: string;
      manufacturing_date: number;
      body_type: string;
      car_mileage: number;
      transmission: string;
      drivetrain: string;
      engine_type: string;
      out_color: string;
      total_seating: number;
      total_doors: number;
      city: string;
      district: string;
      car_origin: CarOrigin;
      car_status: CarStatus;
      description: string;
      selling_price: number;
      created_at: number;
      posted_at: number;
      expired_at: number;
      post_status: CarPostStatus;
    }[] = JSON.parse(fs.readFileSync(carPostsPath, 'utf-8'));

    for (const postInfo of carPostsJson) {
      const car = await this.carRepository.save({
        car_name: postInfo.car_name,
        car_brand: postInfo.car_brand,
        car_model: postInfo.car_model,
        car_variant: postInfo.car_variant,
        manufacturing_date: postInfo.manufacturing_date,
        body_type: postInfo.body_type,
        car_mileage: postInfo.car_mileage,
        transmission: postInfo.transmission,
        drivetrain: postInfo.drivetrain,
        engine_type: postInfo.engine_type,
        out_color: postInfo.out_color,
        total_seating: postInfo.total_seating,
        total_doors: postInfo.total_doors,
        city: postInfo.city,
        district: postInfo.district,
        car_origin: postInfo.car_origin,
        car_status: postInfo.car_status,
        description: postInfo.description,
        selling_price: postInfo.selling_price,
      });

      for (const carGallery of postInfo.car_galleries) {
        await this.carGalleryRepository.save({
          car: car,
          gallery_url: carGallery,
          file_name: 'seed-image.png',
        });
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const car_post = await this.carPostRepository.save({
        customer: this.pickRandomCustomer(customers),
        staff: this.pickRandomStaff(staffs),
        car: car,
        created_at: new Date(postInfo.created_at * 1000),
        posted_at: new Date(postInfo.posted_at * 1000),
        post_status: postInfo.post_status,
      });
    }
  }

  private pickRandomCustomer(customers: Customer[]) {
    return customers[Math.floor(Math.random() * customers.length)];
  }

  private pickRandomStaff(customers: Staff[]) {
    return customers[Math.floor(Math.random() * customers.length)];
  }
}
