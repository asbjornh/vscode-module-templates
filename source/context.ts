import * as path from "path";
import { Uri, window, env, workspace } from "vscode";
import { Template } from "./config";

export const context = async (uri: Uri | undefined, template: Template) => {
  const currentDocument = window.activeTextEditor?.document;

  return {
    clipboard: await env.clipboard.readText(),
    template,
    vscode: {
      clickedItem: {
        path: uri?.fsPath,
      },
      currentDocument: {
        name: currentDocument
          ? path.basename(currentDocument.uri.fsPath)
          : undefined,
        path: currentDocument?.uri.fsPath,
      },
      workspace: {
        name: workspace.name,
        path: workspace.rootPath,
      },
    },
  };
};
