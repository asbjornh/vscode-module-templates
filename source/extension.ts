"use strict";
import { commands, ExtensionContext, Uri, window } from "vscode";

import { createFiles, getConfig } from "./utils";

async function promptAnswers(
  questions: [string, string][]
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
      "No templates found. Add some to your user, workspace or folder settings!"
    );
    return;
  }

  const moduleName = await window.showInputBox({
    prompt: "Enter module name"
  });

  if (!moduleName) return;

  if (templates.length === 1) {
    const [template] = templates;
    const answers = await getAnswersForTemplate(template.questions);
    createFiles(moduleName, uri, template, answers);
  } else {
    const result = await window.showQuickPick(
      templates.map(template => ({
        label: template.displayName,
        value: template
      })),
      { placeHolder: "Select a template" }
    );
    if (!result) return;
    const answers = await getAnswersForTemplate(result.value.questions);
    createFiles(moduleName, uri, result.value, answers);
  }
}

export function activate(context: ExtensionContext) {
  const commandId = "extension.newModuleFromTemplate";

  const command = commands.registerCommand(
    commandId,
    (uri: Uri | undefined) => {
      newFromTemplate(uri);
    }
  );

  context.subscriptions.push(command);
}

export function deactivate() {}
