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
    categories,
    selectedCategory,
    filter
  } = attributes;
  const [loading, setLoading] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
  const [showAllProducts, setShowAllProducts] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);

  // Función para manejar el cambio en la opción de cantidad de productos
  const handleShowAllProductsChange = newValue => {
    setShowAllProducts(newValue);
    // Aquí actualizamos solo el atributo showAllProducts
    setAttributes({
      ...attributes,
      showAllProducts: newValue
    });
  };
  const filterProducts = () => {
    if (selectedCategory) {
      return products.filter(product => product.categories && product.categories.some(category => category.id === parseInt(selectedCategory, 10)));
    }
    return products;
  };
  const filteredProducts = filterProducts();

  // Mostrar todos los productos o solo 10 según la opción seleccionada
  const displayedProducts = showAllProducts ? filteredProducts : filteredProducts.slice(0, 10);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const fetchWooCommerceProducts = async () => {
      try {
        let allProducts = [];
        for (let page = 1; page <= 20; page++) {
          const response = await fetch(`http://localhost/wordpress/wp-json/wc/store/products?per_page=100&page=${page}`);
          if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.statusText}`);
          }
          const data = await response.json();
          allProducts = [...allProducts, ...data];
        }
        const productsWithIsNew = await Promise.all(allProducts.map(async product => {
          try {
            const productResponse = await fetch(`http://localhost/wordpress/wp-json/wp/v2/product/${product.id}`);
            if (!productResponse.ok) {
              throw new Error(`Error en la solicitud de producto: ${productResponse.statusText}`);
            }
            const productData = await productResponse.json();
            const isNew = isProductNew(productData.date);

            // Add attribute name and category to the product object
            const attributeName = product.attributes[0]?.name || 'Buytiti';
            const categoryName = product.categories[0]?.name;
            return {
              ...product,
              isNew,
              attributeName,
              categoryName
            };
          } catch (error) {
            console.error(`Error al obtener información del producto ${product.id}: ${error.message}`);
            return product;
          }
        }));

        // Filtrar productos nuevos
        const newProducts = productsWithIsNew.filter(product => product.isNew);

        // Ordenar los productos por fecha y hora (de más reciente a más antiguo)
        const sortedProducts = productsWithIsNew.sort((a, b) => {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          return dateB - dateA;
        });
        setAttributes({
          products: sortedProducts
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching WooCommerce products:", error.message);
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
    setAttributes({
      selectedCategory: value
    });
  };
  const handleFilterClick = () => {
    setAttributes({
      filter: true
    });
  };
  const handleResetFilter = () => {
    setAttributes({
      filter: false,
      selectedCategory: ''
    });
  };
  const isProductNew = productDate => {
    const SEVEN_DAYS_IN_MS = 7 * 24 * 60 * 60 * 1000;
    const productTimestamp = new Date(productDate).getTime();
    const currentTimestamp = new Date().getTime();
    return currentTimestamp - productTimestamp < SEVEN_DAYS_IN_MS;
  };
  const [showAlert, setShowAlert] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [errorAlert, setErrorAlert] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const handleAddToCart = async productId => {
    const quantityInput = document.getElementById(`quantity-${productId}`);
    const quantity = quantityInput ? parseInt(quantityInput.value, 10) : 1;
    try {
      // Obtener el producto actual
      const product = filteredProducts.find(p => p.id === productId);

      // Verificar si la cantidad seleccionada supera el stock máximo
      if (product.add_to_cart && product.add_to_cart.maximum && quantity > product.add_to_cart.maximum) {
        setErrorAlert(`Error: Este artículo tiene solo ${product.add_to_cart.maximum} unidades en stock.`);
        setTimeout(() => {
          setErrorAlert(false);
        }, 4000);
        return;
      }
      const response = await fetch(`http://localhost/wordpress/carrito/?add-to-cart=${productId}&quantity=${quantity}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + btoa("ck_3ad4373504dc9d319abe572a905dbf53f4cc65eb" + ":" + "cs_24cafca407a9a8318a8b85cec0e4b6e9d921bc71")
        },
        body: JSON.stringify({
          product_id: productId,
          quantity: quantity
        })
      });
      if (!response.ok) {
        throw new Error(`Error al añadir el producto al carrito: ${response.statusText}`);
      }
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 5000);
      console.log(`Producto agregado al carrito: ${productId}`);
    } catch (error) {
      console.error("Error al añadir el producto al carrito:", error.message);
      setErrorAlert(`Error: ${error.message}`);
      setTimeout(() => {
        setErrorAlert(false);
      }, 5000);
    }
  };
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    ...(0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps)()
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InspectorControls, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Filtro de categoría", "tu-texto-localizacion")
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Selecciona una categoría", "tu-texto-localizacion"),
    value: selectedCategory,
    options: [{
      label: "Ninguna",
      value: ""
    }, ...categories.map(category => ({
      label: category.name,
      value: category.id
    }))],
    onChange: handleCategoryChange
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
    isPrimary: true,
    onClick: handleFilterClick
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Filtrar", "tu-texto-localizacion")), filter && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
    onClick: handleResetFilter
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Limpiar filtro", "tu-texto-localizacion"))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.RadioControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Cantidad de productos", "tu-texto-localizacion"),
    selected: showAllProducts ? "all" : "10",
    options: [{
      label: "10",
      value: "10"
    }, {
      label: "Todos",
      value: "all"
    }],
    onChange: value => handleShowAllProductsChange(value === "all")
  })), loading ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Cargando productos...", "tu-texto-localizacion")) : (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, showAlert && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "alert",
    style: {
      backgroundColor: "#FF7942",
      color: "white"
    }
  }, "Se a\xF1adi\xF3 tu producto correctamente"), errorAlert && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "alert",
    style: {
      backgroundColor: "#FF0000",
      color: "white"
    }
  }, errorAlert), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "grid-container"
  }, displayedProducts.map(product => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    key: product.id,
    className: "product-item",
    "data-product-id": product.id
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "image-container"
  }, product.add_to_cart && product.add_to_cart.maximum && product.add_to_cart.maximum < 10 && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "stock-alert"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Pocas existencias", "tu-texto-localizacion")), product.isNew && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "new-label"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Nuevo", "tu-texto-localizacion")), product.prices.sale_price !== product.prices.regular_price && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "offer-box"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Oferta", "tu-texto-localizacion")), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "discount-box"
  }, `-${Math.round((product.prices.regular_price - product.prices.sale_price) / product.prices.regular_price * 100)}%`)), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
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
  })), product.add_to_cart && product.add_to_cart.maximum && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "stock-info"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Disponibles", "tu-texto-localizacion"), ":", " ", product.add_to_cart.maximum)), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "attribute-category"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", null, product.attributeName), product.categoryName && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", null, " - "), product.categoryName && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "categoria"
  }, product.categoryName)), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "name-buytiti"
  }, product.name), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "sku"
  }, "SKU: ", product.sku), product.prices.sale_price !== product.prices.regular_price ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "container-price"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "regular-price"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("del", null, product.prices.currency_prefix, (product.prices.regular_price / 100).toFixed(2))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "sale-price"
  }, product.prices.currency_prefix, (product.prices.sale_price / 100).toFixed(2))) : (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "price"
  }, product.prices.currency_prefix, (product.prices.regular_price / 100).toFixed(2)), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "quantity-container"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
    htmlFor: `quantity-${product.id}`
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("", "tu-texto-localizacion")), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "quantity-input-container"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    className: "number-input",
    type: "number",
    id: `quantity-${product.id}`,
    name: `quantity-${product.id}`,
    min: "1",
    defaultValue: "1"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
    className: "btn-addtocart",
    isPrimary: true,
    onClick: () => handleAddToCart(product.id)
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Añadir al carrito", "tu-texto-localizacion")))))))));
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
    products,
    selectedCategory,
    filter,
    showAllProducts
  } = attributes;
  const filterProducts = () => {
    if (selectedCategory) {
      return products.filter(product => product.categories && product.categories.some(category => category.id === parseInt(selectedCategory, 10)));
    }
    return products;
  };
  const filteredProducts = filterProducts();

  // Mostrar todos los productos o solo 10 según la opción seleccionada
  const displayedProducts = showAllProducts ? filteredProducts : filteredProducts.slice(0, 10);
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    ...useBlockProps.save()
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    id: "success-alert",
    style: "display: none; background-color: #28a745; color: white;"
  }, "\u2713 Se a\xF1adi\xF3 tu producto correctamente"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    id: "error-alert",
    style: "display: none; background-color: red; color: white;"
  }, "X Error"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "grid-container"
  }, displayedProducts.map(product => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    key: product.id,
    className: "product-item",
    "data-product-id": product.id
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "image-container"
  }, product.add_to_cart && product.add_to_cart.maximum && product.add_to_cart.maximum < 10 && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "stock-alert"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Pocas existencias", "tu-texto-localizacion")), product.isNew && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "new-label"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Nuevo", "tu-texto-localizacion")), product.prices.sale_price !== product.prices.regular_price && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "offer-box"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Oferta", "tu-texto-localizacion")), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "discount-box"
  }, `-${Math.round((product.prices.regular_price - product.prices.sale_price) / product.prices.regular_price * 100)}%`)), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
    href: product.permalink,
    target: "_blank",
    rel: "noopener noreferrer"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
    className: "img-size",
    src: product.images[0].src,
    "data-original-src": product.images[0].src,
    "data-hover-src": product.images[1].src,
    alt: product.name
  })), product.add_to_cart && product.add_to_cart.maximum && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "stock-info"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Disponibles", "tu-texto-localizacion"), ":", " ", product.add_to_cart.maximum)), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "attribute-category"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", null, product.attributeName), product.categoryName && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", null, " - "), product.categoryName && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "categoria"
  }, product.categoryName)), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "name-buytiti"
  }, product.name), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "sku"
  }, "SKU: ", product.sku), product.prices.sale_price !== product.prices.regular_price ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "container-price"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "regular-price"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("del", null, product.prices.currency_prefix, (product.prices.regular_price / 100).toFixed(2))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "sale-price"
  }, product.prices.currency_prefix, (product.prices.sale_price / 100).toFixed(2))) : (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "price"
  }, product.prices.currency_prefix, (product.prices.regular_price / 100).toFixed(2)), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "quantity-container"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
    htmlFor: `quantity-${product.id}`
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("", "tu-texto-localizacion")), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "quantity-input-container"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    className: "number-input",
    type: "number",
    id: `quantity-${product.id}`,
    name: `quantity-${product.id}`,
    min: "1",
    value: "1"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    className: "btn-addtocart"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Añadir al carrito", "tu-texto-localizacion"))))))));
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

module.exports = JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"buytiti/buytitiwoocommerce","version":"0.1.0","title":"Buytiti - WooCommerce","category":"widgets","icon":"store","description":"Este plugin añade la estructura para traer los productos activos de woocommerce","example":{},"supports":{"html":false},"textdomain":"buytitiwoocommerce","editorScript":"file:./index.js","editorStyle":"file:./index.css","style":"file:./style-index.css","viewScript":"file:./view.js","attributes":{"products":{"type":"array","default":[]},"categories":{"type":"array","default":[]},"selectedCategory":{"type":"string","default":""},"filter":{"type":"boolean","default":false},"showAllProducts":{"type":"boolean","default":false}}}');

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