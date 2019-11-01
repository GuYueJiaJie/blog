[105.从前序与中序遍历序列构造二叉树](https://leetcode-cn.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/submissions/)。

[力扣 JS 题解。](https://github.com/GuYueJiaJie/blog/blob/master/%E7%AE%97%E6%B3%95%E4%B8%8E%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84/README.md)

题目不难，了解二叉树前、中序的特点编写代码即可。

```javascript
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {number[]} preorder
 * @param {number[]} inorder
 * @return {TreeNode}
 */
var buildTree = function(preorder, inorder) {
  if (preorder.length <= 0 || inorder.length <= 0) {
    return null;
  }
  return help(preorder, inorder, 0, 0, inorder.length - 1);
};

function help(preorder, inorder, index, start, end) {
  if (start > end) {
    return null;
  }
  let pre = preorder[index];
  let tmpIndex = inorder.indexOf(pre);
  let node = new TreeNode(pre);
  node.left = help(preorder, inorder, index + 1, start, tmpIndex - 1);
  // 注意此处第三个参数是tmpIndex-start+1，tmpIndex-start表示左子树的节点个数
  node.right = help(
    preorder,
    inorder,
    index + tmpIndex - start + 1,
    tmpIndex + 1,
    end
  );
  return node;
}
```
