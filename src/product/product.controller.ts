import { Body, Controller, Delete, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { AddProductDTO, GetProductDTO } from './dto';
import { ProductService } from './product.service';
import { JWTGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';

@UseGuards(JWTGuard)
@Controller('product')
export class ProductController {
	constructor(private productService: ProductService) {}

	@Post('add')
	addProduct(@Body() dto: AddProductDTO,  @GetUser('id') userId: string) {
		return this.productService.addProduct(dto, userId);
	}

	@Get('all')
	getAllProductsByUser(@Body() dto: GetProductDTO, @GetUser('id') userId: string) {
		return this.productService.getProducts(dto, userId);
	}

	@Patch('update')
	updateProduct() {}

	@Delete('delete')
	deleteProduct() {}
}
