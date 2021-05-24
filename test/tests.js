var assert = require('assert')

var { validate, format, normalize } = require('../')

describe('pixkey', function () {

	describe('validate', function () {
		// CPF
		it('should accept a CPF pix key with formatting', function () {
			assert.equal(validate('036.376.490-98'), 'cpf')
		})

		it('should accept a CPF pix key without formatting', function () {
			assert.equal(validate('03637649098'), 'cpf')
		})

		it('should not accept an invalid CPF', function () {
			assert.deepEqual(validate('03637649099'), false)
		})

		// CNPJ
		it('should accept a CNPJ pix key with formatting', function () {
			assert.equal(validate('84.870.394/0001-29'), 'cnpj')
		})

		it('should accept a CNPJ pix key without formatting', function () {
			assert.equal(validate('84870394000129'), 'cnpj')
		})

		it('should not accept an invalid CNPJ', function () {
			assert.deepEqual(validate('84870394000128'), false)
		})

		// Email
		it('should accept an email key', function () {
			assert.equal(validate('johndoe@test.com'), 'email')
		})

		it('should not accept an invalid email', function () {
			assert.deepEqual(validate('john doe@test.com'), false)
		})

		// Phone
		it('should accept a phone key in full format', function () {
			assert.equal(validate('+5511987654321'), 'phone')
		})

		it('should accept a phone key in short format without formatting', function () {
			assert.equal(validate('11987654321'), 'phone')
		})

		it('should accept a phone key in short format without formatting and trailing zero', function () {
			assert.equal(validate('11987654321'), 'phone')
		})

		it('should accept a phone key in short format with formatting', function () {
			assert.equal(validate('(11) 98765-4321'), 'phone')
		})

		it('should accept a phone key in short format with formatting and trailing zero', function () {
			assert.equal(validate('011987654321'), 'phone')
		})

		it('should not accept an invalid phone key', function () {
			assert.deepEqual(validate('0119987654321'), false)
		})

		// Random
		it('should accept a valid UUID', function () {
			assert.equal(validate('37046cb5-d25d-4480-bb66-5ee5bff8ad1f'), 'random')
		})
	})

	describe('normalize', function () {
		it('should correctly normalize a formatted CPF', function () {
			assert.equal(normalize('036.376.490-98'), '03637649098')
		})

		it('should correctly normalize an unformatted CPF', function () {
			assert.equal(normalize('03637649098'), '03637649098')
		})

		it('should correctly normalize an unformatted CNPJ', function () {
			assert.equal(normalize('84870394000129'), '84870394000129')
		})

		it('should correctly normalize a formatted CNPJ', function () {
			assert.equal(normalize('84.870.394/0001-29'), '84870394000129')
		})

		it('should return the key itself on a random key', function () {
			assert.equal(normalize('37046cb5-d25d-4480-bb66-5ee5bff8ad1f'), '37046cb5-d25d-4480-bb66-5ee5bff8ad1f')
		})

		it('should return the key itself on an email key', function () {
			assert.equal(normalize('johndoe@test.com'), 'johndoe@test.com')
		})

		it('should normalize a phone key in full format', function () {
			assert.equal(normalize('+5511987654321'), '+5511987654321')
		})

		it('should normalize a phone key in short format without formatting', function () {
			assert.equal(normalize('11987654321'), '+5511987654321')
		})

		it('should normalize a phone key in short format without formatting and trailing zero', function () {
			assert.equal(normalize('11987654321'), '+5511987654321')
		})

		it('should normalize a phone key in short format with formatting', function () {
			assert.equal(normalize('(11) 98765-4321'), '+5511987654321')
		})

		it('should normalize a phone key in short format with formatting and trailing zero', function () {
			assert.equal(normalize('011987654321'), '+5511987654321')
		})
	})

	describe('format', function () {
		it('should correctly format a formatted CPF', function () {
			assert.equal(format('036.376.490-98'), '036.376.490-98')
		})

		it('should correctly format an unformatted CPF', function () {
			assert.equal(format('03637649098'), '036.376.490-98')
		})

		it('should correctly format an unformatted CNPJ', function () {
			assert.equal(format('84870394000129'), '84.870.394/0001-29')
		})

		it('should correctly format a formatted CNPJ', function () {
			assert.equal(format('84.870.394/0001-29'), '84.870.394/0001-29')
		})

		it('should return the key itself on a random key', function () {
			assert.equal(format('37046cb5-d25d-4480-bb66-5ee5bff8ad1f'), '37046cb5-d25d-4480-bb66-5ee5bff8ad1f')
		})

		it('should return the key itself on an email key', function () {
			assert.equal(format('johndoe@test.com'), 'johndoe@test.com')
		})

		it('should format a phone key in full format', function () {
			assert.equal(format('+5511987654321'), '(11) 98765-4321')
		})

		it('should format a phone key in short format without formatting', function () {
			assert.equal(format('11987654321'), '(11) 98765-4321')
		})

		it('should format a phone key in short format without formatting and trailing zero', function () {
			assert.equal(format('11987654321'), '(11) 98765-4321')
		})

		it('should format a phone key in short format with formatting', function () {
			assert.equal(format('(11) 98765-4321'), '(11) 98765-4321')
		})

		it('should format a phone key in short format with formatting and trailing zero', function () {
			assert.equal(format('011987654321'), '(11) 98765-4321')
		})
	})
})