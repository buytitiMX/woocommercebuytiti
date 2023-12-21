import { useEffect, useState } from 'react';
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl, Button } from '@wordpress/components';

const MyWooCommerceBlock = ({ attributes, setAttributes }) => {
  const { products = [], categories } = attributes;
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filter, setFilter] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWooCommerceProducts = async () => {
      try {
        const response = await fetch('http://localhost/wordpress/wp-json/wc/store/products');

        if (!response.ok) {
          throw new Error(`Error en la solicitud: ${response.statusText}`);
        }

        const data = await response.json();
        setAttributes({ products: data.slice(0, 10) });
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
        setAttributes({ categories: data });
      } catch (error) {
        console.error('Error fetching WooCommerce categories:', error.message);
      }
    };

    fetchWooCommerceProducts();
    fetchWooCommerceCategories();
  }, [setAttributes]);

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
  };

  const handleFilterClick = () => {
    setFilter(true);
  };

  const handleResetFilter = () => {
    setFilter(false);
    setSelectedCategory('');
  };

  const handleAddToCart = async (productId) => {
    const quantityInput = document.getElementById(`quantity-${productId}`);
    const quantity = quantityInput ? parseInt(quantityInput.value, 10) : 1;

    try {
      const response = await fetch(`http://localhost/wordpress/carrito/?add-to-cart=${productId}&quantity=${quantity}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa('ck_3ad4373504dc9d319abe572a905dbf53f4cc65eb' + ':' + 'cs_24cafca407a9a8318a8b85cec0e4b6e9d921bc71'),
        },
        body: JSON.stringify({
          product_id: productId,
          quantity: quantity,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error al añadir el producto al carrito: ${response.statusText}`);
      }

      console.log(`Producto agregado al carrito: ${productId}`);
    } catch (error) {
      console.error('Error al añadir el producto al carrito:', error.message);
    }
  };
  
  const filteredProducts = filter && selectedCategory
    ? products.filter(product => 
        product.categories && 
        product.categories.some(category => category.id === Number(selectedCategory))
      )
    : products;

  return (
    <div {...useBlockProps()}>
      <InspectorControls>
        <PanelBody title={__('Filtro de categoría', 'tu-texto-localizacion')}>
          <SelectControl
            label={__('Selecciona una categoría', 'tu-texto-localizacion')}
            value={selectedCategory}
            options={[{ label: 'Ninguna', value: '' }, ...categories.map(category => ({ label: category.name, value: category.id }))]}
            onChange={handleCategoryChange}
          />
          <Button isPrimary onClick={handleFilterClick}>
            {__('Filtrar', 'tu-texto-localizacion')}
          </Button>
          {filter && (
            <Button onClick={handleResetFilter}>
              {__('Limpiar filtro', 'tu-texto-localizacion')}
            </Button>
          )}
        </PanelBody>
      </InspectorControls>
      {loading ? (
        <p>{__('Cargando productos...', 'tu-texto-localizacion')}</p>
      ) : (
        <div>
          <div className="grid-container">
            {filteredProducts.map((product) => (
              <div key={product.id} className="product-item" data-product-id={product.id}>
                <div className="image-container">
                  {product.prices.sale_price && (
                    <div className="offer-box">{__('Oferta', 'tu-texto-localizacion')}</div>
                  )}
                  <div className="discount-box">{`-${Math.round(((product.prices.regular_price - product.prices.sale_price) / product.prices.regular_price) * 100)}%`}</div>
                  <a href={product.permalink} target="_blank" rel="noopener noreferrer">
                    <img
                      className='img-size'
                      src={product.images[0].src}
                      alt={product.name}
                      onMouseOver={(e) => { e.currentTarget.src = product.images[1].src }}
                      onMouseOut={(e) => { e.currentTarget.src = product.images[0].src }}
                    />
                  </a>
                </div>
                <div className='name-buytiti'>{product.name}</div>
                <div className="sku">SKU: {product.sku}</div>
                {product.prices.sale_price ? (
                  <div className='container-price'>
                    <div className="regular-price">
                      <del>{product.prices.currency_prefix}{(product.prices.regular_price / 100).toFixed(2)}</del>
                    </div>
                    <div className="sale-price">
                      {product.prices.currency_prefix}{(product.prices.sale_price / 100).toFixed(2)}
                    </div>
                  </div>
                ) : (
                  <div className="price">{product.prices.currency_prefix}{(product.prices.price / 100).toFixed(2)}</div>
                )}
                <div className="quantity-container">
                  <label htmlFor={`quantity-${product.id}`}>{__('', 'tu-texto-localizacion')}</label>
                  <div className="quantity-input-container">
                    <input className='number-input'
                      type="number"
                      id={`quantity-${product.id}`}
                      name={`quantity-${product.id}`}
                      min="1"
                      defaultValue="1"
                    />
                    <Button className='btn-addtocart' isPrimary onClick={() => handleAddToCart(product.id)}>
                      {__('Añadir al carrito', 'tu-texto-localizacion')}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyWooCommerceBlock;
