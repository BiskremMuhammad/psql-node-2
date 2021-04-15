import { Request } from "express";

/**
 * interface that defines the type of each request handler context obj
 *
 * @interface
 * @exports
 */
export interface MyContext {
  /**
   * the request part of each request made to the server
   *
   * @type {Request}
   */
  req: Request;
}
