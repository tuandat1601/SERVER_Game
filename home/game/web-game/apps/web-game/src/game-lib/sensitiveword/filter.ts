import fs from 'fs';
// const path = require('path');
import { exit } from 'process';
import { SensitiveWordFilter } from "./sensitivewordfilter";
export class Filter {
	static gfile: any
	static search(str: string) {
		if (!this.gfile) {
			let path = 'apps/web-game/src/game-lib/sensitiveword/badwords.txt'
			try {
				this.gfile = fs.readFileSync(path);
				// console.log('-----------=-')
			} catch (error) {
				console.error('找不到敏感词库');
				// exit(1);
			}
		}

		const words: string[] = this.gfile.toString().split('\n');
		const filter = new SensitiveWordFilter(words)
		return filter.search(str);

	}

	static replace(str: string) {
		if (!this.gfile) {
			let path = 'apps/web-game/src/game-lib/sensitiveword/badwords.txt'
			try {
				this.gfile = fs.readFileSync(path);
				// console.log('-----------=-')
			} catch (error) {
				console.error('找不到敏感词库');
				// exit(1);
			}
		}
		const words: string[] = this.gfile.toString().split('\n');
		const filter = new SensitiveWordFilter(words)
		return filter.replace(str);
	}

}