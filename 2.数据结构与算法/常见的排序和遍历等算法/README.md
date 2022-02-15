|              |                 1                  |                   2                    |                 3                 |                 4                 |                  5                   |                6                 |                7                 |
| :----------: | :--------------------------------: | :------------------------------------: | :-------------------------------: | :-------------------------------: | :----------------------------------: | :------------------------------: | :------------------------------: |
|   排序算法   | [快速排序（不稳定）](#快排-不稳定) | [选择排序（不稳定）](#选择排序-不稳定) | [冒泡排序(稳定)](#冒泡排序-稳定)  | [插入排序(稳定)](#插入排序-稳定)  | [希尔排序(不稳定)](#希尔排序-不稳定) | [归并排序(稳定)](#归并排序-稳定) | [堆排序(不稳定)](#堆排序-不稳定) |
| 二叉树的遍历 | [先序遍历二叉树](#先序遍历二叉树)  |   [中序遍历二叉树](#中序遍历二叉树)    | [后序遍历二叉树](#后序遍历二叉树) | [层序遍历二叉树](#层序遍历二叉树) |                                      |                                  |                                  |
|   查找算法   |       [二分查找](#二分查找)        |                                        |                                   |                                   |                                      |                                  |                                  |

# 排序算法

[十大经典排序算法。](https://github.com/hustcc/JS-Sorting-Algorithm)

![image](https://github.com/hustcc/JS-Sorting-Algorithm/raw/master/res/sort.png)

## 快排-不稳定

[快速排序多代码实现。](https://github.com/hustcc/JS-Sorting-Algorithm/blob/master/6.quickSort.md)

**思路**： 选取一个基准，通过一趟排序将待排记录分割成独立的两部分，其中一部分的关键字均小于等于基准，另一部分的关键字 均大于等于基准，然后对这两部分再别进行排序，以达到整个序列有序的目的。

**稳定性**：不稳定。

**时间复杂度**：平均为 nlogn，最优也是 nlogn，最差为 n²（在顺序或者逆序情况下，此时递归二叉树画出来就是一个单边斜树）。

**空间复杂度**：主要是递归造成的栈空间的使用，平均为 logn，最好也是 logn，最差要进行 n-1 次递归调用，复杂度是 n。

**快排优化**：

1.  **优化选取基准值**。尽量选取中间值，避免最差情况发生。因此可以取首元素，尾元素和中间元素中的中间数作为基准。
2.  优化不必要的交换。将基准值临时存储，然后在比较过程中直接赋值，不产生交换。
3.  优化小数组时的排序方案。数组很小时，不选用快速排序，直接插入排序是简单排序中性能最好的。
4.  递归优化。利用尾递归优化的思想，在 sort 中不设置递归函数，而是将 if 判断改为循环，第二个递归处更新左侧下标值。见下例。

        [原理](https://www.zhihu.com/question/285631475)：双递归函数是不管当前函数栈还有没有用，继续递归还是要加一层栈；

    单递归就是尾递归优化的思想，当前函数栈没用的时候直接被替换了。

**基本步骤：**

1. 首先，选取数组的中间项作为参考点 pivot。

2. 创建左右两个指针 left 和 right，left 指向数组的第一项，right 指向最后一项，然后移动左指针，直到其值不小于 pivot，然后移动右指针，直到其值不大于 pivot。
3. 如果 left 仍然不大于 right，交换左右指针的值（指针不交换），然后左指针右移，右指针左移，继续循环直到 left 大于 right 才结束，返回 left 指针的值。
4. 根据上一轮分解的结果（left 的值），切割数组得到 left 和 right 两个数组，然后分别再分解。
5. 重复以上过程，直到数组长度为 1 才结束分解。

动图演示：  
![image](https://github.com/hustcc/JS-Sorting-Algorithm/raw/master/res/quickSort.gif)

**实现一：**

```javascript
function partition(arr, left, right) {
  let mid = Math.floor((left + right) / 2);
  // 下面三个if是为了优化pivot尽量选取中间值
  // 确保三个值中right位置上的最大，那么比较left和mid就可以判断哪一个是中间值了
  if (arr[left] > arr[right]) {
    [arr[left], arr[right]] = [arr[right], arr[left]];
  }
  if (arr[mid] > arr[right]) {
    [arr[mid], arr[right]] = [arr[right], arr[mid]];
  }
  if (arr[mid] > arr[left]) {
    [arr[mid], arr[left]] = [arr[left], arr[mid]];
  }
  let pivotKey = arr[left];
  while (left < right) {
    while (left < right && arr[right] >= pivotKey) {
      right--;
    }
    arr[left] = arr[right];
    while (left < right && arr[left] <= pivotKey) {
      left++;
    }
    arr[right] = arr[left];
  }
  arr[left] = pivotKey;
  return left;
}

function sort(arr, left, right) {
  // 方法一：双递归函数，流程图就是一个二叉树
  // if (left < right) {
  //   let pivot = partition(arr, left, right);
  //   sort(arr, left, pivot - 1);
  //   sort(arr, pivot + 1, right);
  // }

  // 方法二：对递归进行优化，流程图如下所示
  while (left < right) {
    let pivot = partition(arr, left, right);
    sort(arr, left, pivot - 1);
    left = pivot + 1; //
  }
}

function quickSort(arr) {
  if (!Array.isArray(arr) | (arr.length < 1)) {
    return;
  }
  sort(arr, 0, arr.length - 1);
}

var arr = [1, 4, 3, 6, 8, 5, 6, 2, 9, 10, 13, 0, 7, 5];
quickSort(arr);
console.log(arr);
```

![image](https://m.qpic.cn/psb?/V12AJprp1zvvKZ/IKbQOkY8k2qiGy5A8wOjwdGzVddQEG3YGyfhjig2oB0!/b/dD4BAAAAAAAA&bo=AQYIAgAAAAADBy8!&rf=viewer_4)

## 选择排序-不稳定

**时间复杂度**：什么情况下都是`O(n²)`。

**空间复杂度**：`O(1)`

```javascript
function selectSOrt(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    let small = i;
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[small]) {
        small = j;
      }
    }
    [arr[i], arr[small]] = [arr[small], arr[i]];
  }
}

var arr = [1, 4, 3, 6, 8, 5, 6, 2, 9, 10, 13, 0, 7, 5];
selectSOrt(arr);
console.log(arr);
```

## 冒泡排序-稳定

**时间复杂度**：最好是在顺序排列时，为`O(n)`，最坏是在逆序，为`O(n²)`，平均为`O(n²)`

**空间复杂度**：`O(1)`

```javascript
function bubble(arr) {
  if (!Array.isArray(arr)) throw new Error("传入的参数不是数组");
  let length = arr.length;
  for (let i = 0; i < length - 1; i++) {
    let isDone = true;
    for (let j = 0; j < length - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        isDone = false;
      }
    }
    if (isDone) break;
  }
  return arr;
}

var arr = [1, 4, 3, 6, 8, 5, 6, 2, 9, 10, 13, 0, 7, 5];
bubble(arr);
console.log(arr);
```

## 插入排序-稳定

**时间复杂度**：最好是顺序排列，为`O(n)`，最坏是逆序，为`O(n²)`，平均是`O(n²)`

**空间复杂度**：`O(1)`。

```javascript
function insert(arr) {
  if (!Array.isArray(arr)) throw new Error("传入的参数不是数组");
  let length = arr.length;
  for (let i = 1; i < length; i++) {
    let preIndex = i - 1;
    let currentValue = arr[i];
    while (preIndex >= 0 && arr[preIndex] > currentValue) {
      arr[preIndex + 1] = arr[preIndex];
      preIndex--;
    }
    arr[preIndex + 1] = currentValue;
  }
  return arr;
}
var arr = [1, 4, 3, 6, 8, 5, 6, 2, 9, 10, 13, 0, 7, 5];
insert(arr);
console.log(arr);
```

## 希尔排序-不稳定

希尔排序是基于插入排序的以下两点性质而提出改进方法的：

- 插入排序对已经排好序的数据进行操作时，效率高，即可以达到线性排序的效率。
- 但插入排序一般来说是低效的，因为插入排序每次只能将数据移动一位。

希尔排序的**基本思想**是：先将整个待排序的记录序列分割成若干子序列分别进行直接插入排序，待整个序列中的记录“基本有序”时，再对全体记录进行依次直接插入排序。

**时间复杂度**：希尔排序的时间复杂度跟增量有关系。

- 使用（1,2,4,8,,...）这种不是很好的增量序列时，最坏时间复杂度为`O(n²)`.
- 使用(1,3,7,...,2^k-1)，这种序列的时间复杂度（最坏）为`O(n^1.5)`.

**空间复杂度**：`O(1)`

```javascript
function shell(arr) {
  if (!Array.isArray(arr)) return null;
  let gap = arr.length,
    length = arr.length,
    item;
  while (gap > 1) {
    gap = Math.floor(gap / 3) + 1;
    for (let i = gap; i < length; i++) {
      item = arr[i]; // 像插入排序一样，暂存这个值
      for (var j = i - gap; j >= 0 && arr[j] > item; j -= gap) {
        arr[j + gap] = arr[j];
      }
      arr[j + gap] = item;
    }
  }
  return arr;
}

var arr = [1, 4, 3, 6, 8, 5, 6, 2, 3, 5, 8, 9, 10, 13, 0, 7, 5];
shell(arr);
console.log(arr);
```

## 归并排序-稳定

[归并排序多代码实现。](https://github.com/hustcc/JS-Sorting-Algorithm/blob/master/5.mergeSort.md)

**思路**：归并排序采用的是分治法的策略，原理是假设初始序列含有 N 个记录，则可以把它看成是 n 个有序的子序列，每个子序列的长度是 1，然后进行两两归并，会得到多个长度为 2 或 1 的子序列，然后再继续进行两两归并，如此重复，直到得到一个长度为 n 的有序序列为止。

**稳定性**：**稳定**。因为归并过程中，相等的两个元素并不会产生交换，所以是稳定的。

**时间复杂度**：`O(nlgn)`。

**空间复杂度**：常规为`O(n)`，但也可以`O(1)`实现。

归并排序可以用两种方式实现：

1. 自上而下的递归。
2. 自下而上的迭代。

**动图演示**：

![image](https://github.com/hustcc/JS-Sorting-Algorithm/raw/master/res/mergeSort.gif)

**自上而下的递归**：

方法一：

```javascript
// 方法一，空间复杂度存疑
function mergeSort(arr) {
  if (arr.length < 2) {
    return arr;
  }
  let mid = Math.floor(arr.length / 2),
    left = arr.slice(0, mid),
    right = arr.slice(mid);
  return merge(mergeSort(left), mergeSort(right));
}

function merge(left, right) {
  let result = [];
  while (left.length && right.length) {
    if (left[0] <= right[0]) {
      result.push(left.shift());
    } else {
      result.push(right.shift());
    }
  }

  return result.concat(left.length ? left : right);
}
```

方法二：

```javascript
function mergeSort(arr) {
  let temp = []; //辅助函数，用于存储排序过程中排成的序列
  let left = 0,
    right = arr.length - 1;
  sort(arr, left, right, temp);
}

function sort(arr, left, right, temp) {
  if (left < right) {
    let mid = Math.floor((left + right) / 2);
    sort(arr, left, mid, temp);
    sort(arr, mid + 1, right, temp);
    mergeArray(arr, left, mid, right, temp);
  }
}

function mergeArray(arr, left, mid, right, temp) {
  let i = left,
    j = mid + 1,
    k = 0;
  while (i <= mid && j <= right) {
    if (arr[i] <= arr[j]) {
      temp[k++] = arr[i++];
    } else {
      temp[k++] = arr[j++];
    }
  }

  while (i <= mid) {
    temp[k++] = arr[i++];
  }

  while (j <= right) {
    temp[k++] = arr[j++];
  }
  k = 0;
  while (left <= right) {
    arr[left++] = temp[k++];
  }
}
```

方法三：（**原地排序**）  
[参考链接](http://www.cnblogs.com/daniagger/archive/2012/07/25/2608373.html)

```javascript
//原地排序
function swap(arr, left, right) {
  let temp = arr[left];
  arr[left] = arr[right];
  arr[right] = temp;
}
function reverseArray(arr, start, length) {
  let left = start,
    right = start + length - 1;
  while (left < right) {
    swap(arr, left, right);
    left++;
    right--;
  }
}

function exchange(arr, start, length, leftLength) {
  reverseArray(arr, start, leftLength);
  reverseArray(arr, start + leftLength, length - leftLength);
  reverseArray(arr, start, length);
}

// 函数的目的是为了将左右两个已排序序列在数组内完成排序
function mergeArray(arr, start, startOfRight, end) {
  while (start < startOfRight && startOfRight <= end) {
    let step = 0;
    while (start < startOfRight && arr[start] <= arr[startOfRight]) {
      // 找到左边序列中不小于右边序列首元素的数组下标
      start++;
    }
    while (startOfRight <= end && arr[startOfRight] < arr[start]) {
      // 找到右边序列中小于当前arr[start]的所有元素
      // 此处不能是小于等于，否则会不稳定
      startOfRight++;
      step++;
    }
    exchange(arr, start, startOfRight - start, startOfRight - start - step);
    start += step; // 可以减少step次比较
  }
}

function sort(arr, left, right) {
  if (left < right) {
    let mid = Math.floor((left + right) / 2);
    sort(arr, left, mid);
    sort(arr, mid + 1, right);
    mergeArray(arr, left, mid + 1, right); //mid+1是右边数组的起始位置
  }
}

function mergeSort(arr) {
  if (!Array.isArray(arr) | (arr.length < 1)) {
    return;
  }
  sort(arr, 0, arr.length - 1);
}
```

## 堆排序-不稳定

堆排序是利用堆这种数据结构所设计的一种排序算法。

堆分为大顶堆和小顶堆。大顶堆是每个节点的值都大于或等于其左右孩子节点的值；小顶堆是每个节点的值都小于或等于其孩子节点的值。

**排序思路**：将待排序的序列构造成一个大顶堆。此时整个序列的最大值就是堆顶的根节点，将它移走（其实就是将其与堆数组的末尾元素交换，此时末尾元素就是最大值），然后将剩余的 n-1 个序列重新构造成一个堆，这样就会得到 n 个元素中的次大值。如此反复执行，便能得到一个有序序列了。

需要关注的操作：

1. 把一个无序序列构建成大顶堆：从下往上，从右往左，将每个非终端节点（非叶节点）当做根节点，将其和其子树调整成大顶堆。
2. 输出栈顶元素后，调整剩余元素成为一个新的堆。

**时间复杂度**：时间复杂度为`O(nlogn)`。由于堆排序对原始记录的排序状态并不敏感，因此它无论是最好，最坏还是平均都是`O(nlogn)`。但由于构建堆所需的比较次数较多，所以并不适合待排序列个数较少的情况。

**空间复杂度**：`O(1)`

**动图演示**：

![堆排序](https://github.com/hustcc/JS-Sorting-Algorithm/raw/master/res/heapSort.gif)

```javascript
function heapAdjust(arr, index, length) {
  // index是数组下标，length是数组长度
  let temp = arr[index];
  for (let j = 2 * index + 1; j < length; j = j * 2 + 1) {
    if (j < length - 1 && arr[j] < arr[j + 1]) {
      // j为较大节点的数组下标
      ++j;
    }
    if (temp >= arr[j]) break;
    arr[index] = arr[j];
    index = j;
  }
  arr[index] = temp;
}

function heapSort(arr) {
  if (!Array.isArray(arr)) return null;
  let index = Math.floor((arr.length - 2) / 2);
  while (index >= 0) {
    heapAdjust(arr, index, arr.length);
    index--;
  }
  for (let i = arr.length - 1; i > 0; i--) {
    [arr[i], arr[0]] = [arr[0], arr[i]];
    heapAdjust(arr, 0, i);
  }
}

var arr = [1, 4, 3, 6, 8, 5, 6, 2, 3, 5, 8, 9, 10, 13, 0, 7, 5];
heapSort(arr);
console.log(arr);
```

---

# 遍历

## 测试用例

```javascript
var tree = {
  value: "1",
  left: {
    value: "2",
    left: {
      value: "3"
    },
    right: {
      value: "4",
      left: {
        value: "5"
      },
      right: {
        value: "6"
      }
    }
  },
  right: {
    value: "7",
    left: {
      value: "8"
    },
    right: {
      value: "9"
    }
  }
};
```

结构为：

```
		            1                   -第一层
	    2                       7       -第二层
    3		4               8       9   -第三层
          5   6                         -第四层
```

## 先序遍历二叉树

**递归法：**

```javascript
function preOrderRecursion(node) {
  if (node) {
    console.log(node.value); //对节点进行操作
    preOrderRecursion(node.left);
    preOrderRecursion(node.right);
  }
}
```

**非递归法：**

```javascript
function preOrder(node) {
  if (!node) return null;
  let stack = [node];
  while (stack.length !== 0) {
    node = stack.pop();
    console.log(node.value);
    // 注意，因为是栈，要先取出左子节点，所以先存入右子节点
    // 如果右子节点存在则将其存入栈
    node.right && stack.push(node.right);
    // 如果左子节点存在则将其存入栈
    node.left && stack.push(node.left);
  }
}
```

## 中序遍历二叉树

**递归法：**

```javascript
function inOrderRecursion(node) {
  if (node) {
    inOrderRecursion(node.left);
    console.log(node.value);
    inOrderRecursion(node.right);
  }
}
```

**非递归法：**

```javascript
function inOrder(node) {
  if (!node) return null;
  let stack = [];
  while (stack.length !== 0 || node) {
    if (node) {
      stack.push(node);
      node = node.left;
    } else {
      node = stack.pop();
      console.log(node.value); // 对节点进行处理
      node = node.right;
    }
  }
}
```

## 后序遍历二叉树

**递归法：**

```javascript
function afterOrderRecursion(node) {
  if (node) {
    afterOrderRecursion(node.left);
    afterOrderRecursion(node.right);
    console.log(node.value);
  }
}
```

**非递归法：**

```javascript
function afterOrder(node) {
  if (!node) return null;
  let stack = [node],
    tmp;
  while (stack.length !== 0) {
    tmp = stack[stack.length - 1];
    if (tmp.left && tmp.left !== node && tmp.right !== node) {
      stack.push(tmp.left);
    } else if (tmp.right && tmp.right !== node) {
      stack.push(tmp.right);
    } else {
      node = stack.pop(); // node用于记录上次一操作的节点
      console.log(node.value);
    }
  }
}
```

## 层序遍历二叉树

使用数组模拟队列，首先将根节点入队。当队列不为空时，执行循环：取出队列中的第一个节点，如果该节点有左子节点，将左子节点入队；如果有右子节点，将右子节点入队。

这样队列中节点的顺序就是按照本身层序遍历的顺序进行排列的。

```javascript
function breadthTraverse(node) {
  if (!node) return null;
  let stack = [node];
  while (stack.length !== 0) {
    node = stack.shift();
    console.log(node.value);
    node.left && stack.push(node.left);
    node.right && stack.push(node.right);
  }
}
```

# 查找算法

## 二分查找

**输入**：一个有序的元素列表

**时间复杂度**：`$y=O(logn)$`

```javascript
// 不要使用递归法，递归法会浪费不必要的空间

function binarySearch1(arr, key) {
  if (!arr) return;
  let left = 0,
    right = arr.length - 1;
  console.time("binarySearch1");
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    let item = arr[mid];
    if (item === key) {
      console.timeEnd("binarySearch1");
      return mid;
    } else if (key > item) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  console.timeEnd("binarySearch1");
  return -1;
}

var arr = [];
for (let i = 0; i < 10000; i++) {
  arr[i] = i;
}

console.log(binarySearch1(arr, 5000));
```
