import { Engine } from "../config";
import { Answers } from "../ask-questions";

export type Dictionary<T> = { [key: string]: T };

import renderHandlebars from "./handlebars";
import renderLegacy from "./legacy";

export function render(
  engine: Engine,
  templateText: string,
  answers: Answers,
  handlebarsConfig: Record<string, any>,
): string {
  switch (engine) {
    case "handlebars":
      return renderHandlebars(templateText, answers, handlebarsConfig);
    case "legacy":
      return renderLegacy(templateText, answers);
  }
}

export function maybeRender(
  engine: Engine,
  templateText: string | undefined,
  answers: Answers,
  handlebarsconfig: Record<string, any>,
) {
  if (!templateText) return;
  return render(engine, templateText, answers, handlebarsconfig);
}
