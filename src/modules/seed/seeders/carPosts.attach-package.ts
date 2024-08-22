import { Car } from '@/modules/cars/entities/car.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SeederInterface } from '../seeder.interface';
import { CarGallery } from '@/modules/cars/entities/car_galleries.entity';
import { Customer } from '@/modules/customer/entities/customer.entity';
import { Staff } from '@/modules/staffs/entities/staff.entity';
import { CarPost } from '@/modules/carPosts/entities/car_post.entity';
import SystemPackageOptions from '@/constraints/systemPackage.enum.constraint';

@Injectable()
export class CarPostsAttachPackage implements SeederInterface {
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
    const carPostsJson = await this.carPostRepository.find();

    for (const postInfo of carPostsJson) {
      postInfo.package_option = this.pickRandomEnumValue(SystemPackageOptions);
      postInfo.total_like = this.getRandomInteger(10, 20);
      postInfo.total_view = this.getRandomInteger(20, 50);

      await this.carPostRepository.save(postInfo);
    }
  }

  private pickRandomEnumValue<T>(enumObj: T): T[keyof T] {
    const enumValues = Object.values(enumObj);
    const randomIndex = Math.floor(Math.random() * enumValues.length);
    return enumValues[randomIndex] as T[keyof T];
  }

  private getRandomInteger(n: number, m: number): number {
    const min = Math.ceil(n);
    const max = Math.floor(m);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
