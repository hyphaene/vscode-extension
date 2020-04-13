#!/usr/bin/env node

import glob from 'glob';
import { writeFileSync } from 'fs';

const PathPatterns = [
	'./snippets/js/**/*.json',
	'./snippets/ts/**/*.json',
	'./snippets/shared/**/*.json',
];

const [jsOnlySnippets, tsOnlySnippets, sharedSnippets] = PathPatterns.map((pattern) =>
	glob.sync(pattern).map((file) => require(`.${file}`))
);

const jsSnippets = jsOnlySnippets.concat(sharedSnippets);
const tsSnippets = tsOnlySnippets.concat(sharedSnippets);

const array = [
	{
		snippets: jsSnippets,
		outputFilePath: './snippets/dist/javascript.json',
	},
	{
		snippets: tsSnippets,
		outputFilePath: './snippets/dist/typescript.json',
	},
];

array.forEach(({ snippets, outputFilePath }) => {
	// create JSON file
	const content = JSON.stringify(
		snippets.reduce((prev, curr) => {
			return Object.assign(prev, curr);
		}, {}),
		null,
		4
	);
	writeFileSync(outputFilePath, content, 'utf8');
});
