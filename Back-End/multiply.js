// Using a for loop for multiplication
function multiply(a, b) {
  let result = 0; 
  for (let i = 0; i < b; i++) { 
      result += a; 
  }
  return result;
}

module.exports = multiply; 
