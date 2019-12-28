# simple-versioner

[![Build Status](https://hvdb.visualstudio.com/simple-versioner/_apis/build/status/hvdb.simple-versioner?branchName=master)](https://hvdb.visualstudio.com/simple-versioner/_build/latest?definitionId=1&branchName=master)

[![npm version](https://badge.fury.io/js/simple-versioner.svg)](https://badge.fury.io/js/simple-versioner)

## Overview

Create a version for your branch/pull request to be used for building.  
Currently supporting Azure DevOps.

It will create a version based on the build data that is available.  

## Usage

`npx simple-versioner`

or install  

`npm i simple-versioner`
`simple-versioner`

### Adding to build pipeline

#### Editor

You can add it via the build editor:  
- Make sure node is installed.

Include an bash task: 
```bash
npx simple-versioner
```

#### Yaml

```yml
- bash: 'npx simple-versioner'
  displayName: 'Get and set correct build version'
```

## How it works

If the build is for master, the version would be left as is and the `Build.Buildnumber` will be update to that version. The build name will then be changed to that version instead of existing name.

When it is a feature branch:
- version: 1.0.0
- branch: develop
- gitCommitSha = 7bea27af4e3095bf77701a4e8dc71e9a53140b55

Version send to Azure, and put into the `package.json` is `1.0.0-refs-heads-develop-7bea27af`

PR's are also handled and the correct branch and commitHash is used.


## Contributing

Feel free to contribute! Just fork and create a PR.  

### Tests

Tests can be executed by running `npm t`  

## Roadmap

- Create a nicer version, without the `refs/heads` etc.
- More options
- More tests
- Ability to use it for more then Azure DevOps
- Lot's more

