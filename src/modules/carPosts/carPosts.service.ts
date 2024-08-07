import { InjectRepository } from '@nestjs/typeorm';
import { CarPost, CarPostStatus } from './entities/car_post.entity';
import { DataSource, Repository } from 'typeorm';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CarPostQueryDto } from './dto/query-car-post.dto';
import { CarPostQueriesService } from './carPostQueries.service';
import { mapSortParam } from '@/constraints/sortOptions.constaint';
import { CreateCarPostDto } from './dto/create-car-post.dto';
import { S3Service } from '../s3/s3.service';
import { CarGallery } from '../cars/entities/car_galleries.entity';
import { Customer } from '../customer/entities/customer.entity';
import { Car } from '../cars/entities/car.entity';
import { generateCarSlug } from '@/utils/common.utils';
import { JwtPayload } from '../auth/interfaces/jwtPayload.interface';
import { UpdateCarPostDto } from './dto/update-car-post.dto';
import { PaymentServices } from '../payment/payment.service';

@Injectable()
export class CarPostsServices {
  constructor(
    @InjectRepository(CarPost)
    private carPostRepository: Repository<CarPost>,
    @InjectRepository(Car)
    private carRepository: Repository<Car>,
    @InjectRepository(CarGallery)
    private carGalleryRepository: Repository<CarGallery>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    private dataSource: DataSource,
    private carPostQueriesService: CarPostQueriesService,
    private s3Service: S3Service,
    private paymentServices: PaymentServices,
  ) {}

  async getAllPosts() {
    const query = this.carPostRepository
      .createQueryBuilder('car_post')
      .innerJoinAndSelect('car_post.car', 'car')
      .innerJoinAndSelect('car.car_galleries', 'car_gallery')
      .innerJoinAndSelect('car_post.customer', 'customer');

    const carPosts = await query.getMany();

    return {
      car_posts: carPosts,
    };
  }

  async getPosts(carPostquery: CarPostQueryDto) {
    const query = this.carPostRepository
      .createQueryBuilder('car_post')
      .innerJoinAndSelect('car_post.car', 'car')
      .innerJoinAndSelect('car.car_galleries', 'car_gallery')
      .innerJoinAndSelect('car_post.customer', 'customer');

    /**
     * @description Filter by car_brand
     **/
    carPostquery.car_brand &&
      this.carPostQueriesService.queryByStringValue(
        query,
        'car.car_brand',
        carPostquery.car_brand,
      );

    /**
     * @description Filter by car_model
     **/
    carPostquery.car_model &&
      this.carPostQueriesService.queryByStringValue(
        query,
        'car.car_model',
        carPostquery.car_model,
      );

    /**
     * @description Filter by city
     **/
    carPostquery.city &&
      this.carPostQueriesService.queryByStringValue(
        query,
        'car.city',
        carPostquery.city,
      );

    /**
     * @description Filter by manufacturing_date
     **/
    carPostquery.manufacturing_date &&
      this.carPostQueriesService.queryByRange(
        query,
        'car.manufacturing_date',
        carPostquery.manufacturing_date,
      );

    /**
     * @description Filter by selling_price
     **/
    carPostquery.selling_price &&
      this.carPostQueriesService.queryByRange(
        query,
        'car.selling_price',
        carPostquery.selling_price,
      );

    /**
     * @description Filter by car_origin
     **/
    carPostquery.car_origin &&
      this.carPostQueriesService.queryByStringValue(
        query,
        'car.car_origin',
        carPostquery.car_origin,
      );

    /**
     * @description Filter by car_status
     **/
    carPostquery.car_status &&
      this.carPostQueriesService.queryByStringValue(
        query,
        'car.car_status',
        carPostquery.car_status,
      );

    /**
     * @description Filter by car_mileage
     **/
    carPostquery.car_mileage &&
      this.carPostQueriesService.queryByRange(
        query,
        'car.car_mileage',
        carPostquery.car_mileage,
      );

    /**
     * @description Filter by transmission
     **/
    carPostquery.transmission &&
      this.carPostQueriesService.queryByStringValue(
        query,
        'car.transmission',
        carPostquery.transmission,
      );

    /**
     * @description Filter by car_mileage
     **/
    carPostquery.drivetrain &&
      this.carPostQueriesService.queryByStringValue(
        query,
        'car.drivetrain',
        carPostquery.drivetrain,
      );

    /**
     * @description Filter by engine_type
     **/
    carPostquery.engine_type &&
      this.carPostQueriesService.queryByStringValue(
        query,
        'car.engine_type',
        carPostquery.engine_type,
      );

    /**
     * @description Filter by body_type
     **/
    carPostquery.body_type &&
      this.carPostQueriesService.queryByStringValue(
        query,
        'car.body_type',
        carPostquery.body_type,
      );

    /**
     * @description Filter by out_color
     **/
    carPostquery.out_color &&
      this.carPostQueriesService.queryByStringValue(
        query,
        'car.out_color',
        carPostquery.out_color,
      );

    /**
     * @description Filter by total_seating
     **/
    carPostquery.total_seating &&
      this.carPostQueriesService.queryByNumberValue(
        query,
        'car.total_seating',
        carPostquery.total_seating,
      );

    /**
     * @description Filter by total_doors
     **/
    carPostquery.total_doors &&
      this.carPostQueriesService.queryByNumberValue(
        query,
        'car.total_doors',
        carPostquery.total_doors,
      );

    /**
     * @description Filter by search
     **/
    if (carPostquery.search) {
      const searchValue = carPostquery.search.trim().replace(/\s+/g, '&');
      query.andWhere(
        `to_tsvector('simple', unaccent(car.car_name)) @@ to_tsquery('simple', unaccent(:searchValue)) OR
         to_tsvector('simple', unaccent(car.description)) @@ to_tsquery('simple', unaccent(:searchValue))`,
        { searchValue },
      );
    }

    /**
     * @description Sorting
     **/
    let fieldToOrder = null;
    const order_by = mapSortParam[carPostquery.order_by];
    if (order_by.includes('-')) {
      fieldToOrder = order_by.split('-')[1];
      query.orderBy(fieldToOrder, 'DESC');
    } else {
      fieldToOrder = order_by;
      query.orderBy(fieldToOrder, 'ASC');
    }

    /**
     * @description Pagination
     **/
    const limit = 9;

    const totalCars = await query.getCount();
    const totalPages = Math.ceil(totalCars / limit);

    if (carPostquery.page > totalPages) {
      throw new NotFoundException();
    }

    const carPosts = await query
      .skip(limit * (carPostquery.page - 1))
      .take(limit)
      .getMany();

    return {
      total_cars: totalCars,
      car_posts: carPosts,
      total_pages: totalPages,
      previous_page: carPostquery.page - 1 >= 1 ? carPostquery.page - 1 : null,
      current_page: carPostquery.page,
      next_page:
        carPostquery.page + 1 <= totalPages ? carPostquery.page + 1 : null,
    };
  }

  async getLatestPosts() {
    const query = this.carPostRepository
      .createQueryBuilder('car_post')
      .innerJoinAndSelect('car_post.car', 'car')
      .innerJoinAndSelect('car.car_galleries', 'car_gallery')
      .innerJoinAndSelect('car_post.customer', 'customer');

    const latestPosts = await query
      .orderBy('car_post.posted_at', 'DESC')
      .take(15)
      .getMany();

    return {
      latestPosts: latestPosts,
    };
  }

  async getRelevantPosts(carBrand: string) {
    const query = this.carPostRepository
      .createQueryBuilder('car_post')
      .innerJoinAndSelect('car_post.car', 'car')
      .innerJoinAndSelect('car.car_galleries', 'car_gallery')
      .innerJoinAndSelect('car_post.customer', 'customer');

    carBrand &&
      this.carPostQueriesService.queryByStringValue(
        query,
        'car.car_brand',
        carBrand,
      );

    const relevantPosts = await query
      .orderBy('car_post.posted_at', 'DESC')
      .take(15)
      .getMany();

    return {
      relevantPosts: relevantPosts,
    };
  }

  async getPostByCarSlug(slug: string) {
    const car = await this.carPostRepository.findOne({
      where: {
        car: {
          car_slug: slug,
        },
      },
      relations: {
        car: {
          car_galleries: true,
        },
        customer: true,
      },
    });

    if (car) {
      return car;
    } else {
      throw new NotFoundException();
    }
  }

  async getPostByCustomer(customerId: number, carPostquery: CarPostQueryDto) {
    const query = this.carPostRepository
      .createQueryBuilder('car_post')
      .innerJoinAndSelect('car_post.car', 'car')
      .innerJoinAndSelect('car.car_galleries', 'car_gallery')
      .innerJoinAndSelect('car_post.customer', 'customer')
      .andWhere(`customer.id = ${customerId}`);

    /**
     * @description Sorting
     **/
    let fieldToOrder = null;
    const order_by = mapSortParam[carPostquery.order_by];
    if (order_by.includes('-')) {
      fieldToOrder = order_by.split('-')[1];
      query.orderBy(fieldToOrder, 'DESC');
    } else {
      fieldToOrder = order_by;
      query.orderBy(fieldToOrder, 'ASC');
    }

    /**
     * @description Pagination
     **/
    const limit = 9;

    const totalCars = await query.getCount();
    const totalPages = Math.ceil(totalCars / limit);

    if (carPostquery.page > totalPages) {
      throw new NotFoundException();
    }

    const carPosts = await query
      .skip(limit * (carPostquery.page - 1))
      .take(limit)
      .getMany();

    return {
      total_cars: totalCars,
      car_posts: carPosts,
      total_pages: totalPages,
      previous_page: carPostquery.page - 1 >= 1 ? carPostquery.page - 1 : null,
      current_page: carPostquery.page,
      next_page:
        carPostquery.page + 1 <= totalPages ? carPostquery.page + 1 : null,
    };
  }

  async getAllPostByCustomer(customerId: number) {
    const query = this.carPostRepository
      .createQueryBuilder('car_post')
      .innerJoinAndSelect('car_post.car', 'car')
      .innerJoinAndSelect('car.car_galleries', 'car_gallery')
      .innerJoinAndSelect('car_post.customer', 'customer')
      .andWhere(`customer.id = ${customerId}`);

    const carPosts = await query.getMany();

    return {
      car_posts: carPosts,
    };
  }

  async createDraftCarPost(
    authId: number,
    carInfo: CreateCarPostDto,
    carGallerieFiles: Array<Express.Multer.File>,
  ) {
    // const customer = await this.customerRepository.findOneBy({
    //   auth_credential: {
    //     id: authId,
    //   },
    // });

    // if (!customer) {
    //   throw new BadRequestException();
    // }

    // return await this.dataSource.transaction(async (manager) => {
    //   const car = await manager.save(Car, {
    //     car_name: `xe ${carInfo.car_brand} ${carInfo.car_model} ${carInfo.car_variant} ${carInfo.manufacturing_date}`,
    //     car_brand: carInfo.car_brand,
    //     car_model: carInfo.car_model,
    //     car_variant: carInfo.car_variant,
    //     manufacturing_date: carInfo.manufacturing_date,
    //     car_slug: generateCarSlug(
    //       carInfo.car_brand,
    //       carInfo.car_model,
    //       carInfo.manufacturing_date,
    //     ),
    //     body_type: carInfo.body_type,
    //     car_mileage: carInfo.car_mileage,
    //     transmission: carInfo.transmission,
    //     drivetrain: carInfo.drivetrain,
    //     engine_type: carInfo.engine_type,
    //     out_color: carInfo.out_color,
    //     total_seating: carInfo.total_seating,
    //     total_doors: carInfo.total_doors,
    //     city: carInfo.city,
    //     district: carInfo.district,
    //     car_origin: carInfo.car_origin,
    //     car_status: carInfo.car_status,
    //     description: carInfo.description,
    //     selling_price: carInfo.selling_price,
    //   });

    //   const carGalleryObj = await Promise.all(
    //     carGallerieFiles.map(async (carGallerieFile) => {
    //       const [fileName, fileType] = carGallerieFile.originalname.split('.');

    //       const uniqueFileName =
    //         fileName.split(' ').join('') + '-' + Date.now() + '.' + fileType;

    //       const galleryUrl = await this.s3Service.uploadImageToBucket(
    //         carGallerieFile.buffer,
    //         uniqueFileName,
    //         carGallerieFile.mimetype,
    //       );

    //       return this.carGalleryRepository.create({
    //         gallery_url: galleryUrl,
    //         file_name: uniqueFileName,
    //         car: car,
    //       });
    //     }),
    //   );

    //   const carGalleries = await manager.save(CarGallery, carGalleryObj);

    //   const carPost = await manager.save(CarPost, {
    //     customer: customer,
    //     car: car,
    //     created_at: new Date(),
    //     post_status: CarPostStatus.DRAFT,
    //   });

    // return {
    //   newCarPost: carPost,
    //   carGalleries: carGalleries.map((carGallery) => ({
    //     file_name: carGallery.file_name,
    //     gallery_url: carGallery.gallery_url,
    //   })),
    // };
    // });
    return 'OK - create draft post';
  }

  async createPublishCarPost(
    authId: number,
    carInfo: CreateCarPostDto,
    carGallerieFiles: Array<Express.Multer.File>,
  ) {
    // const customer = await this.customerRepository.findOneBy({
    //   auth_credential: {
    //     id: authId,
    //   },
    // });

    // if (!customer) {
    //   throw new BadRequestException();
    // }

    // return await this.dataSource.transaction(async (manager) => {
    //   const car = await manager.save(Car, {
    //     car_name: `xe ${carInfo.car_brand} ${carInfo.car_model} ${carInfo.car_variant} ${carInfo.manufacturing_date}`,
    //     car_brand: carInfo.car_brand,
    //     car_model: carInfo.car_model,
    //     car_variant: carInfo.car_variant,
    //     manufacturing_date: carInfo.manufacturing_date,
    //     car_slug: generateCarSlug(
    //       carInfo.car_brand,
    //       carInfo.car_model,
    //       carInfo.manufacturing_date,
    //     ),
    //     body_type: carInfo.body_type,
    //     car_mileage: carInfo.car_mileage,
    //     transmission: carInfo.transmission,
    //     drivetrain: carInfo.drivetrain,
    //     engine_type: carInfo.engine_type,
    //     out_color: carInfo.out_color,
    //     total_seating: carInfo.total_seating,
    //     total_doors: carInfo.total_doors,
    //     city: carInfo.city,
    //     district: carInfo.district,
    //     car_origin: carInfo.car_origin,
    //     car_status: carInfo.car_status,
    //     description: carInfo.description,
    //     selling_price: carInfo.selling_price,
    //   });

    //   const carGalleryObj = await Promise.all(
    //     carGallerieFiles.map(async (carGallerieFile) => {
    //       const [fileName, fileType] = carGallerieFile.originalname.split('.');

    //       const uniqueFileName =
    //         fileName.split(' ').join('') + '-' + Date.now() + '.' + fileType;

    //       const galleryUrl = await this.s3Service.uploadImageToBucket(
    //         carGallerieFile.buffer,
    //         uniqueFileName,
    //         carGallerieFile.mimetype,
    //       );

    //       return this.carGalleryRepository.create({
    //         gallery_url: galleryUrl,
    //         file_name: uniqueFileName,
    //         car: car,
    //       });
    //     }),
    //   );

    //   const carGalleries = await manager.save(CarGallery, carGalleryObj);

    //   const carPost = await manager.save(CarPost, {
    //     customer: customer,
    //     car: car,
    //     created_at: new Date(),
    //     post_status: CarPostStatus.DRAFT,
    //   });

    const paymentUrl = this.paymentServices.createMomoURL({
      amount: 10000,
      order_id: '10ihiuh',
      order_info: 'pay with MoMo',
    });

    //   return {
    //     newCarPost: carPost,
    //     carGalleries: carGalleries.map((carGallery) => ({
    //       file_name: carGallery.file_name,
    //       gallery_url: carGallery.gallery_url,
    //     })),
    //   };
    // });

    return {
      momoPaymentUrl: paymentUrl,
      message: 'OK - create publish post',
    };
  }

  async updateCarPost(
    user: JwtPayload,
    postId: number,
    carInfoUpdate: UpdateCarPostDto,
    carGallerieFiles: Array<Express.Multer.File>,
  ) {
    const { authId } = user;

    const currentPost = await this.carPostRepository.findOne({
      where: {
        id: postId,
        customer: {
          auth_credential: {
            id: authId,
          },
        },
      },
      relations: {
        car: {
          car_galleries: true,
        },
      },
    });

    if (!currentPost) {
      throw new NotFoundException('car is not found');
    }

    // car_brand
    currentPost.car.car_brand = carInfoUpdate.car_brand
      ? carInfoUpdate.car_brand
      : currentPost.car.car_brand;

    // car_model
    currentPost.car.car_model = carInfoUpdate.car_model
      ? carInfoUpdate.car_model
      : currentPost.car.car_model;

    // car_variant
    currentPost.car.car_variant = carInfoUpdate.car_variant
      ? carInfoUpdate.car_variant
      : currentPost.car.car_variant;

    // manufacturing_date
    currentPost.car.manufacturing_date = carInfoUpdate.manufacturing_date
      ? carInfoUpdate.manufacturing_date
      : currentPost.car.manufacturing_date;

    // body_type
    currentPost.car.body_type = carInfoUpdate.body_type
      ? carInfoUpdate.body_type
      : currentPost.car.body_type;

    // car_mileage
    currentPost.car.car_mileage = carInfoUpdate.car_mileage
      ? carInfoUpdate.car_mileage
      : currentPost.car.car_mileage;

    // transmission
    currentPost.car.transmission = carInfoUpdate.transmission
      ? carInfoUpdate.transmission
      : currentPost.car.transmission;

    // drivetrain
    currentPost.car.drivetrain = carInfoUpdate.drivetrain
      ? carInfoUpdate.drivetrain
      : currentPost.car.drivetrain;

    // engine_type
    currentPost.car.engine_type = carInfoUpdate.engine_type
      ? carInfoUpdate.engine_type
      : currentPost.car.engine_type;

    // out_color
    currentPost.car.out_color = carInfoUpdate.out_color
      ? carInfoUpdate.out_color
      : currentPost.car.out_color;

    // total_seating
    currentPost.car.total_seating = carInfoUpdate.total_seating
      ? carInfoUpdate.total_seating
      : currentPost.car.total_seating;

    // total_doors
    currentPost.car.total_doors = carInfoUpdate.total_doors
      ? carInfoUpdate.total_doors
      : currentPost.car.total_doors;

    // city
    currentPost.car.city = carInfoUpdate.city
      ? carInfoUpdate.city
      : currentPost.car.city;

    // district
    currentPost.car.district = carInfoUpdate.district
      ? carInfoUpdate.district
      : currentPost.car.district;

    // car_origin
    currentPost.car.car_origin = carInfoUpdate.car_origin
      ? carInfoUpdate.car_origin
      : currentPost.car.car_origin;

    // car_status
    currentPost.car.car_status = carInfoUpdate.car_status
      ? carInfoUpdate.car_status
      : currentPost.car.car_status;

    // description
    currentPost.car.description = carInfoUpdate.description
      ? carInfoUpdate.description
      : currentPost.car.description;

    // selling_price
    currentPost.car.selling_price = carInfoUpdate.selling_price
      ? carInfoUpdate.selling_price
      : currentPost.car.selling_price;

    // car_gallery
    if (carGallerieFiles) {
      await Promise.all(
        currentPost.car.car_galleries.map(async (car_gallery) => {
          await this.s3Service.deleteImageToBucket(car_gallery.file_name);
        }),
      );

      await this.carGalleryRepository.remove(currentPost.car.car_galleries);

      const carGalleries = await Promise.all(
        carGallerieFiles.map(async (carGallerieFile) => {
          const [fileName, fileType] = carGallerieFile.originalname.split('.');

          const uniqueFileName =
            fileName.split(' ').join('') + '-' + Date.now() + '.' + fileType;

          const galleryUrl = await this.s3Service.uploadImageToBucket(
            carGallerieFile.buffer,
            uniqueFileName,
            carGallerieFile.mimetype,
          );

          return this.carGalleryRepository.create({
            gallery_url: galleryUrl,
            file_name: uniqueFileName,
            car: currentPost.car,
          });
        }),
      );

      currentPost.car.car_galleries = carGalleries;
      await this.carGalleryRepository.save(currentPost.car.car_galleries);
    }

    return { updatedCar: await this.carPostRepository.save(currentPost) };
  }

  async deleteCarPost(user: JwtPayload, postId: number) {
    const { authId } = user;

    const currentPost = await this.carPostRepository.findOne({
      where: {
        id: postId,
        customer: {
          auth_credential: {
            id: authId,
          },
        },
      },
      relations: {
        car: {
          car_galleries: true,
        },
      },
    });

    await Promise.all(
      currentPost.car.car_galleries.map(async (car_gallery) => {
        await this.s3Service.deleteImageToBucket(car_gallery.file_name);
      }),
    );

    await this.carPostRepository.remove(currentPost);

    return {
      message: `Delete post - id: ${postId} successfully`,
    };
  }
}
