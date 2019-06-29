test('devo conhecer as principais acertivas do jest', () => {
  let number = null;
  expect(number).toBeNull();
  number = 10;
  expect(number).not.toBeNull();
  expect(number).toBe(10);
  expect(number).toEqual(10);
  expect(number).toBeGreaterThan(9); // GreaterThan === Maior que
  expect(number).toBeLessThan(11); // LessThan === Menor Que
});

test('Devo saber trabalhar com objetos.', () => {
  const obj = {
    name: 'John',
    mail: 'john@gmail.com',
  };
  expect(obj).toHaveProperty('name', 'John');
});
