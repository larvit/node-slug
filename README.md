[![Build Status](https://github.com/larvit/larvitslugify/actions/workflows/ci.yml/badge.svg)](https://github.com/larvit/larvitslugify/actions)

# [larvitslugify](https://github.com/larvit/larvitslugify)

Make strings url-safe.

Vanilla javascript, no production dependencies.

Why not use slug? Or slugify? Well, I built this because I wanted a more transparent and powerfull implementation. If I wanted to preserve "/" and change "." to ":" I want to be able to do that, but still have the comfort of everything else being a default slugifier.

```
npm install larvitslugify
```

## Examples

```javascript
const { slugify, defaultCharmap } = require('larvitslugify');

slugify('i ♥ unicode'); // > i-love-unicode
slugify('unicode ♥ is ☢'); // > unicode-love-is-radioactive

// If you prefer something else then `-` as seperator
slugify('i ♥ unicode', '_'); // > i_love_unicode

// Change default charmap by passing charmap option as argument
slugify('I ♥ UNICODE', { charmap: { ...defaultCharmap, '♥': 'freaking love' } })); // > I-freaking-love-UNICODE

slugify('i <3 unicode'); // > i-love-unicode
```

## Options

```javascript
// Options is either object or whitespaceReplaceChar (sets options.whitespaceReplaceChar)
slugify('string', [{options} || 'whitespaceReplaceChar']);
```

### All options

```javascript
slugify('string', {
	'whitespaceReplaceChar': '-', // Replace spaces with replacement
	'charmap': {'Å': 'A', 'Ö': 'O' ... }, // A complete replacement of the charmap. All characters not in the map will be replaced by the unidentifiedReplaceChar
	'multiCharmap': = {'<3': 'love', '||': 'and'}, // These will be matched before the single chars, also a complete replacement
	'removeMultipleWhitespace': = true, // Will replace all multiple whitespaces with a single one
	'trim': = true, // Run trim() on the string
	'unidentifiedReplaceChar': = '', // If unidentified characters are found they are replaced with this string
	'whitespaces': = [' ', '\t', '\xa0'] // A list of characters identified as whitespaces
	'save': = undefined // Adds a character to the charmap to "save" from being changed or removed. Takes a string of one character or an array of single caracter strings

 //'wordLimit': 5 // Limits the amount of words to this number (Currently not supported)
});
```

## Changelog
### 2.0.0
* Rewrote in TypeScript.
