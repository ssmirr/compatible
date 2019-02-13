# Compatible 🛠📦

Tiny (has no dependencies) package to check how compatible a version of dependency is with another version.
This package gets the data from Dependabot which supports many languages (JavaScript, Python, Java, ...) and package managers (npm, pip, mvn, ...).

## Installation

Install latest release from npm:

``` shell
$ npm install compatible
```

Install latest updates from source:

``` shell
$ npm install ssmirr/compatible
```

## Using _Compatible_

You can fetch compatibility status of a package and all the versions:
``` js
await compatible.update('<package name>', '<package manager>', '<from version>', '<to version>'));
```

, specific version of a package:

``` js
await compatible.dependency('<package name>', '<package manager>'));
```

, or updating from version a to version b of a package:

``` js
await compatible.version('<package name>', '<package manager>', '<to version>'));
```

## Example

``` js
const compatible = require('compatible');

let results = await compatible.update('django', 'pip', '1.10.3', '1.11.7'));
console.log(results);

// results is a json object:
// [ { candidate_updates: 1,
//     successful_updates: 0,
//     previous_version: '1.10.3',
//     updated_version: '1.11.7',
//     non_breaking_if_semver: true
//     success_rate: 0.94 } ]
```

> Note: `candidate_updates` is the number of pull requests Dependabot made, and `successful_updates` is how many were merged.