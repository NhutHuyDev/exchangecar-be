import { InjectRepository } from '@nestjs/typeorm';
import { CarPost } from './entities/car_post.entity';
import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CarPostQueryDto } from './dto/carPostQuery.dto';
import { CarPostQueriesService } from './carPostQueries.service';
import { mapSortParam } from '@/constraints/sortOptions.constaint';

@Injectable()
export class CarPostsServices {
  constructor(
    @InjectRepository(CarPost)
    private carPostRepository: Repository<CarPost>,
    private carPostQueriesService: CarPostQueriesService,
  ) {}

  async getPosts(carPostquery: CarPostQueryDto) {
    console.log(carPostquery);

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
    const limit = 7;

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
      previous_page: carPostquery.page - 1 > 1 ? carPostquery.page - 1 : null,
      current_page: carPostquery.page,
      next_page:
        carPostquery.page + 1 <= totalPages ? carPostquery.page + 1 : null,
    };
  }
}
