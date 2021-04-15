import { Arg, Authorized, Mutation, Query, Resolver } from "type-graphql";
import bcrypt from "bcryptjs";

import { User } from "../entities/user";
import { genToken } from "../../utils/token-utils";
import { RegisterInput } from "../types/register-input";
import { UserRoles } from "../entities/roles";

@Resolver()
export class UserResolver {
  @Query(() => User)
  async getUser(@Arg("id") id: string): Promise<User> {
    // get a user with the given id
    try {
      const user: User | undefined = await User.findOne({ id });
      if (user) {
        return user;
      } else {
        throw new Error("No user found.");
      }
    } catch (err) {
      throw new Error(err);
    }
  }

  @Query(() => String)
  @Authorized(UserRoles.EDITOR)
  authQuery(): string {
    return "You Are Authorized.";
  }

  @Mutation(() => String)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<string> {
    // extra check for email and password existance
    if (email && password) {
      // check if user with this email exists
      try {
        const user = await User.findOne({ where: { email } });
        if (user) {
          // check user passowrd
          const authorized: boolean = await bcrypt.compare(
            password,
            user.password
          );
          if (authorized) {
            // log him in >> send him his token
            return genToken(user.id, user.role);
          } else {
            throw new Error("Wrong Credentials.");
          }
        } else {
          throw new Error("No user found with this email.");
        }
      } catch (err) {
        throw new Error(err);
      }
    } else {
      throw new Error("Please provide your credentials.");
    }
  }

  @Mutation(() => String)
  async register(
    @Arg("data") { firstname, lastname, email, password }: RegisterInput
  ): Promise<string> {
    const salt: string = await bcrypt.genSalt(2);
    const hashedPassword: string = await bcrypt.hash(password, salt);

    try {
      const user: User = await User.create({
        firstname,
        lastname,
        email,
        password: hashedPassword,
      }).save();

      return genToken(user.id, user.role);
    } catch (err) {
      throw new Error(err);
    }
  }
}
