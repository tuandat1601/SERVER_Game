export class SensitiveWordFilter {
	//字典树
	private _trie: Map<string, any> = null!;

	constructor(sensitiveWords: string[]) {
		const root = new Map();

		for (const word of sensitiveWords) {
			let map = root;

			for (let i = 0; i < word.length; i++) {
				// 依次获取字
				const char = word.charAt(i);
				// 判断是否存在
				if (map.get(char)) {
					// 获取下一层节点
					map = map.get(char);
				} else {
					// 将当前节点设置为非结尾节点
					if (map.get('end') === 1) {
						map.set('end', 0);
					}
					const item = new Map();
					// 新增节点默认为结尾节点
					item.set('end', 1);
					map.set(char, item);
					map = map.get(char);
				}
			}
		}

		this._trie = root;
	}

	/**
	 * 检查敏感词是否存在
	 */
	private check(input: string, startIndex: number) {
		let trieNode = this._trie,
			success = false,
			wordNum = 0,
			sensitiveWord = '',
			start = -1,
			end = -1;

		for (let i = startIndex; i < input.length; i++) {
			const word = input.charAt(i);
			trieNode = trieNode.get(word);
			if (trieNode) {
				if (start == -1) {
					start = i;
				}
				wordNum++;
				sensitiveWord += word;
				if (trieNode.get('end') === 1) {
					success = true; // 表示已到词的结尾
					end = i;
					break;
				}
			} else {
				break;
			}
		}

		// 两字成词
		if (wordNum < 2) {
			success = false;
			start = end = -1;
		}

		return { success, sensitiveWord, start, end };
	}

	// 过滤掉除了中文、英文、数字之外的
	private trim(input: string): string {
		return input.replace(/[^\u4e00-\u9fa5\u0030-\u0039\u0061-\u007a\u0041-\u005a]+/g, '');
	}

	/**
	 * 搜索文本中是否存在敏感词
	 */
	public search(input: string) {
		let result;
		const content = this.trim(input);

		for (let i = 0, len = content.length; i < len; i++) {
			result = this.check(content, i);
			if (result.success) {
				break;
			}
		}

		return result;
	}

	public replace(input: string, replaceValue?: string) {
		const result = this.search(input);
		if (result?.success) {
			let words = this.trim(input).split('');
			let trimWords: any = {};

			if (input.length > words.length) {
				for (let i = 0, len = input.length; i < len; i++) {
					const char = input.charAt(i);
					if (words.indexOf(char) == -1) {
						trimWords[char] = i;
					}
				}
			}

			if (!replaceValue) {
				replaceValue = '*';
			}

			for (let i = result.start; i <= result.end; i++) {
				words[i] = replaceValue;
			}

			if (Object.keys(trimWords).length > 0) {
				for (const char in trimWords) {
					if (Object.prototype.hasOwnProperty.call(trimWords, char)) {
						const index = trimWords[char];
						words.splice(index, 0, char);
					}
				}
			}

			return words.join('');
		}

		return input;
	}
}

// module.exports = { sensitiveWordFilter: SensitiveWordFilter };
