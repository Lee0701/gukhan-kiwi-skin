/******/ (() => { // webpackBootstrap
/*!************************!*\
  !*** ./src/js/main.js ***!
  \************************/
function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var indicesUrl = "{{ site.baseUrl }}{{ site.path.indices }}";
var pagesUrl = "{{ site.baseUrl }}{{ site.path.pages }}";
var pageExtension = "{{ site.extension.page }}";
var url = new URL(location.href);
window.addEventListener('load', function () {
  console.log(url.pathname);
  if (url.pathname == '/search.html') displaySearchResult();
});

var displaySearchResult = function displaySearchResult() {
  var gotoResult = document.querySelector('#goto-result');
  var searchResult = document.querySelector('#search-result');
  var searchString = decodeURIComponent(url.searchParams.get('search') || '');

  _goto(searchString, function (url) {
    gotoResult.innerHTML = '<h2>文書名 一致: <a href="' + url + '">' + searchString + '</a><h2>';
  });

  search(searchString, function (data) {
    var word = data.word;

    var _iterator = _createForOfIteratorHelper(data.pages),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        entry = _step.value;
        var title = entry.title;
        var url = pageUrl(title);
        var surrounding = entry.surrounding;
        var index = surrounding.indexOf(word);
        surrounding = surrounding.substring(0, index) + '<span class="bold">' + word + '</span>' + surrounding.substring(index + word.length);
        var div = document.createElement('div');
        div.classList.add('result-entry');
        div.innerHTML = '<h3 class="title">' + '<a href="' + url + '">' + title + '</a></h3>' + '<p class="surrounding">' + surrounding + '</p>';
        searchResult.appendChild(div);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  });
};

function _goto(searchString, callback) {
  var url = pageUrl(searchString);
  var request = new XMLHttpRequest();

  request.onreadystatechange = function () {
    if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
      callback(url);
    }
  };

  request.open("GET", url);
  request.send(null);
}

function search(searchString, callback) {
  var request = new XMLHttpRequest();

  request.onreadystatechange = function () {
    if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
      var data = JSON.parse(request.responseText);
      callback(data);
    }
  };

  request.open("GET", indicesUrl + '/' + searchString + '.json');
  request.send(null);
}

function pageUrl(title) {
  return pagesUrl + '/' + title.replace(/ /g, '_') + pageExtension;
}
/******/ })()
;
//# sourceMappingURL=bundle.js.map