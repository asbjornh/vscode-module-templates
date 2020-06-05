import { window } from "vscode";

import { Dictionary } from "./render";
import { Question, QuestionAlternative, Questions } from "./config";
import { pick } from "./utils";

// NOTE: The empty type expresses `any`, excluding `null` and `undefined`
export type Answer = {};
export type Answers = Dictionary<Answer>;

const prompt = (question: string) => window.showInputBox({ prompt: question });

async function promptAnswers(
  questions: [string, Question][],
): Promise<[string, Answer | undefined][]> {
  const [first, ...rest] = questions;
  const [key, question] = first;
  const answer =
    typeof question === "string"
      ? await prompt(question)
      : Array.isArray(question)
      ? await pick(
          "Pick one!",
          question.map(({ displayName: label, value }) => ({ label, value })),
        )
      : (await prompt(question.displayName)) || question.defaultValue;
  return rest.length > 0
    ? [[key, answer], ...(await promptAnswers(rest))]
    : [[key, answer]];
}

export default async function ask(
  questions: Questions | undefined,
): Promise<Answers> {
  if (!questions) return {};
  const answers = await promptAnswers(Object.entries(questions));
  return answers
    .filter(([, value]) => typeof value !== "undefined")
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
}
