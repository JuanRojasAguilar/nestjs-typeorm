import {
  Controller,
  Get,
  Query,
  Param,
  Post,
  Body,
  Put,
  Delete,
  HttpStatus,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

import { ParseIntPipe } from '../../common/parse-int.pipe';
import {
  CreateProductDto,
  UpdateProductDto,
  FilterProductsDto,
} from '../dtos/products.dtos';
import { ProductsService } from './../services/products.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/models/roles.model';

@UseGuards(JwtAuthGuard)
@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'List of products' })
  getProducts(@Query() params: FilterProductsDto) {
    return this.productsService.findAll(params);
  }

  @Public()
  @Get('filter')
  getProductFilter() {
    return `yo soy un filter`;
  }

  @Public()
  @Get(':productId')
  @HttpCode(HttpStatus.ACCEPTED)
  getOne(@Param('productId', ParseIntPipe) productId: number) {
    // response.status(200).send({
    //   message: `product ${productId}`,
    // });
    return this.productsService.findOne(productId);
  }

  @Roles(Role.ADMIN)
  @Post()
  create(@Body() payload: CreateProductDto) {
    return this.productsService.create(payload);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() payload: UpdateProductDto) {
    return this.productsService.update(id, payload);
  }

  @Put(':id/category/:categoryId')
  addCategory(
    @Param('id') id: number,
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ) {
    return this.productsService.addCategoryByProduct(id, categoryId);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.productsService.remove(id);
  }

  @Delete(':id/category/:categoryId')
  deleteCategory(
    @Param('id') id: number,
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ) {
    return this.productsService.removeCategoryByProduct(id, categoryId);
  }
}
