import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function validateRut(rut: string): boolean {
  if (!rut || typeof rut !== 'string') return false;

  // Limpiar puntos y guión
  const cleanRut = rut.replace(/[^0-9kK]/g, '').toUpperCase();
  if (cleanRut.length < 8 || cleanRut.length > 9) return false;

  const cuerpo = cleanRut.slice(0, -1);
  const dv = cleanRut.slice(-1);

  // Validar que el cuerpo sean solo números
  if (!/^\d+$/.test(cuerpo)) return false;

  let suma = 0;
  let multiplo = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += multiplo * parseInt(cuerpo.charAt(i), 10);
    multiplo = multiplo < 7 ? multiplo + 1 : 2;
  }

  const dvEsperadoNum = 11 - (suma % 11);
  let dvEsperado = '';

  if (dvEsperadoNum === 11) {
    dvEsperado = '0';
  } else if (dvEsperadoNum === 10) {
    dvEsperado = 'K';
  } else {
    dvEsperado = dvEsperadoNum.toString();
  }

  return dv === dvEsperado;
}

export function IsRut(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isRut',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: 'El $property no tiene un formato o dígito verificador de RUT chileno válido.',
        ...validationOptions,
      },
      validator: {
        validate(value: any, _args: ValidationArguments) {
          return typeof value === 'string' && validateRut(value);
        },
      },
    });
  };
}

