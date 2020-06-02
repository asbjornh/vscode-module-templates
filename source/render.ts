import { window } from "vscode";
import { pascalCase, paramCase, camelCase, snakeCase } from "change-case";

type Dictionary = { [key: string]: string };

export function render(templateText: string, answers: Dictionary) {
  return replaceManyTokens(templateText, answers);
}

export function maybeRender(
  templateText: string | undefined,
  answers: Dictionary,
) {
  return templateText ? render(templateText, answers) : undefined;
}

const pattern = (name, type) => new RegExp(`{${name}\.${type}}`, "g");

const replaceToken = (input: string, name: string, value: string) =>
  input
    .replace(pattern(name, "raw"), value)
    .replace(pattern(name, "pascal"), pascalCase(value))
    .replace(pattern(name, "kebab"), paramCase(value))
    .replace(pattern(name, "camel"), camelCase(value))
    .replace(pattern(name, "snake"), snakeCase(value));

const replaceManyTokens = (input: string, tokenMap: Dictionary) => {
  checkLegacyPattern(input, tokenMap);
  return Object.entries(tokenMap).reduce((acc, [name, value]) => {
    return replaceToken(acc, name, value);
  }, input);
};

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
