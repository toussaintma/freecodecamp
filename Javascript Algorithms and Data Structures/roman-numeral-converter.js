function convertToRoman(num) {
  const units = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"];
  const tens = ["", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC"];
  const hundreds = ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM"];
  
  let result = "";

  if (num > 999) {
    let k = Math.trunc(num / 1000);
    for (let i = 0; i < k; i++) {
      result += "M";
    }
    result += convertToRoman(num - k * 1000);
  } else if (num > 99) {
    let h = Math.trunc(num / 100);
    let t = Math.trunc((num - h * 100) / 10);
    result = hundreds[h] + tens[t] + units[(num - h * 100) - t * 10];
  } else if (num > 9) {
    let mult = Math.trunc(num / 10);
    result = tens[mult] + units[num - mult * 10];
  } else {
    result = units[num];
  };

  console.log(result);
  return result;
}

convertToRoman(1136);