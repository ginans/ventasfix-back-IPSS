import { validateRut } from './is-rut.validator';

describe('Chilean RUT Validator', () => {
  it('debe validar correctamente RUTs válidos con diferentes formatos', () => {
    expect(validateRut('11.111.111-1')).toBe(true);
    expect(validateRut('11111111-1')).toBe(true);
    expect(validateRut('111111111')).toBe(true);
    expect(validateRut('76.086.428-5')).toBe(true); // RUT real SII
    expect(validateRut('12.345.678-5')).toBe(true);
    expect(validateRut('77.654.321-7')).toBe(true);
  });

  it('debe rechazar RUTs con dígito verificador incorrecto', () => {
    expect(validateRut('11.111.111-2')).toBe(false);
    expect(validateRut('76.086.428-9')).toBe(false);
  });

  it('debe rechazar entradas inválidas, vacías o de longitud inadecuada', () => {
    expect(validateRut('')).toBe(false);
    expect(validateRut('abc')).toBe(false);
    expect(validateRut(null as any)).toBe(false);
    expect(validateRut(undefined as any)).toBe(false);
  });
});

