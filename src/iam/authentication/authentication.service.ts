import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { SignUpDto } from './dto/sign-up.dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto/sign-in.dto';
import { HashingService } from '../hashing/hashing.service';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { ActiveUserInterface } from '../interfaces/active-user.interface';
import { randomUUID } from 'crypto';
import { RefreshTokenIdsStorage } from './refresh-token-ids.storage/refresh-token-ids.storage';

export class InvalidatedRefreshTokenError extends Error {}

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly refreshTokenIdsStorage: RefreshTokenIdsStorage,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    try {
      const { email, password } = signUpDto;

      const user = new User();
      user.email = email;
      user.password = await this.hashingService.hash(password);

      return this.userRepository.save(user);
    } catch (err) {
      const pgUniqueViolationErrorCode = '23505';
      if (err.code === pgUniqueViolationErrorCode) {
        throw new ConflictException('Email already exists');
      }
      return err;
    }
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.userRepository.findOneBy({
      email: signInDto.email,
    });
    console.log('Signing up user  :', user);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isEqual = await this.hashingService.compare(
      signInDto.password,
      user.password,
    );
    if (!isEqual) {
      console.log('password not match');
      throw new UnauthorizedException('Invalid credentials');
    }
    /*     const accessToken = await this.jwtService.signAsync(
      {
        sub: user.id,
        email: user.email,
      } as ActiveUserInterface,
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn: this.jwtConfiguration.accessTokenTtl,
      },
    );
    return { accessToken }; */
    console.log('password matched');

    return await this.generateToken(user);
  }

  private async signToken<T>(userId: number, expiresIn: number, payload?: T) {
    return this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn: expiresIn,
      },
    );
  }

  async generateToken(user: User) {
    const refreshTokenId = randomUUID();

    const [accessToken, newRefreshToken] = await Promise.all([
      this.signToken<Partial<ActiveUserInterface>>(
        user.id,
        this.jwtConfiguration.accessTokenTtl,
        {
          email: user.email,
          role: user.role,
          permissions: user.permissions,
        },
      ),
      this.signToken(user.id, this.jwtConfiguration.refreshTokenTtl, {
        refreshTokenId,
      }),
    ]);
    await this.refreshTokenIdsStorage.insert(user.id, refreshTokenId);
    return { accessToken, refreshToken: newRefreshToken };
  }
  async refreshToken(refreshToken: { refreshToken: string }) {
    try {
      const { sub, refreshTokenId } = await this.jwtService.verifyAsync<
        Pick<ActiveUserInterface, 'sub'> & { refreshTokenId: string }
      >(refreshToken.refreshToken, {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
      });

      const user = await this.userRepository.findOneBy({ id: sub });

      console.log(refreshTokenId, 'Hello refresh  user :', user);
      if (!user) {
        console.log('User not found');
        throw new UnauthorizedException('Invalid refresh token');
      }

      const isValid = await this.refreshTokenIdsStorage.validate(
        user.id,
        refreshTokenId,
      );
      console.log('Hello is valid :', isValid);
      if (!isValid) {
        throw new UnauthorizedException('Invalid refresh token');
      } else {
        await this.refreshTokenIdsStorage.invalidate(user.id);
      }
      return this.generateToken(user);
    } catch (err) {
      if (err instanceof InvalidatedRefreshTokenError) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
