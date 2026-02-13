import { Migration } from '@mikro-orm/migrations';

export class Migration20260213142106 extends Migration {
  override up(): void {
    this.addSql(
      `alter table "user" add column "password" varchar(255) not null, add column "created_at" timestamptz not null;`,
    );
    this.addSql(
      `alter table "user" add constraint "user_name_unique" unique ("name");`,
    );
  }

  override down(): void {
    this.addSql(`alter table "user" drop constraint "user_name_unique";`);
    this.addSql(
      `alter table "user" drop column "password", drop column "created_at";`,
    );
  }
}
