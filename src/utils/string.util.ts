export const formatString = (template: string, ...args: (string | number)[]): string => {
  return template.replace(/{(\d+)}/g, (match: string, number: string) => {
    const index = parseInt(number, 10);
    return typeof args[index] !== 'undefined' ? args[index].toString() : match;
  });
};