import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Country, CountryDocument } from '@/schemas/Country';

@Injectable()
export class CountriesService {
  constructor(
    @InjectModel(Country.name)
    private readonly countryModel: Model<CountryDocument>,
  ) {}

  async getAll() {
    try {
      const countries = await this.countryModel.find();

      return {
        data: countries,
      };
    } catch (error) {
      throw new Error(error);
    }
  }
}
