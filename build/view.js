/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!*********************!*\
  !*** ./src/view.js ***!
  \*********************/
document.addEventListener('DOMContentLoaded', event => {
  const addToCartButtons = document.querySelectorAll('.product-item button');
  addToCartButtons.forEach(button => {
    button.addEventListener('click', async event => {
      const productContainer = event.target.closest('.product-item');
      const productId = productContainer.getAttribute('data-product-id');
      const quantityInput = productContainer.querySelector('input[type="number"]');
      const quantity = quantityInput ? parseInt(quantityInput.value, 10) : 1;
      try {
        // Antes de agregar al carrito, verifica el stock
        const stockResponse = await fetch(`http://localhost/wordpress/wp-json/wc/store/products/${productId}`);
        const stockData = await stockResponse.json();
        if (quantity > stockData.add_to_cart.maximum) {
          throw new Error(`X Error: Este artículo solo tiene ${stockData.add_to_cart.maximum} unidades en stock`);
        }
        const response = await fetch(`http://localhost/wordpress/carrito/?add-to-cart=${productId}&quantity=${quantity}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa('ck_3ad4373504dc9d319abe572a905dbf53f4cc65eb' + ':' + 'cs_24cafca407a9a8318a8b85cec0e4b6e9d921bc71')
          },
          body: JSON.stringify({
            product_id: productId,
            quantity: quantity
          })
        });
        if (!response.ok) {
          throw new Error(`X Error al añadir el producto al carrito: ${response.statusText}`);
        }

        // Muestra la alerta de éxito
        const successAlert = document.getElementById('success-alert');
        successAlert.textContent = '✓ Se añadió tu producto al carrito correctamente';
        successAlert.style.display = 'flex';
        successAlert.style.height = '2.5rem';
        successAlert.style.alignItems = 'center';
        successAlert.style.paddingLeft = '1rem';

        // Oculta la alerta después de 4 segundos
        setTimeout(() => {
          successAlert.style.display = 'none';
        }, 4000);
        console.log(`Producto agregado al carrito: ${productId}`);
      } catch (error) {
        console.error('Error al añadir el producto al carrito:', error.message);

        // Muestra la alerta de error
        const errorAlert = document.getElementById('error-alert');
        errorAlert.textContent = error.message;
        errorAlert.style.display = 'flex';
        errorAlert.style.height = '2.5rem';
        errorAlert.style.alignItems = 'center';
        errorAlert.style.paddingLeft = '1rem';

        // Oculta la alerta de error después de 4 segundos
        setTimeout(() => {
          errorAlert.style.display = 'none';
        }, 4000);
      }
    });
  });
  const imageContainers = document.querySelectorAll('.product-item .image-container');
  imageContainers.forEach(container => {
    const img = container.querySelector('img');
    img.addEventListener('mouseover', () => {
      img.src = img.dataset.hoverSrc;
    });
    img.addEventListener('mouseout', () => {
      img.src = img.dataset.originalSrc;
    });
  });
});
/******/ })()
;
//# sourceMappingURL=view.js.map