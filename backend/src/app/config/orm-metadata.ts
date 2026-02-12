import {
  Dictionary,
  EntityMetadata,
  MetadataStorage,
  MikroORM,
} from '@mikro-orm/core';
import { MikroOrmModuleOptions } from '@mikro-orm/nestjs';

export class OrmMetadata {
  static metadata: Dictionary<EntityMetadata>;
  static metadataStorage: MetadataStorage;
  static orm: MikroORM;

  static async init(config: MikroOrmModuleOptions) {
    this.orm = await MikroORM.init(config);

    this.metadataStorage = this.orm.em.getMetadata();
    this.metadata = this.metadataStorage.getAll();
  }

  static async synchronizeDbSchema() {
    const generator = this.orm.getSchemaGenerator();
    await generator.updateSchema({
      // safe: true,
    });
  }

  static async runMigrations() {
    await this.orm.getMigrator().up();
  }
}
