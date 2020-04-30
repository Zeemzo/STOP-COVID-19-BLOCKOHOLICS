import { APIGatewayEvent } from "aws-lambda";
import * as FuzzySearch from "fuzzy-search";
import { UserRepository } from "../repository/covid.repository";
import AWS from "aws-sdk";
import uuid from "uuid";
import Fuse from "fuse.js";
import axios from "axios";
import { Keypair } from "stellar-sdk";
import { AES, enc } from "crypto-js";
import * as jwt from "jsonwebtoken";
import { tokenViewer } from "./handler";
function decyrptSecret(secret: any, signer: any) {
  try {
    const decrypted = AES.decrypt(secret, signer);
    const plaintext = decrypted.toString(enc.Utf8);
    return plaintext;
  } catch (error) {
    return null;
  }
}
export class UserService {
  public static async login(event: APIGatewayEvent) {
    try {
      const requestBody = JSON.parse(event.body);

      let user = await UserRepository.getUserByEmail(requestBody.email);
      if (user.data == null) {
        return {
          code: 201,
          message: "account not found",
          data: null,
        };
      }

      const secret = decyrptSecret(
        user.data.encryptedSecret,
        requestBody.password
      );
      if (user.data.publicKey == Keypair.fromSecret(secret).publicKey()) {
        let tokenBody = user.data;
        tokenBody.exp = Math.floor(new Date().getTime() / 1000.0) + 12000;
        var token = jwt.sign(tokenBody, process.env.jwt_secret);
        return {
          code: 200,
          message: "success",
          data: { token: token },
        };
      } else {
        return {
          code: 202,
          message: "password is incorrect",
          data: null,
        };
      }
    } catch (err) {
      return {
        code: 202,
        message: "password is incorrect",
        data: null,
      };
    }
  }

  public static async register(event: APIGatewayEvent) {
    try {
      const requestBody = JSON.parse(event.body);
      let existingUser = await UserRepository.getUserByEmail(requestBody.email);
      if (existingUser.data != null) {
        return {
          code: 201,
          message: "account already exists",
          data: null,
        };
      }

      
      let user = await UserRepository.addUser(requestBody);
      if (user.data != null) {
        let tokenBody = user.data;
        tokenBody.exp = Math.floor(new Date().getTime() / 1000.0) + 12000;
        var token = jwt.sign(tokenBody, process.env.jwt_secret);
        return {
          code: 200,
          message: "success",
          data: { token: token },
        };
      }
    } catch (err) {
      return {
        code: 400,
        message: "registration failed",
        data: null,
      };
    }
  }

  public static async getAccount(event: APIGatewayEvent) {
    try {
      let existingUser = await UserRepository.getUserByPublicKey(
        event.pathParameters.id
      );
      if (existingUser.data == null) {
        return {
          code: 201,
          message: "account not found",
          data: null,
        };
      }
      const tokenPayload = tokenViewer(event);
      if (tokenPayload["publicKey"] != existingUser.data.publicKey) {
        return {
          code: 200,
          message: "success",
          data: {
            publicKey: existingUser.data.publicKey,
            email: existingUser.data.email,
            name: existingUser.data.email,
            verified: true,
          },
        };
      }

      return {
        code: 200,
        message: "success",
        data: existingUser.data,
      };
    } catch (err) {
      return {
        code: 400,
        message: "retrieving account failed",
        data: null,
      };
    }
  }
}
