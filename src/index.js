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
	const keyTypes = []
	pixKey = pixKey.trim()

	if (validateBr.cpf(pixKey)) {
		keyTypes.push(PIX_KEY_CPF)
	}
	if (validateBr.cnpj(pixKey)) {
		keyTypes.push(PIX_KEY_CNPJ)
	}
	if (uuidValidator(pixKey)) {
		keyTypes.push(PIX_KEY_RANDOM)
	}
	if (isValidPhoneNumber(pixKey, 'BR')) {
		keyTypes.push(PIX_KEY_PHONE)
	}
	if (emailValidator(pixKey)) {
		keyTypes.push(PIX_KEY_EMAIL)
	}

	return keyTypes
}

export function normalize(pixKey, as = null) {
	pixKey = pixKey.trim()

	let useAs = validate(pixKey)
	if (useAs.length > 1) {
		if (useAs.includes(as)) {
			useAs = as
		} else {
			return null
		}
	} else if (!useAs.length) {
		return null
	} else {
		useAs = useAs[0]
	}

	switch (useAs) {
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

export function format(pixKey, as = null) {
	pixKey = normalize(pixKey, as)

	let useAs = validate(pixKey)
	if (useAs.length > 1) {
		if(as) {
		if (useAs.includes(as)) {
			useAs = as
		} else {
			return null
		}
	}else {
		useAs = useAs[0]
	}
	} else if (!useAs.length) {
		return null
	} else {
		useAs = useAs[0]
	}

	switch (useAs) {
		case PIX_KEY_CPF:
			return maskBr.cpf(pixKey)

		case PIX_KEY_CNPJ:
			return maskBr.cnpj(pixKey)

		case PIX_KEY_RANDOM:
		case PIX_KEY_EMAIL:
			return pixKey

		case PIX_KEY_PHONE:
			const phoneNumber = parsePhoneNumber(pixKey, 'BR')
			return phoneNumber.country === 'BR' ? phoneNumber.formatNational() : phoneNumber.formatInternational()
	}
}

export { PIX_KEY_CNPJ, PIX_KEY_CPF, PIX_KEY_EMAIL, PIX_KEY_PHONE, PIX_KEY_RANDOM }
