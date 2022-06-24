import { validateFields, iFieldValidation } from '../../src/utils';

it('Should validate string field', () => {
  const fields: iFieldValidation<any>[] = [
    {
      name: 'name',
      type: 'string',
    },
  ];
  const data = {
    name: 'Rodrigo',
    age: 23,
  };
  const validation = validateFields(fields, data);
  expect(validation.hasMissing).toBe(false);
});

it('Should validate number field', () => {
  const fields: iFieldValidation<any>[] = [
    {
      name: 'age',
      type: 'number',
    },
  ];
  const data = {
    name: 'Rodrigo',
    age: 23,
  };
  const validation = validateFields(fields, data);
  expect(validation.hasMissing).toBe(false);
});

it('Should validate required field', () => {
  const fields: iFieldValidation<any>[] = [
    {
      name: 'name',
      type: 'string',
    },
  ];
  const data = {
    age: 23,
  };
  const validation = validateFields(fields, data);
  expect(validation.hasMissing).toBe(true);
});

it('Should ignore non required field', () => {
  const fields: iFieldValidation<any>[] = [
    {
      name: 'name',
      type: 'string',
      required: false,
    },
  ];
  const data = {
    age: 23,
  };
  const validation = validateFields(fields, data);
  expect(validation.hasMissing).toBe(false);
});

it('Should validate array', () => {
  const fields: iFieldValidation<any>[] = [
    {
      name: 'name',
      type: 'array',
    },
  ];
  const data = {
    name: ['Rodrigo', 'cordeiro'],
    age: [23, 24],
  };
  const validation = validateFields(fields, data);
  expect(validation.hasMissing).toBe(false);
});

it('Should validate string array', () => {
  const fields: iFieldValidation<any>[] = [
    {
      name: 'name',
      type: 'array',
      arrayItems: 'string',
    },
  ];
  const data = {
    name: ['Rodrigo', 'cordeiro'],
    age: [23, 24],
  };
  const validation = validateFields(fields, data);
  expect(validation.hasMissing).toBe(false);
});

it('Should reject number array', () => {
  const fields: iFieldValidation<any>[] = [
    {
      name: 'name',
      type: 'array',
      arrayItems: 'number',
    },
  ];
  const data = {
    name: ['Rodrigo', 'cordeiro'],
    age: [23, 24],
  };
  const validation = validateFields(fields, data);
  expect(validation.hasMissing).toBe(true);
});

it('Should validate number array', () => {
  const fields: iFieldValidation<any>[] = [
    {
      name: 'age',
      type: 'array',
      arrayItems: 'number',
    },
  ];
  const data = {
    name: ['Rodrigo', 'cordeiro'],
    age: [23, 24],
  };
  const validation = validateFields(fields, data);
  expect(validation.hasMissing).toBe(false);
});

it('Should reject string array', () => {
  const fields: iFieldValidation<any>[] = [
    {
      name: 'age',
      type: 'array',
      arrayItems: 'string',
    },
  ];
  const data = {
    name: ['Rodrigo', 'cordeiro'],
    age: [23, 24],
  };
  const validation = validateFields(fields, data);
  expect(validation.hasMissing).toBe(true);
});

it('Should reject empty value', () => {
  const fields: iFieldValidation<any>[] = [
    {
      name: 'name',
      type: 'array',
      arrayItems: 'string',
    },
  ];
  const data = {
    name: [],
    age: [23, 24],
  };
  const validation = validateFields(fields, data);
  expect(validation.hasMissing).toBe(true);
});
