function palindrome(str) {
  let nonalphas = str.match(/\w+/gi);
  let alphas = nonalphas.map(a => a.replace(/\_/g, ""));
  let minimized = alphas.map(a => a.toLowerCase());
  let ready = minimized.join("");
  console.log(alphas, ready);

  let left = ready.slice(0, Math.trunc(ready.length / 2));
  let pivot = 0; 
  if (ready.length % 2 == 0) {
    pivot = Math.trunc(ready.length / 2);
  } else {
    pivot = Math.trunc(ready.length / 2) + 1;
  }
  let wrongDir = ready.slice(pivot);
  let right = wrongDir.split("").reverse().join("");

  console.log(left, right, left === right);
  return left === right;
}

palindrome("eye");
