export function formatErrors(errors: any) {
  const errorsMap: { [key: string]: string } = {};

  errors.forEach((error: any) => {
    errorsMap[error.path] = error.msg;
  });

  return errorsMap;
}
