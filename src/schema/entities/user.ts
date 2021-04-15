import { Field, ObjectType, Root } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from "typeorm";
import { UserRoles } from "./roles";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column()
  firstname: string;

  @Field()
  @Column({ nullable: true })
  lastname?: string;

  @Field()
  @Column()
  email: string;

  @Field()
  displayName(@Root() user: User): string {
    return `${user.firstname} ${user.lastname}`;
  }

  @Column()
  password: string;

  @Field(() => UserRoles)
  @Column({ default: UserRoles.USER })
  role: UserRoles;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field()
  @VersionColumn()
  version: string;
}
