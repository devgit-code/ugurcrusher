/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "http://localhost:3000/wp-content/plugins/zion-builder/dist";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 259);
/******/ })
/************************************************************************/
/******/ ({

/***/ 259:
/***/ (function(module, exports) {

eval("/**\r\n * WordPress Dependencies\r\n */\nvar $ = window.jQuery;\nvar GutenbergIntegration = {\n  buttonsAdded: false,\n  init: function init() {\n    var self = this;\n    wp.data.subscribe(function () {\n      self.addButtons();\n    });\n  },\n  addButtons: function addButtons() {\n    if (this.buttonsAdded) {\n      return false;\n    }\n\n    var $buttonsWrapper = $($('#zionbuilder-gutenberg-panel').html());\n    var $tableOfContents = $('.table-of-contents');\n\n    if ($tableOfContents.length > 0) {\n      $buttonsWrapper.insertAfter($tableOfContents); // Set a flag that the buttons were already added\n\n      this.buttonsAdded = true;\n    }\n  }\n};\nGutenbergIntegration.init();\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvZ3V0ZW5iZXJnLmpzP2JkMGQiXSwibmFtZXMiOlsiJCIsIndpbmRvdyIsImpRdWVyeSIsIkd1dGVuYmVyZ0ludGVncmF0aW9uIiwiYnV0dG9uc0FkZGVkIiwiaW5pdCIsInNlbGYiLCJ3cCIsImRhdGEiLCJzdWJzY3JpYmUiLCJhZGRCdXR0b25zIiwiJGJ1dHRvbnNXcmFwcGVyIiwiaHRtbCIsIiR0YWJsZU9mQ29udGVudHMiLCJsZW5ndGgiLCJpbnNlcnRBZnRlciJdLCJtYXBwaW5ncyI6IkFBQUE7OztBQUdBLElBQU1BLENBQUMsR0FBR0MsTUFBTSxDQUFDQyxNQUFqQjtBQUNBLElBQUlDLG9CQUFvQixHQUFHO0FBQzFCQyxjQUFZLEVBQUUsS0FEWTtBQUUxQkMsTUFGMEIsa0JBRXBCO0FBQ0wsUUFBSUMsSUFBSSxHQUFHLElBQVg7QUFDQUMsTUFBRSxDQUFDQyxJQUFILENBQVFDLFNBQVIsQ0FBa0IsWUFBWTtBQUM3QkgsVUFBSSxDQUFDSSxVQUFMO0FBQ0EsS0FGRDtBQUdBLEdBUHlCO0FBUTFCQSxZQVIwQix3QkFRZDtBQUNYLFFBQUksS0FBS04sWUFBVCxFQUF1QjtBQUN0QixhQUFPLEtBQVA7QUFDQTs7QUFFRCxRQUFJTyxlQUFlLEdBQUdYLENBQUMsQ0FBRUEsQ0FBQyxDQUFDLDhCQUFELENBQUQsQ0FBa0NZLElBQWxDLEVBQUYsQ0FBdkI7QUFDQSxRQUFJQyxnQkFBZ0IsR0FBR2IsQ0FBQyxDQUFDLG9CQUFELENBQXhCOztBQUVBLFFBQUlhLGdCQUFnQixDQUFDQyxNQUFqQixHQUEwQixDQUE5QixFQUFpQztBQUNoQ0gscUJBQWUsQ0FBQ0ksV0FBaEIsQ0FBNEJGLGdCQUE1QixFQURnQyxDQUdoQzs7QUFDQSxXQUFLVCxZQUFMLEdBQW9CLElBQXBCO0FBQ0E7QUFHRDtBQXhCeUIsQ0FBM0I7QUEyQkFELG9CQUFvQixDQUFDRSxJQUFyQiIsImZpbGUiOiIyNTkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogV29yZFByZXNzIERlcGVuZGVuY2llc1xyXG4gKi9cclxuY29uc3QgJCA9IHdpbmRvdy5qUXVlcnlcclxubGV0IEd1dGVuYmVyZ0ludGVncmF0aW9uID0ge1xyXG5cdGJ1dHRvbnNBZGRlZDogZmFsc2UsXHJcblx0aW5pdCgpe1xyXG5cdFx0bGV0IHNlbGYgPSB0aGlzO1xyXG5cdFx0d3AuZGF0YS5zdWJzY3JpYmUoZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRzZWxmLmFkZEJ1dHRvbnMoKTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0YWRkQnV0dG9ucygpe1xyXG5cdFx0aWYoIHRoaXMuYnV0dG9uc0FkZGVkICl7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcdFxyXG5cdFx0fVxyXG5cclxuXHRcdGxldCAkYnV0dG9uc1dyYXBwZXIgPSAkKCAkKCcjemlvbmJ1aWxkZXItZ3V0ZW5iZXJnLXBhbmVsJykuaHRtbCgpICk7XHJcblx0XHRsZXQgJHRhYmxlT2ZDb250ZW50cyA9ICQoJy50YWJsZS1vZi1jb250ZW50cycpO1xyXG5cclxuXHRcdGlmKCAkdGFibGVPZkNvbnRlbnRzLmxlbmd0aCA+IDAgKXtcclxuXHRcdFx0JGJ1dHRvbnNXcmFwcGVyLmluc2VydEFmdGVyKCR0YWJsZU9mQ29udGVudHMpO1xyXG5cdFxyXG5cdFx0XHQvLyBTZXQgYSBmbGFnIHRoYXQgdGhlIGJ1dHRvbnMgd2VyZSBhbHJlYWR5IGFkZGVkXHJcblx0XHRcdHRoaXMuYnV0dG9uc0FkZGVkID0gdHJ1ZTtcclxuXHRcdH1cclxuXHJcblxyXG5cdH1cclxufVxyXG5cclxuR3V0ZW5iZXJnSW50ZWdyYXRpb24uaW5pdCgpOyJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///259\n");

/***/ })

/******/ });