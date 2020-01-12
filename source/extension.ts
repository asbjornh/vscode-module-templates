"use strict";
import { commands, ExtensionContext, window } from "vscode";

import { createFile } from "./utils";

async function newFromTemplate() {
  const moduleName = await window.showInputBox({
    prompt: "Enter module name"
  });

  if (!moduleName) return;

  createFile(moduleName);
}

export function activate(context: ExtensionContext) {
  const commandId = "extension.newModuleFromTemplate";

  const command = commands.registerCommand(commandId, () => {
    newFromTemplate();
  });

  context.subscriptions.push(command);
}
