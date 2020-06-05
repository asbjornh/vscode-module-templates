"use strict";
import { commands, ExtensionContext, Uri } from "vscode";
import * as path from "path";
import * as fse from "fs-extra";

import { getCurrentRoot, getEngine, getFolderPath } from "./utils";
import { maybeRender, render } from "./render";
import ask from "./ask-questions";
import getTemplate from "./get-template";

async function newFromTemplate(uri: Uri | undefined) {
  const root = await getCurrentRoot(uri);

  const template = await getTemplate(root);
  if (!template) return;

  const engine = getEngine(root);
  const answers = await ask(template.questions);

  template.files.forEach(({ name, content }) => {
    const folderName = maybeRender(engine, template.folder, answers);
    const folderPath = getFolderPath(
      uri,
      root,
      folderName,
      template.defaultPath,
    );
    const fileName = render(engine, name, answers);

    fse.outputFileSync(
      path.join(folderPath, fileName),
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
