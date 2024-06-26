import { CanActivate, ExecutionContext, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ProductAvailabilityGuard implements CanActivate{
	constructor(private prisma: PrismaService) {}
	async canActivate(context: ExecutionContext): Promise<boolean>{
		const request = context.switchToHttp().getRequest();
		const productId = request.params.productId;

		// Check if Product exists in Database
		const product = await this.prisma.product.findUnique({
			where: {
				id: productId,
				userId: request.user.id,
				deletedAt: null || undefined
			}
		})

		// Throw error if Product doesn't exist
		if (!product) {
			throw new NotFoundException({
				success: false,
				message: 'Product not found',
			});
		}
		
		request.product = product
		return true;
	}
}