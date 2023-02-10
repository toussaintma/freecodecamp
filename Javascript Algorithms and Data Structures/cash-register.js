function checkCashRegister(price, cash, cid) {
  let reference = [
    ["PENNY", 0.01],
    ["NICKEL",	0.05],
    ["DIME",	0.1],
    ["QUARTER", 0.25],
    ["ONE", 1],
    ["FIVE",	5],
    ["TEN", 10],
    ["TWENTY",	20],
    ["ONE HUNDRED",	100]
  ];
  let change = []; // copy cid structure with 0 count
  let target = cash - price;
  let copyCid = [];
  for (let i = 0; i < cid.length; i++) {
    copyCid.push([cid[i][0], cid[i][1]]);
  };

  const takeCoin = (coinType, coinValue) => {
    let ind = -1;
    for (let i = 0; i < cid.length; i++) {
      if (cid[i][0] == coinType) {
        if (cid[i][1] - coinValue >= 0) {
          ind = i;
          cid[i][1] = Math.round((cid[i][1] - coinValue) * 100) / 100;
        }
      }
    }
    return ind != -1;
  };

  const addToChange = (coinType, coinValue) => {
    let ind = -1;
    for (let i = 0; i < change.length; i++) {
      if (change[i][0] == coinType) {
        change[i][1] = Math.round((change[i][1] + coinValue) * 100) / 100;
        ind = i;
      }
    }
    if (ind == -1) {
      change.push([coinType, coinValue]);
    }
    return true;
  };

  const sumChange = (c) => {
    let result = 0;
    for (let i = 0; i < c.length; i++) {
      result += c[i][1];
    }
    return result;
  };

  const stepChange = (a) => {
    let i = reference.length - 1;
    let found = false;
    let result = a;
    while (i > -1 && !found) {
      console.log("trying", a, reference[i][0], reference[i][1]);
      if (reference[i][1] <= a) {
        console.log("ok taking from cid");
        if (takeCoin(reference[i][0], reference[i][1])) {
          found = true;
          addToChange(reference[i][0], reference[i][1]);
          result = Math.round((result - reference[i][1]) * 100) / 100;
          console.log("taken", change, result);
        }
        console.log("nothing to take in cid", cid);
      }
      i--
    }
    if (!found) {
      result = -1;
    }
    console.log("this step:", result);
    return result;
  };

  let initialCid = sumChange(cid);
  console.log("initialCID", initialCid);
  let changed = target;
  let failed = false;
  while (changed > 0) {
    console.log("starting from", changed);
    changed = stepChange(changed);
    failed = (changed == -1);
  }
  let diff = sumChange(change) - initialCid;
  let result = {status: "INSUFFICIENT_FUNDS", change: []};
  
  if (!failed && diff == 0) {
    result.status = "CLOSED";
    result.change = copyCid; // TODO
  } else if (!failed) {
    result.status = "OPEN";
    result.change = change;
  }
  console.log(result);
  return result;
}
checkCashRegister(19.5, 20, [["PENNY", 0.5], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 0], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]])
checkCashRegister(19.5, 20, [["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.1], ["QUARTER", 4.25], ["ONE", 90], ["FIVE", 55], ["TEN", 20], ["TWENTY", 60], ["ONE HUNDRED", 100]]);