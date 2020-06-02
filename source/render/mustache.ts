import { pascalCase, paramCase, camelCase, snakeCase } from "change-case";
import { render as renderMustache } from "mustache";

import { Dictionary } from "./index";

export default function render(templateText: string, answers: Dictionary) {
  return renderMustache(templateText, addCasings(answers));
}

const addCasings = (
  answers: Dictionary,
): { [key: string]: Dictionary | number | boolean } =>
  Object.entries(answers).reduce((accum, [key, value]) => {
    const maybeCasings =
      typeof value === "string"
        ? {
            raw: value,
            pascal: pascalCase(value),
            kebab: paramCase(value),
            camel: camelCase(value),
            snake: snakeCase(value),
          }
        : value;
    return { ...accum, [key]: maybeCasings };
  }, {});
