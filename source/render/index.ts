import { Engine } from "../config";

export type Dictionary = { [key: string]: string };

import renderLegacy from "./legacy";
import renderMustache from "./mustache";

export function render(
  engine: Engine,
  templateText: string,
  answers: Dictionary,
): string {
  switch (engine) {
    case "legacy":
      return renderLegacy(templateText, answers);
    case "mustache":
      return renderMustache(templateText, answers);
  }
}

export function maybeRender(
  engine: Engine,
  templateText: string | undefined,
  answers: Dictionary,
) {
  if (!templateText) return;
  return render(engine, templateText, answers);
}
