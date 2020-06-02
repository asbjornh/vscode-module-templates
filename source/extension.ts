"use strict";
import { commands, ExtensionContext, Uri } from "vscode";
import * as fse from "fs-extra";

import {
  getConfig,
  getEngine,
  getFolderPath,
  showErrorAndThrow,
} from "./utils";

import { maybeRender, render } from "./render";
import ask from "./ask-questions";
import getTemplate from "./get-template";

async function newFromTemplate(uri: Uri | undefined) {
  const template = await getTemplate(uri);
  if (!template) return;

  const engine = getEngine(uri);
  const answers = await ask(template.questions);

  template.files.forEach(({ name, content }) => {
    const folderName = maybeRender(engine, template.folder, answers);
    const folderPath = getFolderPath(uri, folderName, template.defaultPath);
    const fileName = render(engine, name, answers);

    fse.outputFileSync(
      `${folderPath}/${fileName}`,
      render(engine, content.join("\n"), answers),
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
