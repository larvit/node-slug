import * as defaults from './defaults';

export type SlugifyOptions = {
	charmap?: Record<string, string>,
	multiCharmap?: Record<string, string>,
	removeMultipleWhitespace?: boolean,
	trim?: boolean,
	unidentifiedReplaceChar?: string,
	whitespaceReplaceChar?: string,
	whitespaces?: string[],
	save?: string | string[],
}

export const defaultCharmap = defaults.charmap;

export function slugify(str: string | number, options?: SlugifyOptions | string): string {
	if (typeof options === 'string') {
		options = { whitespaceReplaceChar: options };
	}

	options ??= {};
	options.charmap ??= defaults.charmap;
	options.multiCharmap ??= defaults.multiCharmap;
	options.removeMultipleWhitespace ??= true;
	options.trim ??= true;
	options.unidentifiedReplaceChar ??= defaults.unidentifiedReplaceChar;
	options.whitespaceReplaceChar ??= defaults.whitespaceReplaceChar;
	options.whitespaces ??= defaults.whitespaces;

	// Copy the charmap object so we do not screw up the original one
	const charmap = { ...options.charmap };

	// Convert input to string
	str = String(str);

	if (options.trim) {
		str = str.trim();
	}

	// Shorthand for saving characters
	if (options.save) {
		if (!Array.isArray(options.save)) {
			options.save = [options.save];
		}

		for (const saveChar of options.save) {
			charmap[saveChar] = saveChar;
		}
	}

	// Set whitespace characters that is not in the charmap
	// We do this since we'd like to handle explicit whitecharacters separately
	// from the charmap further down
	const whitespaces: string[] = [];
	for (const whitespace of options.whitespaces) {
		if (charmap[whitespace] === undefined) {
			whitespaces.push(whitespace);
		}
	}

	// Start with replacing multichars
	for (const searchChar of Object.keys(options.multiCharmap)) {
		str = str.split(searchChar).join(options.multiCharmap[searchChar]);
	}

	// Then replace all single characteres
	const strArr = str.split('');
	let prevWS = false;
	for (let i = 0; i < strArr.length; i++) {
		const thisStr = strArr[i];

		if (whitespaces.includes(thisStr)) {
			// Whitespace found!
			strArr[i] = prevWS && options.removeMultipleWhitespace ? '' : options.whitespaceReplaceChar;
			prevWS = true;
		} else {
			// No whitespace found
			strArr[i] = charmap[thisStr] ?? options.unidentifiedReplaceChar;

			// If the previous character was a whitespace and the current should be ignored, set prevWS to true again
			if (prevWS && charmap[thisStr] === undefined && options.unidentifiedReplaceChar === '') {
				prevWS = true;
			} else {
				prevWS = false;
			}
		}
	}

	const result = strArr.join('');

	return result;
}
