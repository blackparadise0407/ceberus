import { InternalServerErrorException, Logger } from '@nestjs/common';
import {
  BaseEntity,
  DeepPartial,
  FindConditions,
  FindManyOptions,
  FindOneOptions,
  Repository,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { EntityId } from 'typeorm/repository/EntityId';

export class BaseService<
  Entity extends BaseEntity,
  Repo extends Repository<Entity>,
> {
  private readonly logger: Logger;
  private readonly repository: Repo;
  constructor(repository: Repo) {
    this.repository = repository;
    this.logger = new Logger();
  }

  public get repo(): Repo {
    return this.repository;
  }

  public async save(entity: DeepPartial<Entity>) {
    try {
      return await this.repository.save(entity);
    } catch (e) {
      this.logger.error(e.message);
      throw new InternalServerErrorException();
    }
  }

  public findAll(opt: FindManyOptions<Entity> = {}) {
    try {
      return this.repository.find(opt);
    } catch (e) {
      this.logger.error(e.message);
      throw new InternalServerErrorException();
    }
  }

  public findOne(id?: EntityId, opt: FindOneOptions<Entity> = {}) {
    try {
      return this.repository.findOne(id, opt);
    } catch (e) {
      this.logger.error(e.message);
      throw new InternalServerErrorException();
    }
  }

  public findById(id: EntityId) {
    try {
      return this.repository.findOne(id);
    } catch (e) {
      this.logger.error(e.message);
      throw new InternalServerErrorException();
    }
  }

  public create(data: any) {
    try {
      return this.repository.save(data);
    } catch (e) {
      this.logger.error(e.message);
      throw new InternalServerErrorException();
    }
  }

  public async update(
    crit: EntityId | FindConditions<Entity>,
    data: QueryDeepPartialEntity<Entity>,
  ) {
    try {
      await this.repository.update(crit, data);
      return this.repository.findOne(crit as EntityId);
    } catch (e) {
      this.logger.error(e.message);
      throw new InternalServerErrorException();
    }
  }

  public async delete(crit: EntityId | FindConditions<Entity>) {
    const result = await this.repository.delete(crit);
    if (result.affected > 0) {
      return true;
    } else {
      this.logger.error(result.raw);
      return false;
    }
  }
}
