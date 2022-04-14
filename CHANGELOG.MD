# Changelog

## [v1.1.6] - 2022-04-14

### Changed

- Included security update PRs.

## [v1.1.5] - 2022-04-14

### Changed

- Rerender tree after initialisation immediately to handle prefill validations.

## [v1.1.4] - 2022-02-04

### Changed

- Minor fixes

## [v1.1.3] - 2022-02-02

### Changed

- Added new attribute for survey item and responses to handle confidential data (marked as such in the survey def). For these items, the meta data will be removed.

## [v1.1.2] - 2022-02-02

### Changed

- LocalisedObject datatype adapted to include resolved data type format as well.

## [v1.1.0] - 2022-01-28

### Changed

- Survey engine's expression eval gets only the responses that are currently rendered in the survey Rendered means, they are in the survey tree, not necessarily on the screen. This change intends to prevent previously answered questions to influce the survey expressions, if they are hidden due to changed previous responses. The responses are not removed from the cache when an item gets hidden due to changed values, to prevent the user to loose the survey's state by accidentaly clicking an option that would cause a large portion of the survey to be hidden. At the end of the survey, only responses are submitted for the items that are part of the rendered survey, so this change makes the survey evaluation consistent with this behaviour.

## [v1.0.4] - 2022-01-13

### Changed

- Add isLoggedIn attribute to context.

## [v1.0.3] - 2022-01-12

### Added

- New expression: `parseValueAsNum` accepting one agrument, that should contain the reference to a value.
- Require Login attribute to survey model is added.

## [v1.0.1] - 2021-12-14

### Changed

- Added new attribute to survey model (`availableFor`).
- Remove study engine expression names, and acceot instead a generic string.

## [v1.0.0] - 2021-12-11

Consolidate repository structure and setup rollup for deployment.
