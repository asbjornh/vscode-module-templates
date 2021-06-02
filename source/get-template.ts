import path from "path";
import { window, WorkspaceFolder } from "vscode";

import { getConfig } from "./utils";
import { Template, TemplatesObj } from "./config";
import { pick, readJson, resolveFilePath } from "./utils";

function getTemplates(setting?: Template[] | TemplatesObj): Template[] {
  if (Array.isArray(setting)) {
    return setting;
  } else if (setting && typeof setting === "object") {
    return Object.entries(setting || {}).map(([key, value]) => {
      return { ...value, id: key };
    });
  }

  return [];
}

export default async function getTemplate(root: WorkspaceFolder) {
  const config = getConfig(root);
  const templateFiles = config.templateFiles || [];
  const templatesFromConfig = getTemplates(config.templates);

  const templatesFromFiles: Template[] = templateFiles
    .map(filePath => {
      const templates = getTemplates(readJson(root, filePath));

      if (!templates.length) {
        throw new Error(
          `Templates in '${filePath}' are empty or unable to be recognized`,
        );
      }

      // NOTE: The extension resolves all file paths relative to the `.vscode` folder, but file paths are specified relative to the current templates file. This does not always work unless file paths in templates files are resolved beforehand, which is done here
      templates.forEach(template => {
        template.files?.forEach(file => {
          if (!file.contentFile) return;
          // NOTE: Absolute path to the directory where this templates file is stored
          const dir = path.dirname(resolveFilePath(root, filePath));
          // NOTE: Replaces the relative path with an absolute one
          file.contentFile = path.resolve(dir, file.contentFile);
        });
      });

      return templates;
    })
    .flat();

  const templates = [...templatesFromFiles, ...templatesFromConfig];

  if (templates.length === 0) {
    throw new Error(
      "No templates found. Add some to your user, workspace or folder settings!",
    );
  }

  if (templates.length === 1) {
    const [firstTemplate] = templates;
    return resolveInheritance(firstTemplate, templates);
  } else {
    const template = await pick(
      "Select a template",
      templates
        .filter(({ displayName }) => displayName)
        .map(template => ({ label: template.displayName!, value: template })),
    );
    return template ? resolveInheritance(template, templates) : undefined;
  }
}

function resolveInheritance(template: Template, templates: Template[]) {
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
      files: [...(accum.files || []), ...(data.files || [])],
      id: template.id,
      questions: { ...accum.questions, ...data.questions },
    }),
    { displayName: template.displayName, files: [] },
  );
  return combined;
}
