import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  PORT: Joi.number().default(3000),
  DATABASE_URL: Joi.string().required().messages({
    'any.required': 'La variable de entorno DATABASE_URL es obligatoria para conectar con MySQL.',
  }),
  JWT_SECRET: Joi.string().required().messages({
    'any.required': 'La variable de entorno JWT_SECRET es obligatoria para firmar los tokens JWT.',
  }),
  JWT_EXPIRES_IN: Joi.string().default('1d'),
});

