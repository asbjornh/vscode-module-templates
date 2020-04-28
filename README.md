# Module Templates

A flexible VSCode extension for creating (and using) file/folder templates.

**There are no templates included with this extension**. This means that you'll have to do the hard work yourself, but it also means that you can use this with any language/framework you want.

![Screen capture](screencap.gif)

## Use

Use the plugin either by right clicking in the file explorer and selecting `New From Template` or by running `New From Template` using the command palette.

## Templates

Templates are defined in VS Code settings. If your code is shared by many people it can be nice to put templates in workspace settings (`.vscode/settings.json`) so that they can be used by everyone!

Below is a config example, showing how a template for a React component can be defined. The example template defines a folder, a `.jsx` file and an `.scss` file.

```json
{
  "module-templates.templates": [
    {
      "displayName": "React component",
      "defaultPath": "source/components",
      "folder": "{name.raw}",
      "questions": {
        "name": "Component name",
        "className": "HTML class name"
      },
      "files": [
        {
          "name": "{name.raw}.jsx",
          "content": [
            "import React from 'react';",
            "",
            "const {name.pascal} = () =>",
            "  <div className=\"{className.kebab}\" />",
            "",
            "export default {name.pascal};"
          ]
        },
        {
          "name": "{name.raw}.scss",
          "content": [".{name.kebab} {}"]
        }
      ]
    }
  ]
}
```

## Configuration API

### displayName

Required. This name is used when selecting a template to create from.

### defaultPath

Optional. A path relative to the workspace root. When running the extension from the command palette files will be output to this path. When running from the right-click menu this option has no effect.

### folder

Optional. If this is option is set, a folder is created using the name from the option. Supports replacement tokens (see below).

### files

Required. A list of file templates.

### file.name

Required. A name for the file to create (with file extension). Supports replacement tokens (see below). This property can also be a path (in case you need to add sub folders).

### file.content

Required. The content of the file to create, given as an array of strings. Supports replacement tokens (see below).

### questions

Optional. A dictionary of questions to ask when using the template. Object keys are used as replacement token names, and object values are used as description text in the prompt window. Many casing alternatives (such as `pascal` or `kebab`) are available for the replacement tokens.

```json
{
  "questions": {
    "name": "File name",
    "myQuestion": "Some description",
    "myOtherQuestion": "Some other description"
  },
  "files": [
    {
      "name": "{name.raw}.md",
      "content": [
        "{myQuestion.raw}", // Outputs the answer from the prompt
        "{myOtherQuestion.kebab}" // Outputs the answer from the prompt
      ]
    }
  ]
}
```

## Replacement tokens

If your template defines `questions`, you can use the answers to those questions in the `folder`, `file.name` and `file.content` fields. The syntax for referencing an answer is `{<question-key>.<casing-alternative>}` (if you specified the question `name` and want the answer output as kebab-case, you'd write `{name.kebab}`.

In the following example, a folder will be created using a kebab-case version of what was typed into the input box for the `componentName` question.

```json
{
  "module-templates.templates": [
    {
      "displayName": "React component",
      "folder": "{componentName.kebab}",
      "questions": {
        "componentName": "Component name"
      }
    }
  ]
}
```

### Casing alternatives

- `{<question-key>.raw}`: Unmodified name from input box
- `{<question-key>.pascal}`: PascalCased name
- `{<question-key>.kebab}`: kebab-cased name
- `{<question-key>.camel}`: camelCased name
- `{<question-key>.snake}`: snake_cased name

## Migrating to V1

Versions of this plugin prior to `1.0.0` would always ask for a module name, and would therefore always support the `{name}` replacement token. In `1.0.0` the prompt for `{name}` was removed. This means that most templates created for older versions will not work anymore.

### How to make templates work again

To make broken templates work after upgrading to `1.0.0` add a `name` question to your templates, like so:

```json
{
  "module-templates.templates": [
    {
      "displayName": "React component",
      "folder": "{name.raw}",
      "questions": {
        "name": "Component name" // <- Add this
      },
      "files": [
        {
          "name": "{name.raw}.jsx",
          "content": []
        }
      ]
    }
  ]
}
```

If you're experiencing issues after adding a `name` question, please submit an issue.
