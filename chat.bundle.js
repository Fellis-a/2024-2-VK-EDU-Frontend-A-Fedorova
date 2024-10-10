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
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./js/chat.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./css/chat.css":
/*!**********************!*\
  !*** ./css/chat.css ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// extracted by mini-css-extract-plugin\n\n//# sourceURL=webpack:///./css/chat.css?");

/***/ }),

/***/ "./js/chat.js":
/*!********************!*\
  !*** ./js/chat.js ***!
  \********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _css_chat_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../css/chat.css */ \"./css/chat.css\");\n/* harmony import */ var _css_chat_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_css_chat_css__WEBPACK_IMPORTED_MODULE_0__);\nfunction _createForOfIteratorHelper(r, e) { var t = \"undefined\" != typeof Symbol && r[Symbol.iterator] || r[\"@@iterator\"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && \"number\" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError(\"Invalid attempt to iterate non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.\"); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t[\"return\"] || t[\"return\"](); } finally { if (u) throw o; } } }; }\nfunction _unsupportedIterableToArray(r, a) { if (r) { if (\"string\" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return \"Object\" === t && r.constructor && (t = r.constructor.name), \"Map\" === t || \"Set\" === t ? Array.from(r) : \"Arguments\" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }\nfunction _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }\n\nvar form = document.querySelector('form');\nvar input = document.querySelector('.chat__input');\nvar message = document.querySelector('.chat__messages');\nvar MESSAGES_KEY = 'messages';\nvar selectedChatId = localStorage.getItem('selectedChatId');\nvar selectedName = localStorage.getItem('name');\nvar chatName = document.querySelector(' .chat__name');\nform.addEventListener('submit', handleSubmit);\nvar currentUser = 'Я';\nvar otherUser = selectedName;\nconsole.log(otherUser);\nfunction getMessages() {\n  var messages = localStorage.getItem(MESSAGES_KEY);\n  if (messages) {\n    return JSON.parse(messages);\n  } else return {};\n}\nfunction saveMessages(chatId, messages) {\n  var allMessages = getMessages();\n  allMessages[chatId] = messages;\n  localStorage.setItem(MESSAGES_KEY, JSON.stringify(allMessages));\n}\nfunction displayMessages() {\n  chatName.textContent = selectedName;\n  var messages = getMessages()[selectedChatId] || [];\n  message.innerHTML = '';\n  var _iterator = _createForOfIteratorHelper(messages),\n    _step;\n  try {\n    for (_iterator.s(); !(_step = _iterator.n()).done;) {\n      var msg = _step.value;\n      var newMessage = document.createElement(\"div\");\n      newMessage.innerHTML = \" <strong>\".concat(msg.sender, \"</strong><p> \").concat(msg.text, \"</p><div><span class=\\\"message__time\\\">\").concat(msg.time, \"</span><i class=\\\"material-icons\\\">done_all</i></div>\");\n      newMessage.classList.add('message');\n      newMessage.classList.add(msg.sender === currentUser ? 'sent' : 'received');\n      message.append(newMessage);\n    }\n  } catch (err) {\n    _iterator.e(err);\n  } finally {\n    _iterator.f();\n  }\n  scrollToBottom();\n}\nfunction getCurrentTime() {\n  var now = new Date();\n  var day = String(now.getDate()).padStart(2, '0');\n  var month = String(now.getMonth() + 1).padStart(2, '0');\n  var year = now.getFullYear();\n  var hours = String(now.getHours()).padStart(2, '0');\n  var minutes = String(now.getMinutes()).padStart(2, '0');\n  return \"\".concat(day, \".\").concat(month, \".\").concat(year, \" \").concat(hours, \":\").concat(minutes);\n}\nfunction handleSubmit(event) {\n  event.preventDefault();\n  var messageText = input.value.trim();\n  if (messageText) {\n    var messages = getMessages()[selectedChatId] || [];\n    var newMessage = {\n      text: messageText,\n      sender: currentUser,\n      time: getCurrentTime()\n    };\n    messages.push(newMessage);\n    saveMessages(selectedChatId, messages);\n    localStorage.setItem(\"lastMessage_\".concat(selectedChatId), JSON.stringify(newMessage));\n    input.value = '';\n    displayMessages();\n    setTimeout(function () {\n      sendAutoReply();\n    }, 1000 + Math.random() * 1000);\n  }\n}\nwindow.addEventListener('load', displayMessages);\nfunction sendAutoReply() {\n  var replies = [\"Привет!\", \"Как дела?\", \"Что нового?\", \"Хорошо, спасибо!\"];\n  var randomReply = replies[Math.floor(Math.random() * replies.length)];\n  var messages = getMessages()[selectedChatId] || [];\n  var replyMessage = {\n    text: randomReply,\n    sender: otherUser,\n    time: getCurrentTime()\n  };\n  messages.push(replyMessage);\n  saveMessages(selectedChatId, messages);\n  localStorage.setItem(\"lastMessage_\".concat(selectedChatId), JSON.stringify(replyMessage));\n  displayMessages();\n}\nfunction scrollToBottom() {\n  message.scrollTop = message.scrollHeight;\n}\nvar chatImageUrl = localStorage.getItem(\"chatImage_\".concat(selectedChatId));\nvar chatImageElement = document.querySelector('.chat__avatar');\nif (chatImageElement) {\n  chatImageElement.src = chatImageUrl;\n}\n\n//# sourceURL=webpack:///./js/chat.js?");

/***/ })

/******/ });