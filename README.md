[![Build Status](https://travis-ci.org/larvit/larvitslugify.svg?branch=master)](https://travis-ci.org/larvit/larvitslugify) [![Dependencies](https://david-dm.org/larvit/larvitslugify.svg)](https://david-dm.org/larvit/larvitslugify.svg)

# [larvitslugify](https://github.com/larvit/larvitslugify)

Forked from [slug](https://github.com/dodo/node-slug) and added some pull requests and options.

Slugifies every string, even when it contains unicode!

Make strings url-safe.

- respecting [RFC 3986](https://tools.ietf.org/html/rfc3986)
- Comprehensive tests
- No dependencies (except the unicode table)
- Not in coffee-script (lol)
- Coerces foreign symbols to their english equivalent
- Works in browser (window.slug) and AMD/CommonJS-flavoured module loaders (except the unicode symbols unless you use browserify but who wants to download a ~2mb js file, right?)

```
npm install larvitslugify
```

## Examples

```javascript
var slug  = require('larvitslugify'),
    print = console.log.bind(console, '>')

print(slug('i ♥ unicode'))
// > i-love-unicode

print(slug('unicode ♥ is ☢')) // yes!
// > unicode-love-is-radioactive

print(slug('i ♥ unicode', '_')) // If you prefer something else then `-` as seperator
// > i_love_unicode

slug.charmap['♥'] = 'freaking love' // change default charmap or use option {charmap:{…}} as 2. argument
print(slug('I ♥ UNICODE'))
// > I-freaking-love-UNICODE

print(slug('☏-Number', {lower: true})) // If you prefer lower case
// > telephone-number

print(slug('i <3 unicode'))
// > i-love-unicode
```

## Options

```javascript
// Options is either object or replacement (sets options.replacement)
slug('string', [{options} || 'replacement']);
```

### All options

```javascript
slug('string', {
	'replacement':  '-',              // Replace spaces with replacement
	'symbols':      true,             // Replace unicode symbols or not
	'remove':       /[d]/g,           // Regex to remove characters
	'lower':        true,             // Result in lower case
	'charmap':      {'Ä': 'ae'},      // Replace special characters
	'multicharmap': {'ð': 'oi'},      // Replace multi-characters
	'save':         ['*', 'ð'],       // Do not replace these characters, also takes a string
	'wordLimit':    5                 // Limits the amount of words to this number
});
```

### Option modes

```javascript
slug.defaults.mode ='pretty';
slug.defaults.modes['rfc3986'] = {
	'replacement':  '-',
	'symbols':      true,
	'remove':       null,
	'lower':        true,
	'charmap':      slug.charmap,
	'multicharmap': slug.multicharmap
};
slug.defaults.modes['pretty'] = {
	'replacement':  '-',
	'symbols':      true,
	'remove':       /[.]/g,
	'lower':        false,
	'charmap':      slug.charmap,
	'multicharmap': slug.multicharmap
};
```

## Browser

When using browserify you might want to remove the symbols table from your bundle by using `--ignore` similar to this:
```bash
# Generates a standalone slug browser bundle:
browserify slug.js --ignore unicode/category/So -s slug > slug-browser.js
```

When using webpack you can use:
```javascript
externals: {
    'unicode/category/So': '{}',
}
```
In your webpack config to replace the require with an empty object stub.
