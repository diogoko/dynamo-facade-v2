# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.0.0] - 2022-12-19

### Added
- DocumentFacade class to allow multiple simultaneous connections
- commands module to generate commands inputs without running them

### Changed

- (BREAKING) Signature of between helper to accept two arguments
- Make batchItem and transactItem real namespaces

## [1.0.1] - 2022-10-05

### Fixed
- Signature of batchGet and batchWrite to return Promise

## [1.0.0] - 2022-10-03
### Added
- Support for all methods of DocumentClient
- Helpers for transactGet and transactWrite
- Helpers for batchGet and batchWrite
