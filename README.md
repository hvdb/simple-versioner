# simple-versioner

[![Build Status](https://hvdb.visualstudio.com/simple-versioner/_apis/build/status/hvdb.simple-versioner?branchName=master)](https://hvdb.visualstudio.com/simple-versioner/_build/latest?definitionId=1&branchName=master)

[![npm version](https://badge.fury.io/js/simple-versioner.svg)](https://badge.fury.io/js/simple-versioner)

## Overview

Build versioning tool for Azure DevOps.
It will update your versioning file with a new generated version if the build is executed from a non stable branch.  
So that you will always have a unique version that is build, even during PR builds.  
As a bonus it will also update the pipeline name to reflect that new version so that you never have to look for the correct build again.  

You can have a look at the builds of this plugin to see how that will be shown in [Azure DevOps](https://hvdb.visualstudio.com/simple-versioner/_build/latest?definitionId=1&branchName=master)

## Usage

`npx simple-versioner`

or install  

`npm i simple-versioner`
`simple-versioner`

### Options

#### Other file then package.json

`npx simple-versioner vss-extension.json`

Disclaimer: only works on files that also have a field named version

#### Different stable branch

Default stable branch is`master` if you are using a different stable branch you can provided this via a parameter.

`npx simple-versioner -b:main`

### Using it in the Azure DevOps pipelines

#### Editor

You can add it via the editor:  
Include an bash task: 
```bash
npx simple-versioner
```

#### Yaml

```yaml
- bash: 'npx simple-versioner'
  displayName: 'Get and set correct build version'
```

## How it works

When it is a stable build:
If the build is for the specified stable branch, the version would be left as is.  
It will check if there are tags available with the specified version, if so it will throw an error stating that the version is already released. The build will then stop.  

When it is a feature build:
- version: 1.0.0
- branch: develop
- gitCommitSha = 7bea27af4e3095bf77701a4e8dc71e9a53140b55

Version send to Azure, and put into the provided file to version is `1.0.0-refs-heads-develop-7bea27af`  
note: `/` provided in the branchname are replaced by `-`

PR's are also handled and the correct branch and commitHash is used.

What happens in azure:   
The `Build.Buildnumber` will be update to the version needed. The build name will then be changed to that version instead of predefined name.

## Contributing

Feel free to contribute! Just fork and create a PR.  

### Tests

Tests can be executed by running `npm t`  


