import Zod from './zod';

export const singleCardSchema = {
  startDate: (value) => Zod.string(value).nonempty(),
  endDate: (value) => Zod.string(value).nonempty(),
  cardLimit: (value) => Zod.number(value).min(1),
  firstName: (value) => Zod.string(value).nonempty(),
  lastName: (value) => Zod.string(value).nonempty(),
  employeeID: (value) => Zod.string(value).nonempty(),
  emailID: (value) => Zod.string(value).email().nonempty(),
  phoneNumber: (value) => Zod.string(value).nonempty(),
};
