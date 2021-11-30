import assert from 'assert';
import { slugify, defaultCharmap } from '../src/index';

describe('slugify', () => {
	it('should convert input to string', done => {
		assert.strictEqual(slugify(1), '1');
		assert.strictEqual(slugify(567890), '567890');
		done();
	});

	it('should replace whitespaces with replacement', done => {
		assert.strictEqual(slugify('foo bar buz'), 'foo-bar-buz');
		assert.strictEqual(slugify('foo bar buz', { whitespaceReplaceChar: '_' }), 'foo_bar_buz');
		assert.strictEqual(slugify('foo bar buz', '_'), 'foo_bar_buz');
		assert.strictEqual(slugify('foo bar buz', { whitespaceReplaceChar: '' }), 'foobarbuz');
		assert.strictEqual(slugify('foo bar buz', ''), 'foobarbuz');
		done();
	});

	it('should remove trailing space if any', done => {
		assert.strictEqual(slugify(' foo bar baz '), 'foo-bar-baz');
		assert.strictEqual(slugify(' foo bar baz ', { trim: false }), '-foo-bar-baz-');
		done();
	});

	it('should trim leading / trailing separators', done => {
		const text = '--words go here--';
		const expected = 'words-go-here';

		assert.strictEqual(slugify(text), expected);
		done();
	});

	it('should remove trailing separator if any', done => {
		assert.strictEqual(slugify(' foo bar baz-'), 'foo-bar-baz');
		done();
	});

	it('should remove not allowed chars', done => {
		assert.strictEqual(slugify('foo, bar baz'), 'foo-bar-baz');
		assert.strictEqual(slugify('foo- bar baz'), 'foo-bar-baz');
		assert.strictEqual(slugify('foo] bar baz'), 'foo-bar-baz');
		done();
	});

	it('should leave allowed custom chars', done => {
		const allowed = ['.', '_', '~', '/'];

		for (let i = 0; allowed[i] !== undefined; i++) {
			const charmap = { ...defaultCharmap };

			charmap[allowed[i]] = allowed[i];
			assert.strictEqual(slugify('bar ' + allowed[i] + ' foo baz', { charmap: charmap }), 'bar-' + allowed[i] + '-foo-baz');
			assert.strictEqual(slugify('bar ' + allowed[i] + ' foo baz'), 'bar-foo-baz');
		}

		done();
	});

	it('should remove multiple whitespaces', done => {
		assert.strictEqual(slugify('foo  bar baz'), 'foo-bar-baz');
		assert.strictEqual(slugify('foo   bar     baz'), 'foo-bar-baz');
		assert.strictEqual(slugify('foo  bar baz', { removeMultipleWhitespace: false }), 'foo--bar-baz');
		done();
	});

	it('should replace latin chars', done => {
		const charmap: Record<string, string> = {
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
			ÿ: 'y', ẞ: 'SS',
		};

		for (const char of Object.keys(charmap)) {
			assert.strictEqual(slugify('foo ' + char + ' bar baz'), 'foo-' + charmap[char] + '-bar-baz');
		}

		done();
	});

	it('should replace greek chars', done => {
		const charmap: Record<string, string> = {
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
			Ή: 'H', Ώ: 'W', Ϊ: 'I', Ϋ: 'Y',
		};

		for (const char of Object.keys(charmap)) {
			assert.strictEqual(slugify('foo ' + char + ' bar baz'), 'foo-' + charmap[char] + '-bar-baz');
		}

		done();
	});

	it('should replace turkish chars', done => {
		const charmap: Record<string, string> = {
			ş: 's', Ş: 'S', ı: 'i', İ: 'I', ç: 'c',
			Ç: 'C', ü: 'u', Ü: 'U', ö: 'o', Ö: 'O',
			ğ: 'g', Ğ: 'G',
		};

		for (const char of Object.keys(charmap)) {
			assert.strictEqual(slugify('foo ' + char + ' bar baz'), 'foo-' + charmap[char] + '-bar-baz');
		}

		done();
	});

	it('should replace cyrillic chars', done => {
		const charmap: Record<string, string> = {
			а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'zh',
			з: 'z', и: 'i', й: 'j', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o',
			п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'c',
			ч: 'ch', ш: 'sh', щ: 'sh', ъ: 'u', ы: 'y', ь: '', э: 'e', ю: 'yu',
			я: 'ya', А: 'A', Б: 'B', В: 'V', Г: 'G', Д: 'D', Е: 'E', Ё: 'Yo',
			Ж: 'Zh', З: 'Z', И: 'I', Й: 'J', К: 'K', Л: 'L', М: 'M', Н: 'N',
			О: 'O', П: 'P', Р: 'R', С: 'S', Т: 'T', У: 'U', Ф: 'F', Х: 'H',
			Ц: 'C', Ч: 'Ch', Ш: 'Sh', Щ: 'Sh', Ъ: 'U', Ы: 'Y', Ь: '', Э: 'E',
			Ю: 'Yu', Я: 'Ya', Є: 'Ye', І: 'I', Ї: 'Yi', Ґ: 'G', є: 'ye', і: 'i',
			ї: 'yi', ґ: 'g',
		};

		for (const char of Object.keys(charmap)) {
			assert.strictEqual(slugify('foo ' + char + ' bar baz'), 'foo-' + charmap[char] + '-bar-baz');
		}

		done();
	});

	it('should replace czech chars', done => {
		const charmap: Record<string, string> = {
			č: 'c', ď: 'd', ě: 'e', ň: 'n', ř: 'r',
			š: 's', ť: 't', ů: 'u', ž: 'z', Č: 'C',
			Ď: 'D', Ě: 'E', Ň: 'N', Ř: 'R', Š: 'S',
			Ť: 'T', Ů: 'U', Ž: 'Z',
		};

		for (const char of Object.keys(charmap)) {
			assert.strictEqual(slugify('foo ' + char + ' bar baz'), 'foo-' + charmap[char] + '-bar-baz');
		}

		done();
	});

	it('should replace slovakian chars', done => {
		const charmap: Record<string, string> = {
			ľ: 'l', Ľ: 'L',
		};

		for (const char of Object.keys(charmap)) {
			assert.strictEqual(slugify('foo ' + char + ' bar baz'), 'foo-' + charmap[char] + '-bar-baz');
		}

		done();
	});

	it('should replace polish chars', done => {
		const charmap: Record<string, string> = {
			ą: 'a', ć: 'c', ę: 'e', ł: 'l', ń: 'n',
			ó: 'o', ś: 's', ź: 'z', ż: 'z', Ą: 'A',
			Ć: 'C', Ę: 'E', Ł: 'L', Ń: 'N', Ś: 'S',
			Ź: 'Z', Ż: 'Z',
		};

		for (const char of Object.keys(charmap)) {
			assert.strictEqual(slugify('foo ' + char + ' bar baz'), 'foo-' + charmap[char] + '-bar-baz');
		}

		done();
	});

	it('should replace latvian chars', done => {
		const charmap: Record<string, string> = {
			ā: 'a', č: 'c', ē: 'e', ģ: 'g', ī: 'i',
			ķ: 'k', ļ: 'l', ņ: 'n', š: 's', ū: 'u',
			ž: 'z', Ā: 'A', Č: 'C', Ē: 'E', Ģ: 'G',
			Ī: 'I', Ķ: 'K', Ļ: 'L', Ņ: 'N', Š: 'S',
			Ū: 'U', Ž: 'Z',
		};

		for (const char of Object.keys(charmap)) {
			assert.strictEqual(slugify('foo ' + char + ' bar baz'), 'foo-' + charmap[char] + '-bar-baz');
		}

		done();
	});

	it('should replace vietnamese chars', done => {
		const charmap: Record<string, string> = {
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
			ỵ: 'y', ỷ: 'y', ỹ: 'y', đ: 'd',
		};

		for (const char of Object.keys(charmap)) {
			assert.strictEqual(slugify('foo ' + char + ' bar baz'), 'foo-' + charmap[char] + '-bar-baz');
		}

		done();
	});

	it('should replace georgian chars', done => {
		const charmap: Record<string, string> = {
			ა: 'a', ბ: 'b', გ: 'g', დ: 'd', ე: 'e', ვ: 'v', ზ: 'z',
			თ: 't', ი: 'i', კ: 'k', ლ: 'l', მ: 'm', ნ: 'n', ო: 'o',
			პ: 'p', ჟ: 'zh', რ: 'r', ს: 's', ტ: 't', უ: 'u', ფ: 'f',
			ქ: 'q', ღ: 'gh', ყ: 'k', შ: 'sh', ჩ: 'ch', ც: 'ts', ძ: 'dz',
			წ: 'ts', ჭ: 'ch', ხ: 'kh', ჯ: 'j', ჰ: 'h',
		};

		for (const char of Object.keys(charmap)) {
			assert.strictEqual(slugify('foo ' + char + ' bar baz'), 'foo-' + charmap[char] + '-bar-baz');
		}

		done();
	});

	it('should replace currencies', done => {
		const charmap: Record<string, string> = {
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
			$: 'dollar',
		};

		for (const char of Object.keys(charmap)) {
			assert.strictEqual(slugify('foo ' + char + ' bar baz'), 'foo-' + charmap[char] + '-bar-baz');
		}

		done();
	});

	it('should replace symbols', done => {
		const charmap: Record<string, string> = {
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
			'>': 'greater',
		};

		for (const char of Object.keys(charmap)) {
			assert.strictEqual(slugify('foo ' + char + ' bar baz'), 'foo-' + charmap[char] + '-bar-baz');
		}

		done();
	});

	it('should strip some symbols not in charmap', done => {
		const charmap = ['ħ', 'ĸ'];

		for (let i = 0; charmap[i] !== undefined; i++) {
			const char = charmap[i];

			assert.strictEqual(slugify('foo ' + char + ' bar baz'), 'foo-bar-baz');
		}

		done();
	});

	it('should replace unicode', done => {
		const charmap: Record<string, string> = {
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
			'✊': 'raised-fist',
		};

		for (const char of Object.keys(charmap)) {
			assert.strictEqual(slugify('foo ' + char + ' bar baz'), 'foo-' + charmap[char] + '-bar-baz');
		}

		done();
	});

	it('should allow altering the charmap', done => {
		const charmap = {
			f: 'ph',
			o: '0',
			b: '8',
			a: '4',
			r: '2',
			z: '5',
		};

		assert.strictEqual(slugify('foo bar baz', { charmap: charmap }), 'ph00-842-845');
		done();
	});

	it('should replace lithuanian characters', done => {
		assert.strictEqual(slugify('ąčęėįšųūžĄČĘĖĮŠŲŪŽ'), 'aceeisuuzACEEISUUZ');
		done();
	});

	it('should replace multichars', done => {
		assert.strictEqual(slugify('w/ <3 && sugar || ☠'), 'with-love-and-sugar-or-skull-and-bones');
		done();
	});

	it('should replace multichars with custom multicharmap', done => {
		assert.strictEqual(slugify('hej !! korv', { multiCharmap: { '!!': '12' } }), 'hej-12-korv');
		done();
	});

	it('should be flavourable', done => {
		const text = 'It\'s your journey ... we guide you through.';
		const expected = 'Its-your-journey-we-guide-you-through';

		assert.strictEqual(slugify(text), expected);
		done();
	});

	it('should save some character', done => {
		const text = 'It\'s Your Jöurney We Guide You Through.';
		const expected = 'Its-Your-Jöurney-We-Guide-You-Through';

		// Load in default charmap
		const charmap = { ...defaultCharmap };

		// Set to save ö
		charmap['ö'] = 'ö';

		assert.strictEqual(slugify(text, { charmap: charmap }), expected);
		done();
	});

	it('should save some character method 2', done => {
		const text = 'It\'s Your Jöurney We Guide You Through!';
		const expected = 'Its-Your-Jöurney-We-Guide-You-Through';

		assert.strictEqual(slugify(text, { save: 'ö' }), expected);
		done();
	});

	it('should save some character method 2 multiple characters', done => {
		const text = 'It\'s Your Jöurney We Guide You Through!';
		const expected = 'Its-Your-Jöurney-We-Guide-You-Through!';

		assert.strictEqual(slugify(text, { save: ['ö', '!'] }), expected);
		done();
	});

	it('should save the dot character', done => {
		const text = 'It\'s Your Jöurney We Guide You Through.';
		const expected = 'Its-Your-Journey-We-Guide-You-Through.';

		// Load in default charmap
		const charmap = { ...defaultCharmap };

		// Set to save .
		charmap['.'] = '.';

		assert.strictEqual(slugify(text, { charmap: charmap }), expected);
		done();
	});

	it('should save some characters', done => {
		const text = 'It\'s Your/Journey We Guide You Through €.';
		const expected = 'Its-Your/Journey-We-Guide-You-Through-€';

		// Load in default charmap
		const charmap = { ...defaultCharmap };

		// Set to save some chars
		charmap['/'] = '/';
		charmap['€'] = '€';

		assert.strictEqual(slugify(text, { charmap: charmap }), expected);
		done();
	});

	it('should use provided unidentifiedReplaceChar when char is not found in charmap', done => {
		const charmap: Record<string, string> = {
			k: 't',
			o: 'o',
			r: 'l',
			v: 'v',
		};

		assert.strictEqual(slugify('korv-', { charmap, unidentifiedReplaceChar: '!' }), 'tolv!');
		done();
	});

	it('should use provided whitespaces and only replace those', done => {
		const whitespaces = [' '];

		assert.strictEqual(slugify('tab is\tremoved', { whitespaces }), 'tab-isremoved');
		done();
	});

	it('should prioritize whitespace from charmap if it is specified there', done => {
		const charmap: Record<string, string> = {
			...defaultCharmap,
			' ': '[space]',
		};

		assert.strictEqual(slugify('space from charmap', { charmap }), 'space[space]from[space]charmap');
		done();
	});

	it('should use unidentifiedReplaceChar only when no entry is found in charmap, even if its an empty string', done => {
		const charmap: Record<string, string> = {
			a: 'a',
			b: '',
		};

		assert.strictEqual(slugify('aba!', { charmap, unidentifiedReplaceChar: '?' }), 'aa?');
		done();
	});

	it('should should convert bad input null and undefined to strings', done => {
		assert.strictEqual(slugify(null as any), 'null');
		assert.strictEqual(slugify(undefined as any), 'undefined');
		done();
	});

	it('should should convert bad input boolean to strings', done => {
		assert.strictEqual(slugify(true as any), 'true');
		assert.strictEqual(slugify(false as any), 'false');
		done();
	});
});
