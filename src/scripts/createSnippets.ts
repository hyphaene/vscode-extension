#!/usr/bin/env node

import * as glob from 'glob';
import { writeFileSync } from 'fs';

const PathPatterns = [
	'./snippets/js/**/*.json',
	'./snippets/ts/**/*.json',
	'./snippets/shared/**/*.json',
];

let [jsxSnippetsPath, tsxSnippetsPath, sharedxSnippetsPath] = PathPatterns.map((pattern) =>
	glob.sync(pattern)
);

[jsxSnippetsPath, tsxSnippetsPath] = [jsxSnippetsPath, tsxSnippetsPath].map((arr) =>
	arr.concat(sharedxSnippetsPath)
);

const [jsSnippetsPath, tsSnippetsPath] = [jsxSnippetsPath, tsxSnippetsPath].map((arr) =>
	arr.filter((path) => !path.includes('react'))
);

const filesToCreate = [
	{ snippetsPath: jsxSnippetsPath, language: 'javascriptreact' },
	{ snippetsPath: tsxSnippetsPath, language: 'typescriptreact' },
	{ snippetsPath: jsSnippetsPath, language: 'javascript' },
	{ snippetsPath: tsSnippetsPath, language: 'typecript' },
].map(({ snippetsPath, language }) => {
	return {
		snippets: snippetsPath.map((path) => require(`../.${path}`)),
		outputFilePath: `./snippets/dist/${language}.json`,
	};
});

filesToCreate.forEach(({ snippets, outputFilePath }) => {
	const content = JSON.stringify(
		snippets.reduce((prev, curr) => {
			return Object.assign(prev, curr);
		}, {}),
		null,
		4
	);
	writeFileSync(outputFilePath, content, 'utf8');
});
