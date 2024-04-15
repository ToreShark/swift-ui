import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Otp } from './schema/otp';
import { User } from './schema/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Otp.name) private otpModel: Model<Otp>
  ) {}

  // create a new user from phone number
  async createFromPhone(phone: string): Promise<User> {
    const newUser = new this.userModel({ phone });
    return newUser.save();
  }

  async createOTP(user: User, { code, expirationDate }: any): Promise<Otp> {
    const newOtp = new this.otpModel({ 
      user: user._id, 
      code, 
      expirationDate 
    });
    return newOtp.save();
  }

  async findValidOtp(user: User, code: number): Promise<Otp | null> {
    const otp = await this.otpModel.findOne({
      user: user._id,
      code,
      expirationDate: { $gt: new Date() },
    });
    return otp;
  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }
  // create user by phone export class CreateUserDto { @IsPhoneForCountries(['RU', 'KZ']) phone: string;}
  async createByPhone(phone: string): Promise<User> {
    const newUser = new this.userModel({ phone });
    await newUser.save();
    return newUser;
  }
  // create findOneByPhone
  async findOneByPhone(phone: string): Promise<User | null> {
    return this.userModel.findOne({
      phone,
    });
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
  //
  async cleanExpiredOtp(): Promise<number> {
    const result = await this.otpModel.deleteMany({
      expirationDate: { $lt: new Date() }
    });
    return result.deletedCount; // возвращает количество удаленных документов
  }

  // create fetchUser by id
  async fetchUser(id: string): Promise<User | null> {
    const user = await this.userModel.findById(id);
    return user;
  }
}
