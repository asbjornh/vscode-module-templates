import { pascalCase, paramCase, camelCase, snakeCase } from "change-case";
import { compile } from "handlebars";

import { Answers } from "../ask-questions";
import { Dictionary } from "./index";
import { showModal } from "../utils";

const value = (value, thisObj, options) =>
  typeof options.fn === "function"
    ? value
      ? options.fn(thisObj)
      : options.inverse(thisObj)
    : value;

const helpers = {
  eq: function (a, b, options) {
    return value(a === b, this, options);
  },
};

export default function render(templateText: string, answers: Answers) {
  try {
    return compile(templateText)(addCasings(answers), { helpers });
  } catch (error) {
    showModal(error.message);
    throw error;
  }
}

const addCasings = (answers: Answers): Dictionary<any> =>
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
