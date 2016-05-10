const errorList = {
  22007: 'invalid input syntax'
};

exports.errCode = (errNum) => {
  return errorList[errNum];
};