import { TemplateVars, UserAnswers } from './types';

export function render(content: string, vars: TemplateVars): string {
  return content.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    return key in vars ? vars[key] : `{{${key}}}`;
  });
}

export function buildTemplateVars(answers: UserAnswers): TemplateVars {
  const today = new Date();
  const currentDate = today.toISOString().split('T')[0];

  return {
    PROJECT_NAME:       answers.projectName,
    CURRENT_DATE:       currentDate,
  };
}
