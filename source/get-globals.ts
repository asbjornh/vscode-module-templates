import { readJson, getConfig } from "./utils";
import { WorkspaceFolder } from "vscode";
import { Globals } from "./config";

export default function getGlobals(root: WorkspaceFolder): Globals {
    let globals = getConfig(root).globals ?? {};
    if ('string' === typeof globals) {
        globals = readJson(root, globals) as Globals;
    }

    // TODO provide global variables like "workspaceName" and locally scoped like "dir" and "dirRelative"

    return globals;
}
