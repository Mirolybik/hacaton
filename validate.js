/**
 * Валидирует часть запроса zod-схемой.
 * При ошибке zod бросает ZodError, его обрабатывает error handler в app.js.
 *
 * @param {import('zod').ZodTypeAny} schema
 * @param {'body' | 'query' | 'params'} [source]
 */
export function validate(schema, source = 'body') {
  return (req, _res, next) => {
    const data = schema.parse(req[source]);

    // req.query в Express 5 доступен только для чтения
    if (source === 'query') req.validatedQuery = data;
    else req[source] = data;

    next();
  };
}

export default validate;
