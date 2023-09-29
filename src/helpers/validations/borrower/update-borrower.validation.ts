import { borrowerValidation } from "./borrower.validation";

// export const updateBorrowerValidation = borrowerValidation.fork(
// 	Object.keys(borrowerValidation.describe().keys),
// 	(schema) => schema.optional()
// )
const keys = borrowerValidation.describe()?.keys || {};
export const updateBorrowerValidation= borrowerValidation.fork(Object.keys(keys), (schema) => schema.optional());
