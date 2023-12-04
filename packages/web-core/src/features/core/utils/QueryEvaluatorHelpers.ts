export const queryEvaluator = (query: string) => {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const second = now.getSeconds();

  const vars = {
    hour,
    minute,
    second,
  };

  // TODO: Use a safer way to evaluate the query

  // eslint-disable-next-line no-new-func
  const evaluator = new Function('vars', `return ${query};`);

  return evaluator(vars);
};
