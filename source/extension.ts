"use strict";
import { commands, ExtensionContext, Uri, window } from "vscode";

import { createFile } from "./utils";

async function newFromTemplate(uri: Uri | undefined) {
  const moduleName = await window.showInputBox({
    prompt: "Enter module name"
  });

  if (!moduleName) return;

  createFile(moduleName, uri);
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
