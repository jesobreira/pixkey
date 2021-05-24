# pixkey - Identifier, normalizer, formatter

This lib identifies/validates, normalizes and formats a Pix key from a string, directly inferencing the key type.

Note that it only validates the data type and does not check whether a Pix key is registered on Bacen's DICT. For that, you must be a registered Pix participant or work with one.

## Installing

```
npm i pixkey
```

## Importing

```
import { validate, format, normalize } from 'pixkey'
// or
const { validate, format, normalize } = require('pixkey')
```

## Functions

This lib exposes three functions. They all receive only one argument, the pix key as a string.

- **validate**: validates a Pix key, returning either 'cpf', 'cnpj', 'email', 'phone' or 'random' (depending on the Pix key type) or `false` if the key is invalid.

- **normalize**: returns the normalized data, or the key itself if the key is "email" or "random". Normalizing means, for CPF and CNPJ, that all formating characters will be removed, and for phone Pix keys, that it will be changed to the international full phone number format (i.e. +5511987654321).

- **format**: returns the pix key formatted for better reading, or the key itself if the key is "email" or "random". Formatting means, for CPF and CNPJ, that if it does not contain the group separators, it will be included (".", "-" and "/"), and for phone Pix keys, that it will be changed to the national phone number format (i.e. (11) 98765-4321)

## Testing

Tests are available using Mocha. Run `npm test`.

## License

MIT