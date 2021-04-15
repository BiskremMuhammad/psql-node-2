import { IsEmail } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class RegisterInput {
  @Field()
  firstname: string;

  @Field({ nullable: true })
  lastname?: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  password: string;
}
