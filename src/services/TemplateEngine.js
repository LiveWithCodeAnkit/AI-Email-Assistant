import Handlebars from 'handlebars';

// Register simple helpers
Handlebars.registerHelper('join', function(arr, sep) {
  if (!Array.isArray(arr)) return '';
  return arr.join(typeof sep === 'string' ? sep : ', ');
});

Handlebars.registerHelper('list', function(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return '- None';
  return arr.map(x => `- ${x}`).join('\n');
});

class TemplateEngine {
  render(templateString, variables) {
    const compiled = Handlebars.compile(templateString, { noEscape: true });
    return compiled(variables || {});
  }
}

const templateEngine = new TemplateEngine();
export default templateEngine;
