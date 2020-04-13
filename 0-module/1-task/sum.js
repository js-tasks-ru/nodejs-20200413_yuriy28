function sum(...numbers) {
  let sum = 0;

  numbers.forEach((item) => {
    if ('number' !== typeof item) {
      throw new TypeError();
    }

    sum += item;
  });

  return sum;
}

module.exports = sum;
