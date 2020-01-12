"use strict";
import { commands, ExtensionContext, window } from "vscode";

async function newFromTemplate() {
  const moduleName = await window.showInputBox({
    prompt: "Enter module name"
  });

  if (!moduleName) return;

  window.showInformationMessage(moduleName);
}

export function activate(context: ExtensionContext) {
  const commandId = "extension.newModuleFromTemplate";

  const command = commands.registerCommand(commandId, () => {
    newFromTemplate();
  });

  context.subscriptions.push(command);
}
