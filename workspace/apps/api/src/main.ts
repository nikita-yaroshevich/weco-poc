import { APIGatewayProxyHandler } from 'aws-lambda';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { Server } from 'http';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as awsServerlessExpress from 'aws-serverless-express';
import * as express from 'express';
import {INestApplication, Logger} from "@nestjs/common";

let cachedServer: Server;

function applyAppConfiguration(app:INestApplication):INestApplication {
  app.enableCors();
  const globalPrefix = process.env.APP_PREFIX || 'api';
  app.setGlobalPrefix(globalPrefix);
  return app;
}

const bootstrapLambdaServer = async (): Promise<Server> => {
  const expressApp = express();
  const adapter = new ExpressAdapter(expressApp);
  const app = applyAppConfiguration(await NestFactory.create(AppModule, adapter));
  await app.init();
  return awsServerlessExpress.createServer(expressApp);
};

async function bootstrapExpress() {
  const app = applyAppConfiguration(await NestFactory.create(AppModule));

  const port = process.env.PORT || 8080;
  await app.listen(port, () => {
    Logger.log(`App loaded at port ${port}`);
  });
}

export const handler: APIGatewayProxyHandler = async (event, context) => {
  if (!cachedServer) {
    const server = await bootstrapLambdaServer();
    cachedServer = server;
    return awsServerlessExpress.proxy(server, event, context, 'PROMISE')
      .promise;
  } else {
    return awsServerlessExpress.proxy(cachedServer, event, context, 'PROMISE')
      .promise;
  }
};

if (process.env.IS_NOT_SERVERLESS) {
  bootstrapExpress()
}
