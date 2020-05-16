import * as fse from "fs-extra";
import { Uri, window, workspace } from "vscode";
import { pascalCase, paramCase, camelCase, snakeCase } from "change-case";

import { Config, Template } from "./config";

export function getConfig(uri: Uri | undefined) {
  const currentUri = uri || window.activeTextEditor?.document.uri;
  const wsFolder = currentUri && workspace.getWorkspaceFolder(currentUri);
  return workspace.getConfiguration("module-templates", wsFolder) as Config;
}

type TokenMap = { [key: string]: string };

// NOTE: The hard coded question for 'name' has been removed. Notify unsuspecting victims of this change.
const checkLegacyPattern = (input: string, tokenMap: TokenMap) => {
  if (input.includes("{name.") && !tokenMap.name) {
    window.showErrorMessage(
      "Missing value for 'name' token. This is probably caused by breaking changes in this plugin. See [the readme](https://github.com/asbjornh/vscode-module-templates/blob/master/README.md#migrating-to-v1) for how to fix this.",
      "Close", // NOTE: Force expanded view
    );
    throw Error("Missing value for token 'name'");
  }
};

const pattern = (name, type) => new RegExp(`{${name}\.${type}}`, "g");

const replaceToken = (input: string, name: string, value: string) =>
  input
    .replace(pattern(name, "raw"), value)
    .replace(pattern(name, "pascal"), pascalCase(value))
    .replace(pattern(name, "kebab"), paramCase(value))
    .replace(pattern(name, "camel"), camelCase(value))
    .replace(pattern(name, "snake"), snakeCase(value));

const replaceManyTokens = (input: string, tokenMap: TokenMap) => {
  checkLegacyPattern(input, tokenMap);
  return Object.entries(tokenMap).reduce((acc, [name, value]) => {
    return replaceToken(acc, name, value);
  }, input);
};

export function resolveInheritance(template: Template, templates: Template[]) {
  if (!template.extends || template.extends.length === 0) return template;
  const inheritedData = template.extends.map(id => {
    const data = templates.find(template => template.id === id);
    if (!data) {
      const msg = `Template extends '${id}', which was not found.`;
      window.showErrorMessage(msg);
      throw Error(msg);
    }
    return resolveInheritance(data, templates);
  });
  const combined: Template = [...inheritedData, template].reduce(
    (accum: Template, data) => ({
      ...accum,
      ...data,
      extends: [],
      files: [...accum.files, ...data.files],
      id: template.id,
      questions: { ...accum.questions, ...data.questions },
    }),
    { displayName: template.displayName, files: [] },
  );
  return combined;
}

export function createFiles(
  uri: Uri | undefined,
  template: Template,
  answers: { [key: string]: string },
) {
  const workspaceRoot = workspace.workspaceFolders?.[0].uri.fsPath;

  if (!workspaceRoot && !uri) {
    window.showErrorMessage(
      "When running 'New From Template' from the command palette, you must be in a workspace",
    );
    return;
  }

  const path = uri?.fsPath
    ? uri.fsPath
    : template.defaultPath
    ? `${workspaceRoot}/${template.defaultPath}`
    : workspaceRoot;

  const folderName = template.folder
    ? replaceManyTokens(template.folder, answers)
    : undefined;
  const fullPath = folderName ? `${path}/${folderName}` : path;

  template.files.forEach(({ name, content }) => {
    const fileName = replaceManyTokens(name, answers);
    const fileContent = content
      .map(line => replaceManyTokens(line, answers))
      .join("\n");
    fse.outputFileSync(`${fullPath}/${fileName}`, fileContent);
  });
}
