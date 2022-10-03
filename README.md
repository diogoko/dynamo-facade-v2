# dynamo-facade-v2

[![QA](https://github.com/diogoko/dynamo-facade-v2/actions/workflows/qa.yml/badge.svg)](https://github.com/diogoko/dynamo-facade-v2/actions/workflows/qa.yml)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/dynamo-facade-v2)
[![install size](https://packagephobia.com/badge?p=dynamo-facade-v2)](https://packagephobia.com/result?p=dynamo-facade-v2)
[![downloads](https://img.shields.io/npm/dt/dynamo-facade-v2)](https://npm-stat.com/charts.html?package=dynamo-facade-v2)

dynamo-facade-v2 is a library that helps calling `DocumentClient` of `aws-sdk` - specially functions that have expression parameters (like `FilterExpression` and `UpdateExpression`).

This project is focused on version 2 of `aws-sdk`.

## Usage

You can see the complete reference to the API at https://diogoko.github.io/dynamo-facade-v2.

### Install

```
npm install dynamo-facade-v2
```

### Examples

```js
import df, { between, gt, inList, transactWrite as tr } from 'dynamo-facade-v2';

// The returned value is the same one returned by DocumentClient.*.promise()
const response = await df.get('movies', { actor: 'Tom Hanks' });
console.log(response.Item);

// query(tableName, keyCondition, options)
await df.query('movies', { actor: 'Tom Hanks' }, { filter: { year: gt(2000) } })

// scan(tableName, filter, options)
await df.scan('movies', { genre: inList('Drama', 'Action'), year: between(1990, 1999) })

// put(tableName, item, options)
await df.put('movies', { actor: 'Tom Hanks', movie: 'Finch', year: 2021 });

// update(tableName, key, updatedValues, options)
await df.update(
  'movies',
  { actor: 'Tom Hanks', movie: 'Forrest Gump' },
  { year: 1994, tomatometer: 71 }
)

// delete(tableName, key, options)
await df.delete('movies', { actor: 'Tom Hanks', movie: 'The Bonfire of the Vanities' })

// transactWrite(transactItems, options)
await df.transactWrite([
  tr.put('movies', { actor: 'Tom Hanks', movie: 'Toy Story 2', year: 1999 }),
  tr.update('movies', { actor: 'Tom Hanks', movie: 'Big'}, { year: 1988 }),
])
```

## Development

### Build

Run (this project is using Yarn 1.x):

```
yarn build
```

This will create the compiled files under `./dist` folder.

### Test

Run to execute tests with Jest:

```
yarn test
```

### Generating docs

This project uses [TypeDoc](https://typedoc.org/).

Run `yarn make:docs` and a folder named `docs` will be created in your root directory.

## Thanks

This project was created from the [alioguzhan/typescript-library-template](https://github.com/alioguzhan/typescript-library-template) project template.
