import jwt from "jsonwebtoken";
import { UserRoles } from "../schema/entities/roles";

/**
 * interface that defines the jwt token type
 *
 * @interface
 * @exports
 */
export interface JwtToken {
  /**
   * user id
   *
   * @type {string}
   * @memberof JwtToken
   */
  id: string;

  /**
   * user role
   *
   * @type {string}
   * @memberof JwtToken
   */
  role: UserRoles;
}

export const genToken = (userId: string, role: UserRoles): string => {
  const tokenSecret: string = process.env.JWT_TOKEN_SECRET || "";

  const exportedToken: JwtToken = {
    id: userId,
    role,
  };

  const token: string = jwt.sign(exportedToken, tokenSecret, {
    expiresIn: 3 * 60 * 60 * 24,
  });

  return token;
};

export const validateToken = (token: string): JwtToken => {
  const tokenSecret: string = process.env.JWT_TOKEN_SECRET || "";
  return jwt.verify(token, tokenSecret) as JwtToken;
};
