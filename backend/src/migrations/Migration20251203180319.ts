import { Migration } from '@mikro-orm/migrations';

export class Migration20251203180319 extends Migration {
  override up(): void {
    this.addSql('alter table "user" add column "name" varchar(255) null;');
    this.addSql('update "user" set "name" = \'\' where "name" is null;');
    this.addSql(`alter table "user" alter column "name" set not null;`);
  }

  override down(): void {
    this.addSql(`alter table "user" drop column "name";`);
  }
}
