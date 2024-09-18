/*
 * В этом задании надо разработать функцию
 * `convertBytesToHuman`. Эта функция  должна принимать
 * аргумент `bytes` только числового типа.
 * На выходе функция должна отдать
 * человекопонятную строку, которая будет
 * отражать размер файла. Примеры использования:
 * `convertBytesToHuman(1024) === '1 KB';`
 * `convertBytesToHuman(123123123) === '117.42 MB';`
 * Необходимо предусмотреть защиту от
 * передачи аргументов неправильного типа
 * и класса (например, отрицательные числа)
 */

export default function convertBytesToHuman(bytes) {

  if (typeof bytes !== 'number' || bytes < 0) {
    return false;
  }

  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  let i = 0;

  if (bytes === 0) return '0 Bytes';


  while (bytes >= 1024 && i < sizes.length - 1) {
    bytes = bytes / 1024;
    i++;
  }

  return Number.isInteger(bytes) ? bytes + ' ' + sizes[i] : bytes.toFixed(2) + ' ' + sizes[i];
}

