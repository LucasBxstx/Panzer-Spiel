import { Migration } from '@mikro-orm/migrations';

export class Migration20251202232339 extends Migration {
  override up(): void {
    this.addSql(
      `create table "user" ("id" uuid not null, "email" varchar(255) not null, constraint "user_pkey" primary key ("id"));`,
    );
    this.addSql(
      `alter table "user" add constraint "user_email_unique" unique ("email");`,
    );
  }

  override down(): void {
    this.addSql(`drop table if exists "user" cascade;`);
  }
}
