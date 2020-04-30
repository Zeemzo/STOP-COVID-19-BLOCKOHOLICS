import * as Joi from "@hapi/joi";

export const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  dob: Joi.string().optional(),
  publicKey: Joi.string().required(),
  encryptedSecret: Joi.string().required(),
  recoveryQuestion: Joi.string().required(),
  encryptedRecoverySecret: Joi.string().required(),
  pash: Joi.string().required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().optional(),
});


export const editUserSchema = Joi.object({
  name: Joi.string().optional(),
  email: Joi.string().optional(),
  dob: Joi.string().optional(),
  publicKey: Joi.string().optional(),
  encryptedSecret: Joi.string().optional(),
  recoveryQuestion: Joi.string().optional(),
  encryptedRecoverySecret: Joi.string().optional(),
  pash: Joi.string().optional(),
});


export class User {
  _id: String;
  name: String;
  email: String;
  dob: String;
  type: String;
  publicKey: String;
  encryptedSecret: String;
  recoveryQuestion: String;
  encryptedRecoverySecret: String;
  pash: String;
  createdAt: String;
  updatedAt: String;
}
