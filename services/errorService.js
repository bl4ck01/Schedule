const errorList = {
  22007: 'invalid input syntax',
  23505: 'key already exists',
};

exports.errCode = errNum => errorList[errNum];
