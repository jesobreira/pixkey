const { validateBr, maskBr } = require('js-brasil')
const uuidValidator = require('uuid-validate')
const { parsePhoneNumber, isValidPhoneNumber } = require('libphonenumber-js/mobile')
const emailValidator = require('email-validator').validate

const PIX_KEY_CPF = "cpf"
const PIX_KEY_CNPJ = "cnpj"
const PIX_KEY_RANDOM = "random"
const PIX_KEY_EMAIL = "email"
const PIX_KEY_PHONE = "phone"

/**
 *  
 */
export function validate(pixKey) {
	pixKey = pixKey.trim()

	if (validateBr.cpf(pixKey)) {
		return PIX_KEY_CPF
	} else if (validateBr.cnpj(pixKey)) {
		return PIX_KEY_CNPJ
	} else if (uuidValidator(pixKey)) {
		return PIX_KEY_RANDOM
	} else if (isValidPhoneNumber(pixKey, 'BR')) {
		return PIX_KEY_PHONE
	} else if (emailValidator(pixKey)) {
		return PIX_KEY_EMAIL
	} else {
		return false
	}
}

export function normalize(pixKey) {
	pixKey = pixKey.trim()

	switch (validate(pixKey)) {
		case PIX_KEY_CPF:
		case PIX_KEY_CNPJ:
			return pixKey.replace(/[^0-9]/g, '')

		case PIX_KEY_RANDOM:
		case PIX_KEY_EMAIL:
			return pixKey

		case PIX_KEY_PHONE:
			return parsePhoneNumber(pixKey, 'BR').number
	}
}

export function format(pixKey) {
	pixKey = normalize(pixKey)

	switch (validate(pixKey)) {
		case PIX_KEY_CPF:
			return maskBr.cpf(pixKey)

		case PIX_KEY_CNPJ:
			return maskBr.cnpj(pixKey)

		case PIX_KEY_RANDOM:
		case PIX_KEY_EMAIL:
			return pixKey

		case PIX_KEY_PHONE:
			return parsePhoneNumber(pixKey, 'BR').formatNational()
	}
}

export { PIX_KEY_CPF, PIX_KEY_CNPJ, PIX_KEY_RANDOM, PIX_KEY_EMAIL, PIX_KEY_PHONE }