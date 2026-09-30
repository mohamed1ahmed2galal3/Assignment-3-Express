/**
 * @param {string[]} strs
 * @return {string}
 */
var longestCommonPrefix = function (strs) {
  let prefix = strs[0];
  for (let i = 0; i < strs.length; i++) {
    while (!strs[i].startsWith(prefix)) {
      prefix = prefix.slice(0, -1);

      if (prefix === "") {
        return "";
      }
    }
  }
  return prefix;
};

console.log(longestCommonPrefix(["dog", "race car", "car"]));
console.log(longestCommonPrefix(["flower", "flow", "flight"]));
