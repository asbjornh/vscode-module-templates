"use strict";
import { commands, ExtensionContext, Uri, window } from "vscode";

import { createFiles, getConfig } from "./utils";

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
    createFiles(moduleName, uri, template);
  } else {
    const result = await window.showQuickPick(
      templates.map(template => ({
        label: template.displayName,
        value: template
      })),
      { placeHolder: "Select a template" }
    );
    if (!result) return;
    createFiles(moduleName, uri, result.value);
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
