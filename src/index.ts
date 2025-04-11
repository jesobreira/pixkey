import { validateBr, maskBr } from 'js-brasil';
import uuidValidator from 'uuid-validate';
import { parsePhoneNumber, isValidPhoneNumber, PhoneNumber } from 'libphonenumber-js/mobile';
import { validate as emailValidator } from 'email-validator';

export const PIX_KEY_CPF = "cpf";
export const PIX_KEY_CNPJ = "cnpj";
export const PIX_KEY_RANDOM = "random";
export const PIX_KEY_EMAIL = "email";
export const PIX_KEY_PHONE = "phone";

export type PixKeyType =
  | typeof PIX_KEY_CPF
  | typeof PIX_KEY_CNPJ
  | typeof PIX_KEY_RANDOM
  | typeof PIX_KEY_EMAIL
  | typeof PIX_KEY_PHONE;

/**
 * Validates a given pix key and returns a list of possible key types.
 */
export function validate(pixKey: string): PixKeyType[] {
  const keyTypes: PixKeyType[] = [];
  pixKey = pixKey.trim();

  if (validateBr.cpf(pixKey)) {
    keyTypes.push(PIX_KEY_CPF);
  }
  if (validateBr.cnpj(pixKey)) {
    keyTypes.push(PIX_KEY_CNPJ);
  }
  if (uuidValidator(pixKey)) {
    keyTypes.push(PIX_KEY_RANDOM);
  }
  if (isValidPhoneNumber(pixKey, 'BR')) {
    keyTypes.push(PIX_KEY_PHONE);
  }
  if (emailValidator(pixKey)) {
    keyTypes.push(PIX_KEY_EMAIL);
  }

  return keyTypes;
}

/**
 * Normalizes a pix key to a standard format depending on its type.
 */
export function normalize(pixKey: string, as: PixKeyType | null = null): string | null {
  pixKey = pixKey.trim();

  let useAs: PixKeyType | null | PixKeyType[] = validate(pixKey);
  if (useAs.length > 1) {
    if (as && useAs.includes(as)) {
      useAs = as;
    } else {
      return null;
    }
  } else if (!useAs.length) {
    return null;
  } else {
    useAs = useAs[0];
  }

  switch (useAs) {
    case PIX_KEY_CPF:
    case PIX_KEY_CNPJ:
      return pixKey.replace(/[^0-9]/g, '');

    case PIX_KEY_RANDOM:
    case PIX_KEY_EMAIL:
      return pixKey;

    case PIX_KEY_PHONE: {
      const phoneNumber = parsePhoneNumber(pixKey, 'BR');
      return phoneNumber.number.toString();
    }

    default:
      return null;
  }
}

/**
 * Formats a pix key in a user-friendly way depending on its type.
 */
export function format(pixKey: string, as: PixKeyType | null = null): string | null {
  const normalized = normalize(pixKey, as);
  if (!normalized) return null;

  let useAs: PixKeyType | null | PixKeyType[] = validate(normalized);
  if (useAs.length > 1) {
    if (as && useAs.includes(as)) {
      useAs = as;
    } else {
      return null;
    }
  } else if (!useAs.length) {
    return null;
  } else {
    useAs = useAs[0];
  }

  switch (useAs) {
    case PIX_KEY_CPF:
      return maskBr.cpf(normalized);

    case PIX_KEY_CNPJ:
      return maskBr.cnpj(normalized);

    case PIX_KEY_RANDOM:
    case PIX_KEY_EMAIL:
      return normalized;

    case PIX_KEY_PHONE: {
      const phoneNumber: PhoneNumber = parsePhoneNumber(normalized, 'BR');
      return phoneNumber.country === 'BR'
        ? phoneNumber.formatNational()
        : phoneNumber.formatInternational();
    }

    default:
      return null;
  }
}
