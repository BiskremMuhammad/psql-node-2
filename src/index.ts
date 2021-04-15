import dotenv from "dotenv";
import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import cors from "cors";

import { UserResolver } from "./schema/resolvers/user.resolver";
import { isAuthorized } from "./schema/helper/isAuth";

dotenv.config({
  path: `${__dirname}/.env${
    process.env.NODE_ENV ? "." + process.env.NODE_ENV : ""
  }`,
});

const main = async () => {
  await createConnection();
  const app = express();

  const schema = await buildSchema({
    resolvers: [UserResolver],
    authChecker: isAuthorized,
  });

  app.use(
    cors({
      credentials: true,
      origin: "http://localhost:3000",
    })
  );

  const graphserver = new ApolloServer({
    schema,
    context: ({ req }) => ({
      req,
    }),
  });

  graphserver.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log("server is running on: http://localhost:4000");
  });
};

main();
