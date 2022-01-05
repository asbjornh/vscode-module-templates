# Changelog

## 1.9.3

- Fix `handlebarsConfig` file not found even when path is correct

## 1.9.2

- Fix readme and option description for `engine`

## 1.9.1

- Adds deprecation warning when using legacy templates

## 1.9.0

- Adds `context` object for Handlebars templates
- Improves error reporting slightly

## 1.8.0

- Adds support for reading file content templates from disk. See the `contentFile` option for files.

## 1.7.0

- Adds support for configuration of Handlebars (`module-templates.handlebarsConfig`)
- Adds error messages for some cases of silent failure

## 1.6.0

- Adds new casing options for handlebars templates
- Fixes silent crash when `questions` is an empty object
- Fixes [#12](https://github.com/asbjornh/vscode-module-templates/issues/12): Makes `files` property on templates optional.
- Fixes [#21](https://github.com/asbjornh/vscode-module-templates/issues/21): Moves command lower in the file explorer context menu (should now be visible below "New Folder")

## 1.5.0

- Adds JSON schema validation for template files ending in `.module-templates.json`.

## 1.4.0

- Adds merging of templates from user- and workspace settings by allowing for using an object for `module-templates.templates`. Using an array for this config option is now deprecated and will stop working in the next major version.
- Overrides the "Enable Preview" user setting to always open files as non-preview

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
