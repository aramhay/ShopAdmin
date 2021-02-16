function isSorted(array) {
  let count = 0;
const limit = array.length - 1;
for (let i = 0; i < limit; i++) {
  const current = array[i], next = array[i + 1];
  if (current > next) { count+=1,console.log(count)}
      if (count>1) return false
}
return true;
}