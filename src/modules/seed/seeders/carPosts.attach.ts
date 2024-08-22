import { Car } from '@/modules/cars/entities/car.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SeederInterface } from '../seeder.interface';
import { CarGallery } from '@/modules/cars/entities/car_galleries.entity';
import { Customer } from '@/modules/customer/entities/customer.entity';
import { Staff } from '@/modules/staffs/entities/staff.entity';
import { CarPost } from '@/modules/carPosts/entities/car_post.entity';

@Injectable()
export class CarPostsAttach implements SeederInterface {
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
    const staffs = await this.staffRepository.find();

    const carPostsJson = await this.carPostRepository.find();

    for (const postInfo of carPostsJson) {
      postInfo.staff = this.pickRandomStaff(staffs);

      await this.carPostRepository.save(postInfo);
    }
  }

  private pickRandomStaff(customers: Staff[]) {
    return customers[Math.floor(Math.random() * customers.length)];
  }
}
