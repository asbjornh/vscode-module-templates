# Changelog

## 1.3.0

- Adds `open` option to files for automatically opening them after creation.
- Adds question `defaultValue` as input placeholder

## 1.2.1

- Fixes files always being output to the first workspace folder in multi-folder workspaces when running from the command palette.
- Fixes files being output with missing data when the ESC key is pressed.

## 1.2.0

- Adds support for `handlebars` templates
- Adds support for questions with default values
- Adds support for questions with a predefined set of answers
- Adds support for external template files
- Removes warning about missing `name` answer

## 1.1.1

- Fixes typo in inheritance example

## 1.1.0

- Adds support for composition / inheritance of templates

## 1.0.0

- BREAKING: Removes module name question. This must now be provided in `template.questions` instead.

## 0.4.0

- Adds support for additional prompts

## 0.3.0

- Adds support for multi-root workspaces

## 0.2.0

- Adds support for specifying a path in `file.name` in order to create sub folders
