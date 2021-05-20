import {
  pascalCase,
  paramCase,
  camelCase,
  snakeCase,
  constantCase,
  noCase,
  sentenceCase,
  capitalCase,
} from "change-case";
import { compile } from "handlebars";

import { Answers } from "../ask-questions";
import { showModal } from "../utils";

const value = (value, thisObj, options) =>
  typeof options.fn === "function"
    ? value
      ? options.fn(thisObj)
      : options.inverse(thisObj)
    : value;

const stringTransform =
  (transform: (str: string) => string) => (maybeString: string | undefined) =>
    typeof maybeString === "string" ? transform(maybeString) : maybeString;

const helpers = {
  camel: stringTransform(camelCase),
  capital: stringTransform(capitalCase),
  constant: stringTransform(constantCase),
  eq: function (a, b, options) {
    return value(a === b, this, options);
  },
  lower: stringTransform((str: string) => str.toLowerCase()),
  kebab: stringTransform(paramCase),
  pascal: stringTransform(pascalCase),
  sentence: stringTransform(sentenceCase),
  snake: stringTransform(snakeCase),
  upper: stringTransform((str: string) => str.toUpperCase()),
  words: stringTransform(noCase),
};

export default function render(templateText: string, answers: Answers) {
  try {
    return compile(templateText)(answers, { helpers });
  } catch (error) {
    showModal(`Handlebars error:\n${error.message}`);
    throw error;
  }
}
