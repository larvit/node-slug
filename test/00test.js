'use strict';

const assert = require('assert');
const slug = require(__dirname + '/../index.js');

describe('slug', function () {
	it('should convert input to string', function (done) {
		assert.strictEqual(slug(1), '1');
		assert.strictEqual(slug(567890), '567890');
		done();
	});

	it('should replace whitespaces with replacement', function (done) {
		assert.strictEqual(slug('foo bar buz'), 'foo-bar-buz');
		assert.strictEqual(slug('foo bar buz', {whitespaceReplaceChar: '_'}), 'foo_bar_buz');
		assert.strictEqual(slug('foo bar buz', '_'), 'foo_bar_buz');
		assert.strictEqual(slug('foo bar buz', {whitespaceReplaceChar: ''}), 'foobarbuz');
		assert.strictEqual(slug('foo bar buz', ''), 'foobarbuz');
		done();
	});

	it('should remove trailing space if any', function (done) {
		assert.strictEqual(slug(' foo bar baz '), 'foo-bar-baz');
		assert.strictEqual(slug(' foo bar baz ', {trim: false}), '-foo-bar-baz-');
		done();
	});

	it('should trim leading / trailing separators', function (done) {
		const text = '--words go here--';
		const expected = 'words-go-here';

		assert.strictEqual(slug(text), expected);
		done();
	});

	it('should remove trailing separator if any', function (done) {
		assert.strictEqual(slug(' foo bar baz-'), 'foo-bar-baz');
		done();
	});

	it('should remove not allowed chars', function (done) {
		assert.strictEqual(slug('foo, bar baz'), 'foo-bar-baz');
		assert.strictEqual(slug('foo- bar baz'), 'foo-bar-baz');
		assert.strictEqual(slug('foo] bar baz'), 'foo-bar-baz');
		done();
	});

	it('should leave allowed custom chars', function (done) {
		const allowed = ['.', '_', '~', '/'];

		for (let i = 0; allowed[i] !== undefined; i++) {
			const charmap = {};

			Object.assign(charmap, slug.charmap);
			charmap[allowed[i]] = allowed[i];
			assert.strictEqual(slug('bar ' + allowed[i] + ' foo baz', {charmap: charmap}), 'bar-' + allowed[i] + '-foo-baz');
			assert.strictEqual(slug('bar ' + allowed[i] + ' foo baz'), 'bar-foo-baz');
		}

		done();
	});

	it('should remove multiple whitespaces', function (done) {
		assert.strictEqual(slug('foo  bar baz'), 'foo-bar-baz');
		assert.strictEqual(slug('foo   bar     baz'), 'foo-bar-baz');
		assert.strictEqual(slug('foo  bar baz', {removeMultipleWhitespace: false}), 'foo--bar-baz');
		done();
	});

	it('should replace latin chars', function (done) {
		const charmap = {
			À: 'A', Á: 'A', Â: 'A', Ã: 'A', Ä: 'A',
			Å: 'A', Æ: 'AE', Ç: 'C', È: 'E', É: 'E',
			Ê: 'E', Ë: 'E', Ì: 'I', Í: 'I', Î: 'I',
			Ï: 'I', Ð: 'D', Ñ: 'N', Ò: 'O', Ó: 'O',
			Ô: 'O', Õ: 'O', Ö: 'O', Ő: 'O', Ø: 'O',
			Ù: 'U', Ú: 'U', Û: 'U', Ü: 'U', Ű: 'U',
			Ý: 'Y', Þ: 'TH', ß: 'ss', à: 'a', á: 'a',
			â: 'a', ã: 'a', ä: 'a', å: 'a', æ: 'ae',
			ç: 'c', è: 'e', é: 'e', ê: 'e', ë: 'e',
			ì: 'i', í: 'i', î: 'i', ï: 'i', ð: 'd',
			ñ: 'n', ò: 'o', ó: 'o', ô: 'o', õ: 'o',
			ö: 'o', ő: 'o', ø: 'o', ù: 'u', ú: 'u',
			û: 'u', ü: 'u', ű: 'u', ý: 'y', þ: 'th',
			ÿ: 'y', ẞ: 'SS'
		};

		for (const char of Object.keys(charmap)) {
			assert.strictEqual(slug('foo ' + char + ' bar baz'), 'foo-' + charmap[char] + '-bar-baz');
		}

		done();
	});

	it('should replace greek chars', function (done) {
		const charmap = {
			α: 'a', β: 'b', γ: 'g', δ: 'd', ε: 'e',
			ζ: 'z', η: 'h', θ: '8', ι: 'i', κ: 'k',
			λ: 'l', μ: 'm', ν: 'n', ξ: '3', ο: 'o',
			π: 'p', ρ: 'r', σ: 's', τ: 't', υ: 'y',
			φ: 'f', χ: 'x', ψ: 'ps', ω: 'w', ά: 'a',
			έ: 'e', ί: 'i', ό: 'o', ύ: 'y', ή: 'h',
			ώ: 'w', ς: 's', ϊ: 'i', ΰ: 'y', ϋ: 'y',
			ΐ: 'i', Α: 'A', Β: 'B', Γ: 'G', Δ: 'D',
			Ε: 'E', Ζ: 'Z', Η: 'H', Θ: '8', Ι: 'I',
			Κ: 'K', Λ: 'L', Μ: 'M', Ν: 'N', Ξ: '3',
			Ο: 'O', Π: 'P', Ρ: 'R', Σ: 'S', Τ: 'T',
			Υ: 'Y', Φ: 'F', Χ: 'X', Ψ: 'PS', Ω: 'W',
			Ά: 'A', Έ: 'E', Ί: 'I', Ό: 'O', Ύ: 'Y',
			Ή: 'H', Ώ: 'W', Ϊ: 'I', Ϋ: 'Y'
		};

		for (const char of Object.keys(charmap)) {
			assert.strictEqual(slug('foo ' + char + ' bar baz'), 'foo-' + charmap[char] + '-bar-baz');
		}

		done();
	});

	it('should replace turkish chars', function (done) {
		const charmap = {
			ş: 's', Ş: 'S', ı: 'i', İ: 'I', ç: 'c',
			Ç: 'C', ü: 'u', Ü: 'U', ö: 'o', Ö: 'O',
			ğ: 'g', Ğ: 'G'
		};

		for (const char of Object.keys(charmap)) {
			assert.strictEqual(slug('foo ' + char + ' bar baz'), 'foo-' + charmap[char] + '-bar-baz');
		}

		done();
	});

	it('should replace cyrillic chars', function (done) {
		const charmap = {
			а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'zh',
			з: 'z', и: 'i', й: 'j', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o',
			п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'c',
			ч: 'ch', ш: 'sh', щ: 'sh', ъ: 'u', ы: 'y', ь: '', э: 'e', ю: 'yu',
			я: 'ya', А: 'A', Б: 'B', В: 'V', Г: 'G', Д: 'D', Е: 'E', Ё: 'Yo',
			Ж: 'Zh', З: 'Z', И: 'I', Й: 'J', К: 'K', Л: 'L', М: 'M', Н: 'N',
			О: 'O', П: 'P', Р: 'R', С: 'S', Т: 'T', У: 'U', Ф: 'F', Х: 'H',
			Ц: 'C', Ч: 'Ch', Ш: 'Sh', Щ: 'Sh', Ъ: 'U', Ы: 'Y', Ь: '', Э: 'E',
			Ю: 'Yu', Я: 'Ya', Є: 'Ye', І: 'I', Ї: 'Yi', Ґ: 'G', є: 'ye', і: 'i',
			ї: 'yi', ґ: 'g'
		};

		for (const char of Object.keys(charmap)) {
			assert.strictEqual(slug('foo ' + char + ' bar baz'), 'foo-' + charmap[char] + '-bar-baz');
		}

		done();
	});

	it('should replace czech chars', function (done) {
		const charmap = {
			č: 'c', ď: 'd', ě: 'e', ň: 'n', ř: 'r',
			š: 's', ť: 't', ů: 'u', ž: 'z', Č: 'C',
			Ď: 'D', Ě: 'E', Ň: 'N', Ř: 'R', Š: 'S',
			Ť: 'T', Ů: 'U', Ž: 'Z'
		};

		for (const char of Object.keys(charmap)) {
			assert.strictEqual(slug('foo ' + char + ' bar baz'), 'foo-' + charmap[char] + '-bar-baz');
		}

		done();
	});

	it('should replace slovakian chars', function (done) {
		const charmap = {
			ľ: 'l', Ľ: 'L'
		};

		for (const char of Object.keys(charmap)) {
			assert.strictEqual(slug('foo ' + char + ' bar baz'), 'foo-' + charmap[char] + '-bar-baz');
		}

		done();
	});

	it('should replace polish chars', function (done) {
		const charmap = {
			ą: 'a', ć: 'c', ę: 'e', ł: 'l', ń: 'n',
			ó: 'o', ś: 's', ź: 'z', ż: 'z', Ą: 'A',
			Ć: 'C', Ę: 'E', Ł: 'L', Ń: 'N', Ś: 'S',
			Ź: 'Z', Ż: 'Z'
		};

		for (const char of Object.keys(charmap)) {
			assert.strictEqual(slug('foo ' + char + ' bar baz'), 'foo-' + charmap[char] + '-bar-baz');
		}

		done();
	});

	it('should replace latvian chars', function (done) {
		const charmap = {
			ā: 'a', č: 'c', ē: 'e', ģ: 'g', ī: 'i',
			ķ: 'k', ļ: 'l', ņ: 'n', š: 's', ū: 'u',
			ž: 'z', Ā: 'A', Č: 'C', Ē: 'E', Ģ: 'G',
			Ī: 'I', Ķ: 'K', Ļ: 'L', Ņ: 'N', Š: 'S',
			Ū: 'U', Ž: 'Z'
		};

		for (const char of Object.keys(charmap)) {
			assert.strictEqual(slug('foo ' + char + ' bar baz'), 'foo-' + charmap[char] + '-bar-baz');
		}

		done();
	});

	it('should replace vietnamese chars', function (done) {
		const charmap = {
			Ạ: 'A', Ả: 'A', Ầ: 'A', Ấ: 'A', Ậ: 'A', Ẩ: 'A', Ẫ: 'A', Ằ: 'A',
			Ắ: 'A', Ặ: 'A', Ẳ: 'A', Ẵ: 'A', Ẹ: 'E', Ẻ: 'E', Ẽ: 'E', Ề: 'E',
			Ế: 'E', Ệ: 'E', Ể: 'E', Ễ: 'E', Ị: 'I', Ỉ: 'I', Ĩ: 'I', Ọ: 'O',
			Ỏ: 'O', Ồ: 'O', Ố: 'O', Ộ: 'O', Ổ: 'O', Ỗ: 'O', Ơ: 'O', Ờ: 'O',
			Ớ: 'O', Ợ: 'O', Ở: 'O', Ỡ: 'O', Ụ: 'U', Ủ: 'U', Ũ: 'U', Ư: 'U',
			Ừ: 'U', Ứ: 'U', Ự: 'U', Ử: 'U', Ữ: 'U', Ỳ: 'Y', Ỵ: 'Y', Ỷ: 'Y',
			Ỹ: 'Y', Đ: 'D', ạ: 'a', ả: 'a', ầ: 'a', ấ: 'a', ậ: 'a', ẩ: 'a',
			ẫ: 'a', ằ: 'a', ắ: 'a', ặ: 'a', ẳ: 'a', ẵ: 'a', ẹ: 'e', ẻ: 'e',
			ẽ: 'e', ề: 'e', ế: 'e', ệ: 'e', ể: 'e', ễ: 'e', ị: 'i', ỉ: 'i',
			ĩ: 'i', ọ: 'o', ỏ: 'o', ồ: 'o', ố: 'o', ộ: 'o', ổ: 'o', ỗ: 'o',
			ơ: 'o', ờ: 'o', ớ: 'o', ợ: 'o', ở: 'o', ỡ: 'o', ụ: 'u', ủ: 'u',
			ũ: 'u', ư: 'u', ừ: 'u', ứ: 'u', ự: 'u', ử: 'u', ữ: 'u', ỳ: 'y',
			ỵ: 'y', ỷ: 'y', ỹ: 'y', đ: 'd'
		};

		for (const char of Object.keys(charmap)) {
			assert.strictEqual(slug('foo ' + char + ' bar baz'), 'foo-' + charmap[char] + '-bar-baz');
		}

		done();
	});

	it('should replace georgian chars', function (done) {
		const charmap = {
			ა: 'a', ბ: 'b', გ: 'g', დ: 'd', ე: 'e', ვ: 'v', ზ: 'z',
			თ: 't', ი: 'i', კ: 'k', ლ: 'l', მ: 'm', ნ: 'n', ო: 'o',
			პ: 'p', ჟ: 'zh', რ: 'r', ს: 's', ტ: 't', უ: 'u', ფ: 'f',
			ქ: 'q', ღ: 'gh', ყ: 'k', შ: 'sh', ჩ: 'ch', ც: 'ts', ძ: 'dz',
			წ: 'ts', ჭ: 'ch', ხ: 'kh', ჯ: 'j', ჰ: 'h'
		};

		for (const char of Object.keys(charmap)) {
			assert.strictEqual(slug('foo ' + char + ' bar baz'), 'foo-' + charmap[char] + '-bar-baz');
		}

		done();
	});

	it('should replace currencies', function (done) {
		const charmap = {
			'€': 'euro',
			'₢': 'cruzeiro',
			'₣': 'french franc',
			'£': 'pound',
			'₤': 'lira',
			'₥': 'mill',
			'₦': 'naira',
			'₧': 'peseta',
			'₨': 'rupee',
			'₹': 'indian rupee',
			'₩': 'won',
			'₪': 'new shequel',
			'₫': 'dong',
			'₭': 'kip',
			'₮': 'tugrik',
			'₯': 'drachma',
			'₰': 'penny',
			'₱': 'peso',
			'₲': 'guarani',
			'₳': 'austral',
			'₴': 'hryvnia',
			'₵': 'cedi',
			'¢': 'cent',
			'¥': 'yen',
			元: 'yuan',
			円: 'yen',
			'﷼': 'rial',
			'₠': 'ecu',
			'¤': 'currency',
			'฿': 'baht',
			$: 'dollar'
		};

		for (const char of Object.keys(charmap)) {
			assert.strictEqual(slug('foo ' + char + ' bar baz'), 'foo-' + charmap[char] + '-bar-baz');
		}

		done();
	});

	it('should replace symbols', function (done) {
		const charmap = {
			'©': '(c)',
			œ: 'oe',
			Œ: 'OE',
			'∑': 'sum',
			'®': '(r)',
			'∂': 'd',
			ƒ: 'f',
			'™': 'tm',
			'℠': 'sm',
			'…': '...',
			'˚': 'o',
			º: 'o',
			ª: 'a',
			'∆': 'delta',
			'∞': 'infinity',
			'♥': 'love',
			'&': 'and',
			'|': 'or',
			'<': 'less',
			'>': 'greater'
		};

		for (const char of Object.keys(charmap)) {
			assert.strictEqual(slug('foo ' + char + ' bar baz'), 'foo-' + charmap[char] + '-bar-baz');
		}

		done();
	});

	it('should strip some symbols not in charmap', function (done) {
		const charmap = ['ħ', 'ĸ'];

		for (let i = 0; charmap[i] !== undefined; i++) {
			const char = charmap[i];

			assert.strictEqual(slug('foo ' + char + ' bar baz'), 'foo-bar-baz');
		}

		done();
	});

	it('should replace unicode', function (done) {
		const charmap = {
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

		for (const char of Object.keys(charmap)) {
			assert.strictEqual(slug('foo ' + char + ' bar baz'), 'foo-' + charmap[char] + '-bar-baz');
		}

		done();
	});

	it('should allow altering the charmap', function (done) {
		const charmap = {
			f: 'ph',
			o: '0',
			b: '8',
			a: '4',
			r: '2',
			z: '5'
		};

		assert.strictEqual(slug('foo bar baz', {charmap: charmap}), 'ph00-842-845');
		done();
	});

	it('should replace lithuanian characters', function (done) {
		assert.strictEqual(slug('ąčęėįšųūžĄČĘĖĮŠŲŪŽ'), 'aceeisuuzACEEISUUZ');
		done();
	});

	it('should replace multichars', function (done) {
		assert.strictEqual(slug('w/ <3 && sugar || ☠'), 'with-love-and-sugar-or-skull-and-bones');
		done();
	});

	it('should be flavourable', function (done) {
		const text = 'It\'s your journey ... we guide you through.';
		const expected = 'Its-your-journey-we-guide-you-through';

		assert.strictEqual(slug(text), expected);
		done();
	});

	it('should save some character', function (done) {
		const text = 'It\'s Your Jöurney We Guide You Through.';
		const expected = 'Its-Your-Jöurney-We-Guide-You-Through';
		const charmap = {};

		// Load in default charmap
		Object.assign(charmap, slug.charmap);

		// Set to save ö
		charmap['ö'] = 'ö';

		assert.strictEqual(slug(text, {charmap: charmap}), expected);
		done();
	});

	it('should save some character method 2', function (done) {
		const text = 'It\'s Your Jöurney We Guide You Through!';
		const expected = 'Its-Your-Jöurney-We-Guide-You-Through';

		assert.strictEqual(slug(text, {save: 'ö'}), expected);
		done();
	});

	it('should save some character method 2 multiple characters', function (done) {
		const text = 'It\'s Your Jöurney We Guide You Through!';
		const expected = 'Its-Your-Jöurney-We-Guide-You-Through!';

		assert.strictEqual(slug(text, {save: ['ö', '!']}), expected);
		done();
	});

	it('should save the dot character', function (done) {
		const text = 'It\'s Your Jöurney We Guide You Through.';
		const expected = 'Its-Your-Journey-We-Guide-You-Through.';
		const charmap = {};

		// Load in default charmap
		Object.assign(charmap, slug.charmap);

		// Set to save .
		charmap['.'] = '.';

		assert.strictEqual(slug(text, {charmap: charmap}), expected);
		done();
	});

	it('should save some characters', function (done) {
		const text = 'It\'s Your/Journey We Guide You Through €.';
		const expected = 'Its-Your/Journey-We-Guide-You-Through-€';
		const charmap = {};

		// Load in default charmap
		Object.assign(charmap, slug.charmap);

		// Set to save some chars
		charmap['/'] = '/';
		charmap['€'] = '€';

		assert.strictEqual(slug(text, {charmap: charmap}), expected);
		done();
	});

	return it('should not crash when sending invalid input, but instead return false', function (done) {
		const text = null;
		const expected = 'null';

		assert.strictEqual(slug(text), expected);
		done();
	});
});
