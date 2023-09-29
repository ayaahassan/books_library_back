import { bookValidation } from './book.validation'

// export const updateBookValidation = bookValidation.fork(
// 	Object.keys(bookValidation.describe().keys),
// 	(schema) => schema.optional()
// )

// const description = bookValidation.describe();
// const keys = description.keys;
// export const updateBookValidation = bookValidation.fork(Object.keys(keys), (schema) => schema.optional());

const keys = bookValidation.describe()?.keys || {};
export const updateBookValidation = bookValidation.fork(Object.keys(keys), (schema) => schema.optional());
