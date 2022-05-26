import { BadRequestException } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { User } from '@/users/user.entity';
import { UserService } from '@/users/user.service';

import { AuthService } from './auth.service';
import { LoginInput } from './dto/inputs/login.input';
import { RegisterInput } from './dto/inputs/register.input';
import { LoginOutput } from './dto/login.output';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Mutation(() => LoginOutput)
  public async login(@Args('loginInput') loginInput: LoginInput): Promise<any> {
    const { username, password } = loginInput;
    const foundUser = await this.userService.repo.findByUsernameOrEmail(
      username,
    );
    if (!foundUser) {
      throw new BadRequestException('Invalid credential');
    }
    if (!(await this.authService.compareHash(password, foundUser.password))) {
      throw new BadRequestException('Invalid credential');
    }

    const accessToken = await this.authService.sign({
      sub: foundUser.id,
    });
    return {
      accessToken,
      user: foundUser,
    };
  }

  @Mutation(() => String)
  public async register(
    @Args('registerInput') registerInput: RegisterInput,
  ): Promise<string> {
    const { username, email, password, confirmPassword } = registerInput;
    const foundUser = await this.userService.findOne(undefined, {
      where: [{ username }, { email }],
    });
    if (email === foundUser?.email) {
      throw new BadRequestException('This email has been taken');
    }
    if (username === foundUser?.username) {
      throw new BadRequestException('This username has been taken');
    }
    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }
    const hashedPassword = await this.authService.stringHash(password);

    const createdUser = new User();
    createdUser.email = email;
    createdUser.password = hashedPassword;
    createdUser.username = username;
    await this.userService.save(createdUser);
    return 'Register success';
  }
}
