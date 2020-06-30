const sortByLastEditTime = function (arr) {
  arr && arr.sort((a, b) => compareDate(partialSort(a), partialSort(b)));
  return getFirstDeepArr(arr);
};

const getFirstDeepArr = function (arr) {
  let firstArr = arr[0];
  while (isDir(firstArr)) {
    arr = getBlogSetValue(firstArr);
    firstArr = arr[0];
  }
  return firstArr;
};

const partialSort = function (blog) {
  return isDir(blog) ? sortByLastEditTime(getBlogSetValue(blog)).lastEditTime : blog.lastEditTime;
};

const getBlogSetValue = function (blogSet) {
  return Object.values(blogSet)[0];
};

const isDir = function (detail) {
  return Object.keys(detail).length === 1;
};

const compareDate = function (date1, date2) {
  if (!date2) {
    return -1;
  }
  if (!date1) {
    return 1;
  }
  return new Date(date1) > new Date(date2) ? -1 : 1;
};

module.exports = sortByLastEditTime