import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    // Complete usando query builder
    param = param.toLowerCase();
    return this.repository
      .createQueryBuilder("games")
      .where("LOWER(games.title) like :name", { name:`%${param}%` })
      .getMany();
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query("SELECT count(id) FROM games"); // Complete usando raw query
  }

  async findUsersByGameId(id: string): Promise<any> {
    // Complete usando query builder
    const games = await this.repository 
      .createQueryBuilder("games")
      .leftJoinAndSelect('games.users', 'users_games')
      .where("games.id = :game_id", { game_id: id})
      .getOne();
    
    return games ? games.users : [];
  }
}
