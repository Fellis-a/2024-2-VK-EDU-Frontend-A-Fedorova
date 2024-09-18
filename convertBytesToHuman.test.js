/*
 * Необходимо покрыть все возможные
 * и невозможные кейсы. Например,
 * convertBytesToHuman(-1) === false,
 * convertBytesToHuman(-1) !== '1 B',
 * convertBytesToHuman('string') === false
 * convertBytesToHuman(5) === '5 B'
 */

import convertBytesToHuman from './convertBytesToHuman';

test('Возвращает false для неправильного типа данных', () => {
  expect(convertBytesToHuman('string')).toBe(false);
  expect(convertBytesToHuman(null)).toBe(false);
  expect(convertBytesToHuman(undefined)).toBe(false);
  expect(convertBytesToHuman({})).toBe(false);
  expect(convertBytesToHuman([])).toBe(false);
});

test('Возвращает корректное значение для чисел', () => {
  expect(convertBytesToHuman(4)).toBe('4 Bytes');
  expect(convertBytesToHuman(1024)).toBe('1 KB');
  expect(convertBytesToHuman(98773696)).toBe('94.20 MB');
  expect(convertBytesToHuman(175736094720)).toBe('163.67 GB');
  expect(convertBytesToHuman(1418412949504)).toBe('1.29 TB');
});

test('Возвращает false для отрицательных чисел', () => {
  expect(convertBytesToHuman(-1)).toBe(false);
});

test('Возвращает корректное значение для пограничных значений', () => {
  expect(convertBytesToHuman(0)).toBe('0 Bytes');
  expect(convertBytesToHuman(1023)).toBe('1023 Bytes');
  expect(convertBytesToHuman(1073741824)).toBe('1 GB');
});


