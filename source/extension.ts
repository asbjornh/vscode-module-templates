"use strict";
import { commands, ExtensionContext, Uri, window } from "vscode";

import { createFiles, getConfig, resolveInheritance } from "./utils";

async function promptAnswers(
  questions: [string, string][],
): Promise<[string, string | undefined][]> {
  const [first, ...rest] = questions;
  const [key, prompt] = first;
  const firstAnswer = await window.showInputBox({ prompt });
  return rest.length > 0
    ? [[key, firstAnswer], ...(await promptAnswers(rest))]
    : [[key, firstAnswer]];
}

async function getAnswersForTemplate(questions: object | undefined) {
  if (!questions) return {};
  const answers = await promptAnswers(Object.entries(questions));
  return answers
    .filter(([, value]) => value)
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
}

async function newFromTemplate(uri: Uri | undefined) {
  const templates = getConfig(uri).templates;

  if (!templates || templates.length === 0) {
    window.showErrorMessage(
      "No templates found. Add some to your user, workspace or folder settings!",
    );
    return;
  }

  if (templates.length === 1) {
    const [firstTemplate] = templates;
    const template = resolveInheritance(firstTemplate, templates);
    const answers = await getAnswersForTemplate(template.questions);
    createFiles(uri, template, answers);
  } else {
    const result = await window.showQuickPick(
      templates
        .filter(({ displayName }) => displayName)
        .map(template => ({
          label: template.displayName!,
          value: template,
        })),
      { placeHolder: "Select a template" },
    );
    if (!result) return;
    const template = resolveInheritance(result.value, templates);
    const answers = await getAnswersForTemplate(template.questions);
    createFiles(uri, template, answers);
  }
}

export function activate(context: ExtensionContext) {
  const commandId = "extension.newModuleFromTemplate";

  const command = commands.registerCommand(
    commandId,
    (uri: Uri | undefined) => {
      newFromTemplate(uri);
    },
  );

  context.subscriptions.push(command);
}

export function deactivate() {}
