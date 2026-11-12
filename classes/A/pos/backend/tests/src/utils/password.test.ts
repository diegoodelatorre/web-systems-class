import { describe, it, expect, beforeAll } from 'vitest';
import { hashPassword, comparePassword } from '../../../src/utils/password.util.ts';

describe('Pruebas unitarias para password.util', () => {
  const password1 = "ClaveUno123!";
  const password2 = "ClaveDos456!";
  
  let hash1: string;
  let hash2: string;

  beforeAll(async () => {
    hash1 = await hashPassword(password1);
    hash2 = await hashPassword(password2);
  });

  it('Generación de hashes. Deben ser cadenas no vacías y diferentes de la contraseña original', () => {
    expect(typeof hash1).toBe('string');
    expect(hash1.length).toBeGreaterThan(0);
    expect(hash1).not.toBe(password1);

    expect(typeof hash2).toBe('string');
    expect(hash2.length).toBeGreaterThan(0);
    expect(hash2).not.toBe(password2);
  });

  it('Contraseña correcta. comparePassword devuelve true para las combinaciones correctas', async () => {
    const isMatch1 = await comparePassword(password1, hash1);
    const isMatch2 = await comparePassword(password2, hash2);

    expect(isMatch1).toBe(true);
    expect(isMatch2).toBe(true);
  });

  it('Contraseña incorrecta. comparePassword devuelve false para las combinaciones cruzadas', async () => {
    const isMatchWrong1 = await comparePassword(password2, hash1);
    const isMatchWrong2 = await comparePassword(password1, hash2);

    expect(isMatchWrong1).toBe(false);
    expect(isMatchWrong2).toBe(false);
  });
});