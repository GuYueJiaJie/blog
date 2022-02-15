/*
 * @lc app=leetcode.cn id=34 lang=javascript
 *
 * [34] 在排序数组中查找元素的第一个和最后一个位置
 *
 * https://leetcode-cn.com/problems/find-first-and-last-position-of-element-in-sorted-array/description/
 *
 * algorithms
 * Medium (42.29%)
 * Likes:    1441
 * Dislikes: 0
 * Total Accepted:    427.7K
 * Total Submissions: 1M
 * Testcase Example:  '[5,7,7,8,8,10]\n8'
 *
 * 给定一个按照升序排列的整数数组 nums，和一个目标值 target。找出给定目标值在数组中的开始位置和结束位置。
 *
 * 如果数组中不存在目标值 target，返回 [-1, -1]。
 *
 * 进阶：
 *
 *
 * 你可以设计并实现时间复杂度为 O(log n) 的算法解决此问题吗？
 *
 *
 *
 *
 * 示例 1：
 *
 *
 * 输入：nums = [5,7,7,8,8,10], target = 8
 * 输出：[3,4]
 *
 * 示例 2：
 *
 *
 * 输入：nums = [5,7,7,8,8,10], target = 6
 * 输出：[-1,-1]
 *
 * 示例 3：
 *
 *
 * 输入：nums = [], target = 0
 * 输出：[-1,-1]
 *
 *
 *
 * 提示：
 *
 *
 * 0
 * -10^9
 * nums 是一个非递减数组
 * -10^9
 *
 *
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var searchRange = function (nums, target) {
    return [findLeft(nums, target), findRight(nums, target)];
};

function findLeft(nums, target) {
    let left = 0,
        right = nums.length - 1;

    while (left <= right) {
        const mid = left + Math.floor((right - left) / 2);
        const cur = nums[mid];

        if (cur >= target) {
            right = mid - 1;
        } else {
            left = mid + 1;
        }
    }

    // 找到的时候, left一定在对应的位置上: 因为当cur与target相等时, 只移动right, 而left不变
    // 没有找到分析有两种情况:
    // 1. target比nums的最大值大或者比最小值还小, 那么最终left会超出右边界, 或者right超出左边界
    //    因为left和right都是+1/-1的移动, 所以如果是right超出左边界, 那么left一定是0, 而right < 0;
    //    同理, 如果是left超出右边界, 那么right一定是nums.length - 1, 而left > nums.length - 1.
    // 2. target的范围在nums某两个元素中间, 但是没有找到, 比如nums是[3, 6], 但是target是5
    // 所以这里的判断, 其实要把两种不存在的情况都做判断
    // 但是以left作为基础判断时, nums[left] !== target 就已经包含了right超出左边界的情况, 此时left是0
    // 但是left超出右边界时不能这么判断, 因为nums[left]此时找不到对应元素
    // 而且这里的顺序要注意, 一定要先判断left >= nums.length, 然后才是nums[left] !== target
    if (left >= nums.length || nums[left] !== target) {
        return -1;
    }

    return left;
}

function findRight(nums, target) {
    let left = 0,
        right = nums.length - 1;

    while (left <= right) {
        const mid = left + Math.floor((right - left) / 2);
        const cur = nums[mid];

        if (cur > target) {
            right = mid - 1;
        } else {
            left = mid + 1;
        }
    }

    // 这里与找左边界真好相反
    if (right < 0 || nums[right] !== target) {
        return -1;
    }

    return right;
}
// @lc code=end
