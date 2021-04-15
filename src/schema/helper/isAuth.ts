import { AuthChecker } from "type-graphql";

import { UserRoles } from "../entities/roles";
import { MyContext } from "../types/my-context";
import { JwtToken, validateToken } from "../../utils/token-utils";

export const isAuthorized: AuthChecker<MyContext> = ({ context }, roles) => {
  // check if the request has a headers value
  const headers: string = context.req.headers.authorization || "";
  if (!headers) {
    return false;
  }

  if (!headers.match(/^bearer/gi)) {
    return false;
  }

  const token: string = headers.split("Bearer ")[1];
  // validate the token with jwt
  if (!token) {
    return false;
  }

  const decodedToken: JwtToken = validateToken(token);
  if (!decodedToken || !decodedToken.id) {
    return false;
  }

  const { role }: JwtToken = decodedToken;

  if (roles.length) {
    // if roles provided are only one >> so authorize users from this roles or above
    if (roles.length === 1) {
      switch (roles[0]) {
        case UserRoles.USER:
          return true;
        case UserRoles.EDITOR:
          return role !== UserRoles.USER;
        case UserRoles.MODERATOR:
          return role === UserRoles.MODERATOR || role === UserRoles.ADMIN;
        case UserRoles.ADMIN:
          return role === UserRoles.ADMIN;
        default:
          return false;
      }
    } else {
      return roles.includes(role.toString());
    }
  }

  return true;
};
