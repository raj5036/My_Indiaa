import { ForbiddenException, Injectable } from '@nestjs/common';
import { LoginDTO, RegisterDTO } from './dto';
import * as argon from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private jwt: JwtService,
		private config: ConfigService,
	) {}

	async login(loginDTO: LoginDTO) {
		try {
			const { email, password } = loginDTO;
			const user = await this.prisma.user.findUnique({
				where: {
					email
				}
			});

			if (!user) {
				throw new ForbiddenException('Credentials incorrect');
			}

			const pwMatches = await argon.verify(user.password, password);
			if (!pwMatches) {
				throw new ForbiddenException('Credentials incorrect');
			}

			return {
				id: user.id,
				email: user.email,
				token: await this.signToken(user.id, user.email)
			};
		} catch (error) {
			return this.prisma.errorHandler(error);
		}
	}	

	async register(registerDTO: RegisterDTO) {
		try {
			const { email, password, firstname, lastname, role } = registerDTO;
			const hashedPassword = await argon.hash(password);
			const newUser = await this.prisma.user.create({
				data: {
					email,
					password: hashedPassword,
					firstname,
					lastname,
					role,
				}, 
				select: {
					id: true,
					email: true,
					createdAt: true
				}
			})
			return {
				...newUser,
				token: await this.signToken(newUser.id, newUser.email)
			};
		} catch (error) {
			return this.prisma.errorHandler(error);
		}
	}

	async signToken (userId: string, email: string): Promise<string> {
		const payload = {
			sub: userId,
			email
		}

		const access_token = await this.jwt.sign(payload, { expiresIn: '24h', secret: this.config.get('JWT_SECRET') })
		return access_token 
	}
}
