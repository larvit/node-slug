'use strict';

exports = module.exports = function slugify(str, options) {
	let whitespaces = [];
	let charmap = {};
	let prevWS = false;

	if (typeof options === 'string') {
		options = {whitespaceReplaceChar: options};
	}

	if (!options) options = {};
	if (options.charmap === undefined) options.charmap = exports.charmap;
	if (options.multiCharmap === undefined) options.multiCharmap = exports.multiCharmap;
	if (options.removeMultipleWhitespace === undefined) options.removeMultipleWhitespace = true;
	if (options.trim === undefined) options.trim = true;
	if (options.unidentifiedReplaceChar === undefined) options.unidentifiedReplaceChar = exports.unidentifiedReplaceChar;
	if (options.whitespaceReplaceChar === undefined) options.whitespaceReplaceChar = exports.whitespaceReplaceChar;
	if (options.whitespaces === undefined) options.whitespaces = exports.whitespaces;

	// Copy the charmap object so we do not screw up the original one
	Object.assign(charmap, options.charmap);

	// Make sure the string is actually a string
	str = String(str);

	if (options.trim === true) {
		str = str.trim();
	}

	// Shorthand for saving characters
	if (options.save) {
		if (!Array.isArray(options.save)) {
			options.save = [options.save];
		}

		for (let i = 0; options.save[i] !== undefined; i++) {
			charmap[options.save[i]] = options.save[i];
		}
	}

	// Set whitespace characters that is not in the charmap
	// We do this since we'd like to handle explicit whitecharacters separately
	// from the charmap further down
	for (let i = 0; options.whitespaces[i] !== undefined; i++) {
		const whitespace = options.whitespaces[i];

		if (charmap[whitespace] === undefined) {
			whitespaces.push(whitespace);
		}
	}

	// Start with replacing multichars
	for (const searchChar of Object.keys(options.multiCharmap)) {
		str = str.split(searchChar).join(options.multiCharmap[searchChar]);
	}

	// Then replace all single characteres
	str = str.split('');
	for (let i = 0; str[i] !== undefined; i++) {
		const thisStr = str[i];

		// Whitespace found!
		if (whitespaces.indexOf(thisStr) !== -1) {
			if (prevWS === true && options.removeMultipleWhitespace === true) {
				str[i] = '';
			} else {
				str[i] = options.whitespaceReplaceChar;
			}
			prevWS = true;

		// No whitespace found
		} else {
			str[i] = charmap[thisStr] || options.unidentifiedReplaceChar;

			// If the previous character was a whitespace and the current should be ignored, set prevWS to true again
			if (prevWS === true && charmap[thisStr] === undefined && options.unidentifiedReplaceChar === '') {
				prevWS = true;
			} else {
				prevWS = false;
			}
		}
	}

	str = str.join('');

	return str;
};

exports.unidentifiedReplaceChar = '';
exports.whitespaceReplaceChar = '-';

exports.whitespaces = [' ', '\t', '\xa0']; // Last being a non breaking whitespace

// Taken from https://github.com/dodo/node-slug/blob/master/slug.js
exports.multiCharmap = {'<3': 'love', '&&': 'and', '||': 'or', 'w/': 'with'};

// Taken from https://github.com/dodo/node-slug/blob/master/slug.js
exports.charmap = {
	// ASCII alphabet and numbers
	0: '0', 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6',
	7: '7', 8: '8', 9: '9',
	A: 'A', B: 'B', C: 'C', D: 'D', E: 'E', F: 'F', G: 'G',
	H: 'H', I: 'I', J: 'J', K: 'K', L: 'L', M: 'M', N: 'N',
	O: 'O', P: 'P', Q: 'Q', R: 'R', S: 'S', T: 'T', U: 'U',
	V: 'V', W: 'W', X: 'X', Y: 'Y', Z: 'Z',
	a: 'a', b: 'b', c: 'c', d: 'd', e: 'e', f: 'f', g: 'g',
	h: 'h', i: 'i', j: 'j', k: 'k', l: 'l', m: 'm', n: 'n',
	o: 'o', p: 'p', q: 'q', r: 'r', s: 's', t: 't', u: 'u',
	v: 'v', w: 'w', x: 'x', y: 'y', z: 'z',
	// Latin
	À: 'A', Á: 'A', Â: 'A', Ã: 'A', Ä: 'A', Å: 'A', Æ: 'AE',
	Ç: 'C', È: 'E', É: 'E', Ê: 'E', Ë: 'E', Ì: 'I', Í: 'I',
	Î: 'I', Ï: 'I', Ð: 'D', Ñ: 'N', Ò: 'O', Ó: 'O', Ô: 'O',
	Õ: 'O', Ö: 'O', Ő: 'O', Ø: 'O', Ù: 'U', Ú: 'U', Û: 'U',
	Ü: 'U', Ű: 'U', Ý: 'Y', Þ: 'TH', ß: 'ss', à: 'a', á: 'a',
	â: 'a', ã: 'a', ä: 'a', å: 'a', æ: 'ae', ç: 'c', è: 'e',
	é: 'e', ê: 'e', ë: 'e', ì: 'i', í: 'i', î: 'i', ï: 'i',
	ð: 'd', ñ: 'n', ò: 'o', ó: 'o', ô: 'o', õ: 'o', ö: 'o',
	ő: 'o', ø: 'o', ù: 'u', ú: 'u', û: 'u', ü: 'u', ű: 'u',
	ý: 'y', þ: 'th', ÿ: 'y', ẞ: 'SS',
	// Greek
	α: 'a', β: 'b', γ: 'g', δ: 'd', ε: 'e', ζ: 'z', η: 'h', θ: '8',
	ι: 'i', κ: 'k', λ: 'l', μ: 'm', ν: 'n', ξ: '3', ο: 'o', π: 'p',
	ρ: 'r', σ: 's', τ: 't', υ: 'y', φ: 'f', χ: 'x', ψ: 'ps', ω: 'w',
	ά: 'a', έ: 'e', ί: 'i', ό: 'o', ύ: 'y', ή: 'h', ώ: 'w', ς: 's',
	ϊ: 'i', ΰ: 'y', ϋ: 'y', ΐ: 'i',
	Α: 'A', Β: 'B', Γ: 'G', Δ: 'D', Ε: 'E', Ζ: 'Z', Η: 'H', Θ: '8',
	Ι: 'I', Κ: 'K', Λ: 'L', Μ: 'M', Ν: 'N', Ξ: '3', Ο: 'O', Π: 'P',
	Ρ: 'R', Σ: 'S', Τ: 'T', Υ: 'Y', Φ: 'F', Χ: 'X', Ψ: 'PS', Ω: 'W',
	Ά: 'A', Έ: 'E', Ί: 'I', Ό: 'O', Ύ: 'Y', Ή: 'H', Ώ: 'W', Ϊ: 'I',
	Ϋ: 'Y',
	// Turkish
	ş: 's', Ş: 'S', ı: 'i', İ: 'I',
	ğ: 'g', Ğ: 'G',
	// Russian
	а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'zh',
	з: 'z', и: 'i', й: 'j', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o',
	п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'c',
	ч: 'ch', ш: 'sh', щ: 'sh', ъ: 'u', ы: 'y', ь: '', э: 'e', ю: 'yu',
	я: 'ya',
	А: 'A', Б: 'B', В: 'V', Г: 'G', Д: 'D', Е: 'E', Ё: 'Yo', Ж: 'Zh',
	З: 'Z', И: 'I', Й: 'J', К: 'K', Л: 'L', М: 'M', Н: 'N', О: 'O',
	П: 'P', Р: 'R', С: 'S', Т: 'T', У: 'U', Ф: 'F', Х: 'H', Ц: 'C',
	Ч: 'Ch', Ш: 'Sh', Щ: 'Sh', Ъ: 'U', Ы: 'Y', Ь: '', Э: 'E', Ю: 'Yu',
	Я: 'Ya',
	// Ukranian
	Є: 'Ye', І: 'I', Ї: 'Yi', Ґ: 'G', є: 'ye', і: 'i', ї: 'yi', ґ: 'g',
	// Czech
	č: 'c', ď: 'd', ě: 'e', ň: 'n', ř: 'r', š: 's', ť: 't', ů: 'u',
	ž: 'z', Č: 'C', Ď: 'D', Ě: 'E', Ň: 'N', Ř: 'R', Š: 'S', Ť: 'T',
	Ů: 'U', Ž: 'Z',
	// Slovak
	ľ: 'l', Ľ: 'L',
	// Polish
	ą: 'a', ć: 'c', ę: 'e', ł: 'l', ń: 'n', ś: 's', ź: 'z',
	ż: 'z', Ą: 'A', Ć: 'C', Ę: 'E', Ł: 'L', Ń: 'N', Ś: 'S',
	Ź: 'Z', Ż: 'Z',
	// Latvian
	ā: 'a', ē: 'e', ģ: 'g', ī: 'i', ķ: 'k', ļ: 'l', ņ: 'n',
	ū: 'u', Ā: 'A', Ē: 'E', Ģ: 'G', Ī: 'I',
	Ķ: 'K', Ļ: 'L', Ņ: 'N', Ū: 'U',
	// Lithuanian
	ė: 'e', į: 'i', ų: 'u', Ė: 'E', Į: 'I', Ų: 'U',
	// Romanian
	ț: 't', Ț: 'T', ţ: 't', Ţ: 'T', ș: 's', Ș: 'S', ă: 'a', Ă: 'A',
	// Vietnamese
	Ạ: 'A', Ả: 'A', Ầ: 'A', Ấ: 'A', Ậ: 'A', Ẩ: 'A', Ẫ: 'A',
	Ằ: 'A', Ắ: 'A', Ặ: 'A', Ẳ: 'A', Ẵ: 'A', Ẹ: 'E', Ẻ: 'E',
	Ẽ: 'E', Ề: 'E', Ế: 'E', Ệ: 'E', Ể: 'E', Ễ: 'E', Ị: 'I',
	Ỉ: 'I', Ĩ: 'I', Ọ: 'O', Ỏ: 'O', Ồ: 'O', Ố: 'O', Ộ: 'O',
	Ổ: 'O', Ỗ: 'O', Ơ: 'O', Ờ: 'O', Ớ: 'O', Ợ: 'O', Ở: 'O',
	Ỡ: 'O', Ụ: 'U', Ủ: 'U', Ũ: 'U', Ư: 'U', Ừ: 'U', Ứ: 'U',
	Ự: 'U', Ử: 'U', Ữ: 'U', Ỳ: 'Y', Ỵ: 'Y', Ỷ: 'Y', Ỹ: 'Y',
	Đ: 'D', ạ: 'a', ả: 'a', ầ: 'a', ấ: 'a', ậ: 'a', ẩ: 'a',
	ẫ: 'a', ằ: 'a', ắ: 'a', ặ: 'a', ẳ: 'a', ẵ: 'a', ẹ: 'e',
	ẻ: 'e', ẽ: 'e', ề: 'e', ế: 'e', ệ: 'e', ể: 'e', ễ: 'e',
	ị: 'i', ỉ: 'i', ĩ: 'i', ọ: 'o', ỏ: 'o', ồ: 'o', ố: 'o',
	ộ: 'o', ổ: 'o', ỗ: 'o', ơ: 'o', ờ: 'o', ớ: 'o', ợ: 'o',
	ở: 'o', ỡ: 'o', ụ: 'u', ủ: 'u', ũ: 'u', ư: 'u', ừ: 'u',
	ứ: 'u', ự: 'u', ử: 'u', ữ: 'u', ỳ: 'y', ỵ: 'y', ỷ: 'y',
	ỹ: 'y', đ: 'd',
	// Georgian
	ა: 'a', ბ: 'b', გ: 'g', დ: 'd', ე: 'e', ვ: 'v', ზ: 'z',
	თ: 't', ი: 'i', კ: 'k', ლ: 'l', მ: 'm', ნ: 'n', ო: 'o',
	პ: 'p', ჟ: 'zh', რ: 'r', ს: 's', ტ: 't', უ: 'u', ფ: 'f',
	ქ: 'q', ღ: 'gh', ყ: 'k', შ: 'sh', ჩ: 'ch', ც: 'ts', ძ: 'dz',
	წ: 'ts', ჭ: 'ch', ხ: 'kh', ჯ: 'j', ჰ: 'h',
	// Currency
	'€': 'euro', '₢': 'cruzeiro', '₣': 'french franc', '£': 'pound',
	'₤': 'lira', '₥': 'mill', '₦': 'naira', '₧': 'peseta', '₨': 'rupee',
	'₩': 'won', '₪': 'new shequel', '₫': 'dong', '₭': 'kip', '₮': 'tugrik',
	'₯': 'drachma', '₰': 'penny', '₱': 'peso', '₲': 'guarani', '₳': 'austral',
	'₴': 'hryvnia', '₵': 'cedi', '¢': 'cent', '¥': 'yen', 元: 'yuan',
	円: 'yen', '﷼': 'rial', '₠': 'ecu', '¤': 'currency', '฿': 'baht',
	$: 'dollar', '₹': 'indian rupee',
	// Symbols
	'©': '(c)', œ: 'oe', Œ: 'OE', '∑': 'sum', '®': '(r)', '†': '+',
	'“': '"', '”': '"', '‘': '\'', '’': '\'', '∂': 'd', ƒ: 'f', '™': 'tm',
	'℠': 'sm', '…': '...', '˚': 'o', º: 'o', ª: 'a', '•': '*',
	'∆': 'delta', '∞': 'infinity', '♥': 'love', '&': 'and', '|': 'or',
	'<': 'less', '>': 'greater',
	// Unicode
	'☢': 'radioactive',
	'☠': 'skull-and-bones',
	'☤': 'caduceus',
	'☣': 'biohazard',
	'☭': 'hammer-and-sickle',
	'☯': 'yin-yang',
	'☮': 'peace',
	'☏': 'telephone',
	'☔': 'umbrella-with-rain-drops',
	'☎': 'telephone',
	'☀': 'sun-with-rays',
	'★': 'star',
	'☂': 'umbrella',
	'☃': 'snowman',
	'✈': 'airplane',
	'✉': 'envelope',
	'✊': 'raised-fist'
};
