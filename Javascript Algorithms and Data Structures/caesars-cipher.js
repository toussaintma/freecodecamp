function rot13(str) {
  const mapping = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
  const arr = str.split("");

  const decode = (a) => {
    let result = a;
    let i = mapping.indexOf(a);
    if (i != -1) {
      let j = i + 13;
      j > 25 ? j = j - 26 : j;
      result =  mapping[j];
    }
    return result;
  };

  let result = arr.map(decode).join("");
  console.log(result);
  return result;
}

rot13("SERR PBQR PNZC");