/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/edit.js":
/*!*********************!*\
  !*** ./src/edit.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);





const MyWooCommerceBlock = ({
  attributes,
  setAttributes
}) => {
  const {
    products = [],
    categories
  } = attributes;
  const [selectedCategory, setSelectedCategory] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [filter, setFilter] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [loading, setLoading] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const fetchWooCommerceProducts = async () => {
      try {
        const response = await fetch('http://localhost/wordpress/wp-json/wc/store/products');
        if (!response.ok) {
          throw new Error(`Error en la solicitud: ${response.statusText}`);
        }
        const data = await response.json();
        setAttributes({
          products: data.slice(0, 10)
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching WooCommerce products:', error.message);
        setLoading(false);
      }
    };
    const fetchWooCommerceCategories = async () => {
      try {
        const response = await fetch('http://localhost/wordpress/wp-json/wc/store/products/categories');
        if (!response.ok) {
          throw new Error(`Error en la solicitud: ${response.statusText}`);
        }
        const data = await response.json();
        setAttributes({
          categories: data
        });
      } catch (error) {
        console.error('Error fetching WooCommerce categories:', error.message);
      }
    };
    fetchWooCommerceProducts();
    fetchWooCommerceCategories();
  }, [setAttributes]);
  const handleCategoryChange = value => {
    setSelectedCategory(value);
  };
  const handleFilterClick = () => {
    setFilter(true);
  };
  const handleResetFilter = () => {
    setFilter(false);
    setSelectedCategory('');
  };
  const handleAddToCart = async productId => {
    try {
      const response = await fetch(`http://localhost/wordpress/carrito/?add-to-cart=${productId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa('ck_3ad4373504dc9d319abe572a905dbf53f4cc65eb' + ':' + 'cs_24cafca407a9a8318a8b85cec0e4b6e9d921bc71')
        },
        body: JSON.stringify({
          product_id: productId,
          quantity: 1
        })
      });
      if (!response.ok) {
        throw new Error(`Error al añadir el producto al carrito: ${response.statusText}`);
      }
      console.log(`Producto agregado al carrito: ${productId}`);
    } catch (error) {
      console.error('Error al añadir el producto al carrito:', error.message);
    }
  };
  const filteredProducts = filter && selectedCategory ? products.filter(product => product.categories && product.categories.some(category => category.id === Number(selectedCategory))) : products;
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    ...(0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps)()
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InspectorControls, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Filtro de categoría', 'tu-texto-localizacion')
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Selecciona una categoría', 'tu-texto-localizacion'),
    value: selectedCategory,
    options: [{
      label: 'Ninguna',
      value: ''
    }, ...categories.map(category => ({
      label: category.name,
      value: category.id
    }))],
    onChange: handleCategoryChange
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
    isPrimary: true,
    onClick: handleFilterClick
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Filtrar', 'tu-texto-localizacion')), filter && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
    onClick: handleResetFilter
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Limpiar filtro', 'tu-texto-localizacion')))), loading ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Cargando productos...', 'tu-texto-localizacion')) : (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "grid-container"
  }, filteredProducts.map(product => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    key: product.id,
    className: "product-item"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "image-container"
  }, product.prices.sale_price && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "offer-box"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Oferta', 'tu-texto-localizacion')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "discount-box"
  }, `-${Math.round((product.prices.regular_price - product.prices.sale_price) / product.prices.regular_price * 100)}%`), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
    href: product.permalink,
    target: "_blank",
    rel: "noopener noreferrer"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
    className: "img-size",
    src: product.images[0].src,
    alt: product.name,
    onMouseOver: e => {
      e.currentTarget.src = product.images[1].src;
    },
    onMouseOut: e => {
      e.currentTarget.src = product.images[0].src;
    }
  }))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "name-buytiti"
  }, product.name), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "sku"
  }, "SKU: ", product.sku), product.prices.sale_price ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "container-price"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "regular-price"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("del", null, product.prices.currency_prefix, (product.prices.regular_price / 100).toFixed(2))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "sale-price"
  }, product.prices.currency_prefix, (product.prices.sale_price / 100).toFixed(2))) : (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "price"
  }, product.prices.currency_prefix, (product.prices.price / 100).toFixed(2)), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
    className: "btn-addtocart",
    isPrimary: true,
    onClick: () => handleAddToCart(product.id)
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Añadir al carrito', 'tu-texto-localizacion')))))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MyWooCommerceBlock);

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./style.scss */ "./src/style.scss");
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./edit */ "./src/edit.js");
/* harmony import */ var _save__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./save */ "./src/save.js");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./block.json */ "./src/block.json");
/**
 * Registers a new block provided a unique name and an object defining its behavior.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */


/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * All files containing `style` keyword are bundled together. The code used
 * gets applied both to the front of your site and to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */


/**
 * Internal dependencies
 */




/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_4__.name, {
  /**
   * @see ./edit.js
   */
  edit: _edit__WEBPACK_IMPORTED_MODULE_2__["default"],
  /**
   * @see ./save.js
   */
  save: _save__WEBPACK_IMPORTED_MODULE_3__["default"]
});

/***/ }),

/***/ "./src/save.js":
/*!*********************!*\
  !*** ./src/save.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);

const {
  useBlockProps
} = wp.blockEditor;

const MyWooCommerceBlockSave = ({
  attributes
}) => {
  const {
    products
  } = attributes;
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    ...useBlockProps.save()
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "grid-container"
  }, products.map(product => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    key: product.id,
    className: "product-item",
    "data-product-id": product.id
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "image-container"
  }, product.prices.sale_price && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "offer-box"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Oferta', 'tu-texto-localizacion')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "discount-box"
  }, `-${Math.round((product.prices.regular_price - product.prices.sale_price) / product.prices.regular_price * 100)}%`), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
    href: product.permalink,
    target: "_blank",
    rel: "noopener noreferrer"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
    class: "img-size",
    src: product.images[0].src,
    "data-original-src": product.images[0].src,
    "data-hover-src": product.images[1].src,
    alt: product.name
  }))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "name-buytiti"
  }, product.name), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "sku"
  }, "SKU: ", product.sku), product.prices.sale_price ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "container-price"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "regular-price"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("del", null, product.prices.currency_prefix, (product.prices.regular_price / 100).toFixed(2))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "sale-price"
  }, product.prices.currency_prefix, (product.prices.sale_price / 100).toFixed(2))) : (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "price"
  }, product.prices.currency_prefix, (product.prices.price / 100).toFixed(2)), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    className: "btn-addtocart"
  }, "A\xF1adir al carrito"))))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MyWooCommerceBlockSave);

/***/ }),

/***/ "./src/style.scss":
/*!************************!*\
  !*** ./src/style.scss ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ ((module) => {

module.exports = window["React"];

/***/ }),

/***/ "@wordpress/block-editor":
/*!*************************************!*\
  !*** external ["wp","blockEditor"] ***!
  \*************************************/
/***/ ((module) => {

module.exports = window["wp"]["blockEditor"];

/***/ }),

/***/ "@wordpress/blocks":
/*!********************************!*\
  !*** external ["wp","blocks"] ***!
  \********************************/
/***/ ((module) => {

module.exports = window["wp"]["blocks"];

/***/ }),

/***/ "@wordpress/components":
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
/***/ ((module) => {

module.exports = window["wp"]["components"];

/***/ }),

/***/ "@wordpress/i18n":
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
/***/ ((module) => {

module.exports = window["wp"]["i18n"];

/***/ }),

/***/ "./src/block.json":
/*!************************!*\
  !*** ./src/block.json ***!
  \************************/
/***/ ((module) => {

module.exports = JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"buytiti/buytitiwoocommerce","version":"0.1.0","title":"Buytiti - WooCommerce","category":"widgets","icon":"store","description":"Este plugin añade la estructura para traer los productos activos de woocommerce","example":{},"supports":{"html":false},"textdomain":"buytitiwoocommerce","editorScript":"file:./index.js","editorStyle":"file:./index.css","style":"file:./style-index.css","viewScript":"file:./view.js","attributes":{"products":{"type":"array","default":[]},"categories":{"type":"array","default":[]},"selectedCategory":{"type":"string","default":""},"filter":{"type":"boolean","default":false}}}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"index": 0,
/******/ 			"./style-index": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = globalThis["webpackChunkbuytitiwoocommerce"] = globalThis["webpackChunkbuytitiwoocommerce"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["./style-index"], () => (__webpack_require__("./src/index.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=index.js.map