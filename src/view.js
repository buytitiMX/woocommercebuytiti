document.addEventListener('DOMContentLoaded', (event) => {
    const addToCartButtons = document.querySelectorAll('.product-item button');

    addToCartButtons.forEach((button) => {
        button.addEventListener('click', async (event) => {
            const productId = event.target.parentElement.getAttribute('data-product-id');

            try {
                const response = await fetch(`http://localhost/wordpress/carrito/?add-to-cart=${productId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Basic ' + btoa('ck_3ad4373504dc9d319abe572a905dbf53f4cc65eb' + ':' + 'cs_24cafca407a9a8318a8b85cec0e4b6e9d921bc71'),
                    },
                    body: JSON.stringify({
                        product_id: productId,
                        quantity: 1,
                    }),
                });

                if (!response.ok) {
                    throw new Error(`Error al añadir el producto al carrito: ${response.statusText}`);
                }

                console.log(`Producto agregado al carrito: ${productId}`);
            } catch (error) {
                console.error('Error al añadir el producto al carrito:', error.message);
            }
        });
    });

    const imageContainers = document.querySelectorAll('.product-item .image-container');

  imageContainers.forEach((container) => {
    const img = container.querySelector('img');

    img.addEventListener('mouseover', () => {
      img.src = img.dataset.hoverSrc;
    });

    img.addEventListener('mouseout', () => {
      img.src = img.dataset.originalSrc;
    });
  });
});


