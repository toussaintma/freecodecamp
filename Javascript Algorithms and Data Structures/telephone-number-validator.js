function telephoneCheck(str) {
  const reg = /^(1\D*|)(\(\d\d\d\)(-| |)|\d\d\d(-| |))\d\d\d(-| |)\d\d\d\d$/g;
  let result = str.match(reg);
  console.log(result, result != null);
  return result != null;
}

telephoneCheck("27576227382");
telephoneCheck("(555)555-5555");