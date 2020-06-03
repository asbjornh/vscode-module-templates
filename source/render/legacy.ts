import { pascalCase, paramCase, camelCase, snakeCase } from "change-case";

import { Answers } from "../ask-questions";

export default function render(input: string, answers: Answers) {
  return Object.entries(answers).reduce(
    (acc, [name, value]) => replaceToken(acc, name, value),
    input,
  );
}

const pattern = (name, type) => new RegExp(`{${name}\.${type}}`, "g");

const replaceToken = (input: string, name: string, value: {}) =>
  typeof value === "string"
    ? input
        .replace(pattern(name, "raw"), value)
        .replace(pattern(name, "pascal"), pascalCase(value))
        .replace(pattern(name, "kebab"), paramCase(value))
        .replace(pattern(name, "camel"), camelCase(value))
        .replace(pattern(name, "snake"), snakeCase(value))
    : input.replace(pattern(name, "raw"), JSON.stringify(value));
