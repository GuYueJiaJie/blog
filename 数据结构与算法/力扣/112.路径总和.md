[112.路径总和](https://leetcode-cn.com/problems/path-sum/submissions/)

[力扣 JS 题解。](https://github.com/GuYueJiaJie/blog/blob/master/%E7%AE%97%E6%B3%95%E4%B8%8E%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84/README.md)

## 方法 DFS 递归

```javascript
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @param {number} sum
 * @return {boolean}
 */
var hasPathSum = function(root, sum) {
  if (root === null) return false;
  if (root.left === null && root.right === null && root.val === sum)
    return true;

  let left = hasPathSum(root.left, sum - root.val);
  let right = hasPathSum(root.right, sum - root.val);
  return left || right;
};
```

## 迭代

```javascript
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @param {number} sum
 * @return {boolean}
 */
var hasPathSum = function(root, sum) {
  if (root === null) return false;
  let stack = [root];
  let sumStack = [sum - root.val];
  while (stack.length > 0) {
    let node = stack.pop();
    let curSum = sumStack.pop();
    if (node.left === null && node.right === null && curSum === 0) {
      return true;
    }
    if (node.right !== null) {
      stack.push(node.right);
      sumStack.push(curSum - node.right.val);
    }
    if (node.left !== null) {
      stack.push(node.left);
      sumStack.push(curSum - node.left.val);
    }
  }
  return false;
};
```
