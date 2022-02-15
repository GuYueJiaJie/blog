/*
 * @lc app=leetcode.cn id=76 lang=javascript
 *
 * [76] 最小覆盖子串
 *
 * https://leetcode-cn.com/problems/minimum-window-substring/description/
 *
 * algorithms
 * Hard (42.60%)
 * Likes:    1569
 * Dislikes: 0
 * Total Accepted:    220.1K
 * Total Submissions: 509.7K
 * Testcase Example:  '"ADOBECODEBANC"\n"ABC"'
 *
 * 给你一个字符串 s 、一个字符串 t 。返回 s 中涵盖 t 所有字符的最小子串。如果 s 中不存在涵盖 t 所有字符的子串，则返回空字符串 ""
 * 。
 *
 *
 *
 * 注意：
 *
 *
 * 对于 t 中重复字符，我们寻找的子字符串中该字符数量必须不少于 t 中该字符数量。
 * 如果 s 中存在这样的子串，我们保证它是唯一的答案。
 *
 *
 *
 *
 * 示例 1：
 *
 *
 * 输入：s = "ADOBECODEBANC", t = "ABC"
 * 输出："BANC"
 *
 *
 * 示例 2：
 *
 *
 * 输入：s = "a", t = "a"
 * 输出："a"
 *
 *
 * 示例 3:
 *
 *
 * 输入: s = "a", t = "aa"
 * 输出: ""
 * 解释: t 中两个字符 'a' 均应包含在 s 的子串中，
 * 因此没有符合条件的子字符串，返回空字符串。
 *
 *
 *
 * 提示：
 *
 *
 * 1
 * s 和 t 由英文字母组成
 *
 *
 *
 * 进阶：你能设计一个在 o(n) 时间内解决此问题的算法吗？
 */

// @lc code=start
/**
 * @param {string} s
 * @param {string} t
 * @return {string}
 */
var minWindow = function (s, t) {
    const map = new Map();
    for (let c of t) {
        mapSet(map, c);
    }

    let left = (right = valid = 0);
    const windowsMap = new Map();
    let start = 0;
    let len = Infinity;

    while (right < s.length) {
        const curChar = s[right];
        right++;

        if (map.has(curChar)) {
            mapSet(windowsMap, curChar);

            if (map.get(curChar) === windowsMap.get(curChar)) {
                valid++;
            }
        }

        while (valid === map.size) {
            const delChar = s[left];

            if (right - left < len) {
                start = left;
                len = right - left;
            }

            left++;

            if (map.has(delChar)) {
                // 这里必须要等到两者相等的时候才能够对有效数字做减一操作
                // 因为某一个字母可能重复出现
                if (map.get(delChar) === windowsMap.get(delChar)) {
                    valid--;
                }
                windowsMap.set(delChar, windowsMap.get(delChar) - 1);
            }
        }
    }

    return Number.isFinite(len) ? s.substring(start, start + len) : '';
};

function mapSet(map, item) {
    if (map.has(item)) {
        map.set(item, map.get(item) + 1);
    } else {
        map.set(item, 1);
    }
}
// @lc code=end
