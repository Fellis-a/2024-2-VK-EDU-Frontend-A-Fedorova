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
/******/ 	return __webpack_require__(__webpack_require__.s = "./js/chats.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./css/chats.css":
/*!***********************!*\
  !*** ./css/chats.css ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// extracted by mini-css-extract-plugin\n\n//# sourceURL=webpack:///./css/chats.css?");

/***/ }),

/***/ "./js/chats.js":
/*!*********************!*\
  !*** ./js/chats.js ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _css_chats_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../css/chats.css */ \"./css/chats.css\");\n/* harmony import */ var _css_chats_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_css_chats_css__WEBPACK_IMPORTED_MODULE_0__);\n\ndocument.querySelectorAll('.chat__item').forEach(function (chat, index) {\n  var chatId = JSON.parse(localStorage.getItem('chats'))[index].chatId;\n  var lastMessage = localStorage.getItem(\"lastMessage_\".concat(chatId));\n  var lastMessageElement = chat.querySelector('.chat__last-message');\n  lastMessageElement.textContent = lastMessage ? JSON.parse(lastMessage).text : 'Начните переписку прямо сейчас!';\n  chat.addEventListener('click', function () {\n    var _chatImages$find;\n    var name = chat.querySelector('.chat__title').textContent;\n    localStorage.setItem('selectedChatId', chatId);\n    localStorage.setItem('name', name);\n    var imageUrl = ((_chatImages$find = chatImages.find(function (c) {\n      return c.chatId === chatId;\n    })) === null || _chatImages$find === void 0 ? void 0 : _chatImages$find.imageUrl) || 'https://cs13.pikabu.ru/post_img/2023/10/28/2/1698456437194820220.jpg';\n    localStorage.setItem(\"chatImage_\".concat(chatId), imageUrl);\n  });\n});\n\n// функция для генерации уникального идентификатора чата\nfunction generateUniqueChatId() {\n  var chats = JSON.parse(localStorage.getItem('chats')) || [];\n  var chatId;\n  do {\n    chatId = Math.floor(Math.random() * 1000000);\n  } while (chats.some(function (chat) {\n    return chat.chatId === chatId;\n  }));\n  return chatId;\n}\nfunction isValidURL(url) {\n  try {\n    // Если URL некорректен, будет выброшена ошибка\n    new URL(url);\n    return true;\n  } catch (_) {\n    return false;\n  }\n}\ndocument.getElementById('createChatButton').addEventListener('click', function () {\n  var chatId = generateUniqueChatId();\n  var chatName = prompt('Введите имя собеседника:', 'Новый Чат');\n  var chatImage = prompt('Введите URL картинки собеседника или просто нажмите ок:', 'https://cs13.pikabu.ru/post_img/2023/10/28/2/1698456437194820220.jpg');\n  if (!isValidURL(chatImage)) {\n    alert('Введённый URL некорректен. Будет использована картинка по умолчанию.');\n    chatImage = 'https://cs13.pikabu.ru/post_img/2023/10/28/2/1698456437194820220.jpg';\n  }\n  if (chatName) {\n    var newChat = {\n      chatId: chatId,\n      name: chatName,\n      imageUrl: chatImage || 'https://cs13.pikabu.ru/post_img/2023/10/28/2/1698456437194820220.jpg',\n      lastMessage: 'Начните переписку прямо сейчас!'\n    };\n    var chats = JSON.parse(localStorage.getItem('chats')) || [];\n    chats.push(newChat);\n    localStorage.setItem('chats', JSON.stringify(chats));\n    var initialMessage = {\n      text: 'Начните переписку прямо сейчас!'\n    };\n    localStorage.setItem(\"lastMessage_\".concat(chatId), JSON.stringify(initialMessage));\n    displayChats();\n  } else {\n    alert('Чат не был создан. Имя собеседника не указано.');\n  }\n});\nfunction displayChats() {\n  var chatsContainer = document.querySelector('.chat');\n  var chats = JSON.parse(localStorage.getItem('chats')) || [];\n  chatsContainer.innerHTML = '';\n  chats.forEach(function (chat) {\n    var _JSON$parse, _JSON$parse2;\n    var chatElement = document.createElement('a');\n    chatElement.classList.add('chat__item');\n    chatElement.href = \"chat.html?chat_id=\".concat(chat.chatId);\n    var lastMessage = ((_JSON$parse = JSON.parse(localStorage.getItem(\"lastMessage_\".concat(chat.chatId)))) === null || _JSON$parse === void 0 ? void 0 : _JSON$parse.text) || 'Начните переписку прямо сейчас!';\n    var lastMessageTime = ((_JSON$parse2 = JSON.parse(localStorage.getItem(\"lastMessage_\".concat(chat.chatId)))) === null || _JSON$parse2 === void 0 ? void 0 : _JSON$parse2.time) || 'Недавно';\n    var chatImage = chat.imageUrl || 'https://cs13.pikabu.ru/post_img/2023/10/28/2/1698456437194820220.jpg';\n    chatElement.innerHTML = \"\\n        <img class=\\\"chat__avatar\\\"\\n                src=\\\"\".concat(encodeURI(chatImage), \"\\\"\\n                alt=\\\"Avatar\\\">\\n            <div class=\\\"chat__details\\\">\\n                <div class=\\\"chat__info\\\">\\n                    <h2 class=\\\"chat__title\\\">\").concat(chat.name, \"</h2>\\n                    <div>\\n                        <span class=\\\"chat__time\\\">\").concat(lastMessageTime, \"</span>\\n                        <i class=\\\"chat__status material-icons\\\">done_all</i>\\n                    </div>\\n                </div>\\n                <div>\\n                    <p class=\\\"chat__last-message\\\">\").concat(lastMessage, \"</p>\\n                </div>\\n            </div>\\n        \");\n    chatElement.addEventListener('click', function () {\n      localStorage.setItem('selectedChatId', chat.chatId);\n      localStorage.setItem('name', chat.name);\n      localStorage.setItem(\"chatImage_\".concat(chat.chatId), chatImage);\n    });\n    chatsContainer.appendChild(chatElement);\n  });\n}\nwindow.addEventListener('load', displayChats);\n\n//# sourceURL=webpack:///./js/chats.js?");

/***/ })

/******/ });