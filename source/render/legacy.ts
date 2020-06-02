import { window } from "vscode";
import { pascalCase, paramCase, camelCase, snakeCase } from "change-case";

import { Dictionary } from "./index";

export default function render(input: string, answers: Dictionary) {
  checkLegacyPattern(input, answers);
  return Object.entries(answers).reduce((acc, [name, value]) => {
    return replaceToken(acc, name, value);
  }, input);
}

const pattern = (name, type) => new RegExp(`{${name}\.${type}}`, "g");

const replaceToken = (input: string, name: string, value: string) =>
  input
    .replace(pattern(name, "raw"), value)
    .replace(pattern(name, "pascal"), pascalCase(value))
    .replace(pattern(name, "kebab"), paramCase(value))
    .replace(pattern(name, "camel"), camelCase(value))
    .replace(pattern(name, "snake"), snakeCase(value));

// NOTE: The hard coded question for 'name' has been removed. Notify unsuspecting victims of this change.
const checkLegacyPattern = (input: string, tokenMap: Dictionary) => {
  if (input.includes("{name.") && !tokenMap.name) {
    window.showErrorMessage(
      "Missing value for 'name' token. This is probably caused by breaking changes in this plugin. See [the readme](https://github.com/asbjornh/vscode-module-templates/blob/master/README.md#migrating-to-v1) for how to fix this.",
      "Close", // NOTE: Force expanded view
    );
    throw Error("Missing value for token 'name'");
  }
};
