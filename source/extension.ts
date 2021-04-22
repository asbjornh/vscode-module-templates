"use strict";
import { commands, ExtensionContext, Uri, workspace, window } from "vscode";
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

  if (!answers) return;

  template.files.forEach(async ({ name, open, content }) => {
    const folderName = maybeRender(engine, template.folder, answers);
    const { defaultPath } = template;
    const folderPath = getFolderPath(uri, root, folderName, defaultPath);
    const fileName = render(engine, name, answers);
    const filePath = path.join(folderPath, fileName);
    const fileContent = render(engine, content.join("\n"), answers);

    await fse.outputFile(filePath, fileContent);

    if (open) {
      workspace
        .openTextDocument(Uri.file(filePath))
        .then(doc => window.showTextDocument(doc, { preview: false }));
    }
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
