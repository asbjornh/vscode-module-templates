import { pascalCase, paramCase, camelCase, snakeCase } from "change-case";
import { compile } from "handlebars";

import { Answers } from "../ask-questions";
import { showModal } from "../utils";

const value = (value, thisObj, options) =>
  typeof options.fn === "function"
    ? value
      ? options.fn(thisObj)
      : options.inverse(thisObj)
    : value;

const stringTransform = transform => maybeString =>
  typeof maybeString === "string" ? transform(maybeString) : maybeString;

const helpers = {
  eq: function (a, b, options) {
    return value(a === b, this, options);
  },
  pascal: stringTransform(pascalCase),
  kebab: stringTransform(paramCase),
  camel: stringTransform(camelCase),
  snake: stringTransform(snakeCase),
};

export default function render(templateText: string, answers: Answers) {
  try {
    return compile(templateText)(answers, { helpers });
  } catch (error) {
    showModal(`Handlebars error:\n${error.message}`);
    throw error;
  }
}
