# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 1.1.0 [2022-03-19]
### Added
- Option to generated a version based on date/time. `-mp` 

## 1.0.1 [2022-03-09]
### Added
- Option to not log the buildnumber to azure. `-nu`

## 1.0.0 [2021-08-11]
### Added
- Option to specify stable branch if you want to use a different branch then master `-b:BRANCH_NAME`

## 0.0.14 [2020-01-04]
### Added
- Option for other file with same format (for version) as package.json

## 0.0.13 [2020-04-08]
### Fixed
- Updated dependencies to latest.

## 0.0.12 [2019-12-28]
### Added
- Release already created validation, if tag exists it will fail.

## 0.0.11 [2019-11-24]
### Fixed
- Version created is now according to semver.

### Added
- Start with tests.

## 0.0.7 [2019-11-24]
### Added
- Also update packageJson with the new version