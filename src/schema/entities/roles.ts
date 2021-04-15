/**
 * defines the User Rules Type
 */

import { registerEnumType } from "type-graphql";

export enum UserRoles {
  USER = "USER",
  EDITOR = "EDITOR",
  MODERATOR = "MODERATOR",
  ADMIN = "ADMIN",
}

export default registerEnumType(UserRoles, {
  name: "UserRoles",
  description: "Defines user roles types",
});
