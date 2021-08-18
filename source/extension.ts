"use strict";
import { commands, ExtensionContext, Uri, workspace, window } from "vscode";
import * as vscode from "vscode";
import * as path from "path";
import * as fse from "fs-extra";

import {
  getCurrentRoot,
  getEngine,
  getFolderPath,
  getHbsConfig,
  readFile,
} from "./utils";
import { maybeRender, render } from "./render";
import ask from "./ask-questions";
import getTemplate from "./get-template";
import { context } from "./context";

async function newFromTemplate(uri: Uri | undefined) {
  const root = await getCurrentRoot(uri);

  const template = await getTemplate(root);
  if (!template) return;

  const engine = getEngine(root);
  const answers = await ask(template.questions);

  const data =
    engine === "handlebars"
      ? { context: await context(uri, template), ...answers }
      : answers;

  const hbsConfig = engine === "handlebars" ? getHbsConfig(root) : {};

  const files = template.files?.map(({ name, open, content, contentFile }) => {
    const folderName = maybeRender(engine, template.folder, data, hbsConfig);
    const { defaultPath } = template;
    const folderPath = getFolderPath(uri, root, folderName, defaultPath);
    const fileName = render(engine, name, data, hbsConfig);
    const filePath = path.join(folderPath, fileName);

    const contentTemplate = contentFile
      ? readFile(root, contentFile)
      : content?.join("\n");

    if (!contentTemplate)
      throw new Error(
        `File '${name}' has no content template. Please specify either 'content' or 'contentFile'.`,
      );

    const fileContent = render(engine, contentTemplate, data, hbsConfig);

    return { filePath, fileContent, open };
  });

  files?.forEach(async ({ filePath, fileContent, open }) => {
    await fse.outputFile(filePath, fileContent);

    if (open) {
      await workspace
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
      newFromTemplate(uri).catch(error => {
        console.error(error);
        window.showErrorMessage(error.message);
      });
    },
  );

  context.subscriptions.push(command);
}

export function deactivate() {}
