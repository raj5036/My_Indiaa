import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ProductDTO } from './dto';
import { ProductService } from './product.service';
import { JWTGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductIdGuard } from './guard';
@UseGuards(JWTGuard)
@Controller('product')
export class ProductController {
	constructor(
		private productService: ProductService,
		private prisma: PrismaService,
	) {}

	@Post('add')
	addProduct(@Body() dto: ProductDTO,  @GetUser('id') userId: string) {
		return this.productService.addProduct(dto, userId);
	}

	@Get('all')
	getAllProductsByUser(@GetUser('id') userId: string) {
		return this.productService.getProductsByUser(userId);
	}

	@UseGuards(ProductIdGuard)
	@Get(':productId')
	getOneProduct(@Param('productId') productId: string) {
		return this.productService.getProductByProductId(productId);
	}

	@UseGuards(ProductIdGuard)
	@Patch(':productId')
	updateProduct(@Param('productId') productId: string, @Body() dto: ProductDTO) {
		return this.productService.updateProduct(productId, dto);
	}

	@UseGuards(ProductIdGuard)
	@Delete(':productId')
	deleteProduct(@Param('productId') productId: string) {
		return this.productService.deleteProduct(productId);
	}
}
