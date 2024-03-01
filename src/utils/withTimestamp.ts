export const withTimestamp = (fileName: string): string => {
  const ts = new Date().toISOString().replace(/\D/g, '').substring(2);

  const name = fileName.split('.').slice(0, -1).join('.').concat(`_${ts}`);
  const extension = fileName.split('.').slice(-1);
  return [name, extension].join('.');
};
