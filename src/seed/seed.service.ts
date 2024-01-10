import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponseInterface } from './poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from '../pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) {}
  private readonly axios: AxiosInstance = axios;
  async executeSeed() {
    await this.pokemonModel.deleteMany({}); // delete * from pokemon;

    const { data } = await this.axios.get<PokeResponseInterface>(
      'https://pokeapi.co/api/v2/pokemon?limit=100',
    );

    const pokemonToInsert: { name: string; no: number }[] = [];

    for (const { name, url } of data.results) {
      const segments = url.split('/');
      const no = +segments[segments.length - 2];
      pokemonToInsert.push({ no: no, name: name });
    }
    await this.pokemonModel.insertMany(pokemonToInsert);
    return data.results;
  }
}
