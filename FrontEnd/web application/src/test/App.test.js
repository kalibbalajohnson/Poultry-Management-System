import multiply from "../hooks/multiply.js"; 
import { assert } from "chai"; 

describe("Multiply Function tests", () => {
  it("should return 25 when multiplying 5 and 5", () => {
    assert.equal(multiply(5, 5), 25);
  });

  it("should return 4 when multiplying 2 and 2", () => {
    assert.equal(multiply(2, 2), 4);
  });

  it("should return 9 when multiplying 3 and 3", () => {
    assert.equal(multiply(3, 3), 9);
  });

  it("should return 16 when multiplying 4 and 4", () => {
    assert.equal(multiply(4, 4), 16);
  });

  it("should return 1035 when multiplying 23 and 45", () => {
    assert.equal(multiply(23, 45), 1035);
  });
});