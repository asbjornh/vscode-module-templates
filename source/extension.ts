"use strict";
import { commands, ExtensionContext, Uri, window } from "vscode";
import * as fse from "fs-extra";

import { getFolderPath } from "./utils";
import { maybeRender, render } from "./render";
import ask from "./ask-questions";
import getTemplate from "./get-template";

async function newFromTemplate(uri: Uri | undefined) {
  const template = await getTemplate(uri);

  if (!template) return;

  const answers = await ask(template.questions);

  template.files.forEach(({ name, content }) => {
    const folderName = maybeRender(template.folder, answers);
    const folderPath = getFolderPath(uri, folderName, template.defaultPath);
    const fileName = render(name, answers);

    fse.outputFileSync(
      `${folderPath}/${fileName}`,
      render(content.join("\n"), answers),
    );
  });
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
