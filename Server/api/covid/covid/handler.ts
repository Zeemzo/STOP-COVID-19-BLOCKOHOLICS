import { APIGatewayEvent, Context } from "aws-lambda";
import { UserService } from "./covid.service";
import { createResponse } from "../utils/response-generator";
import { logger } from "../utils/logger";
import * as jwt from "jsonwebtoken";
import { loginSchema, registerSchema } from "../models/covid.model";

export const tokenViewer = (event: APIGatewayEvent) => {
  if (typeof event.headers.Authorization === "undefined") {
    return null;
  }
  const split = event.headers.Authorization.split(" ");
  if (split.length !== 2) {
    return null;
  }
  const token = split[1].trim();
  const tokenPayload = jwt.verify(token, process.env.jwt_secret);
  if (tokenPayload) {
    return tokenPayload;
  }
};

export const authMiddleware = (
  event: APIGatewayEvent,
  roles: Array<string>
) => {
  try {
    if (typeof event.headers.Authorization === "undefined") {
      return {
        code: 401,
        message: "authorization token is missing",
        data: null,
      };
    }
    const split = event.headers.Authorization.split(" ");
    if (split.length !== 2) {
      return {
        code: 401,
        message: "authorization token is invalid",
        data: null,
      };
    }
    const token = split[1].trim();
    const tokenPayload = jwt.verify(token, process.env.jwt_secret);
    if (tokenPayload) {
      if (roles.indexOf(tokenPayload["type"]) > -1) {
        return {
          code: 200,
          message: "authorized",
          data: tokenPayload,
        };
      } else {
        return {
          code: 401,
          message: "action permission denied",
          data: null,
        };
      }
    }
  } catch (err) {
    return {
      code: 401,
      message: err.message,
      data: null,
    };
  }
};

export const login = async (event: APIGatewayEvent, context: Context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    await loginSchema.validateAsync(JSON.parse(event.body));

    const response = await UserService.login(event);

    logger.info("success!");
    return createResponse(response.code, response);
  } catch (error) {
    logger.error(error);
    return createResponse(HTTPStatusCodes.BAD_REQUEST, {
      code: 400,
      message: error.details[0].message,
      data: null,
    });
  } finally {
    logger.info("connection closed");
  }
};

export const register = async (event: APIGatewayEvent, context: Context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    await registerSchema.validateAsync(JSON.parse(event.body));

    let post = await UserService.register(event);
    logger.info("success!");
    return createResponse(post.code, post);
  } catch (error) {
    logger.error(error);
    return createResponse(HTTPStatusCodes.BAD_REQUEST, {
      code: 400,
      message: error.details[0].message,
      data: null,
    });
  } finally {
    logger.info("connection closed");
  }
};

export const getAccount = async (event: APIGatewayEvent, context: Context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const auth = await authMiddleware(event, ["1", "2", "3", "4", "5"]);
    if (auth.data == null) {
      return createResponse(auth.code, auth);
    }
    let post = await UserService.getAccount(event);
    logger.info("success!");
    return createResponse(post.code, post);
  } catch (error) {
    logger.error(error);
    return createResponse(HTTPStatusCodes.BAD_REQUEST, {
      code: 400,
      message: error.details[0].message,
      data: null,
    });
  } finally {
    logger.info("connection closed");
  }
};
