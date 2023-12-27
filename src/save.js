const { useBlockProps } = wp.blockEditor;
import { __ } from '@wordpress/i18n';

const MyWooCommerceBlockSave = ({ attributes }) => {
  const { products, selectedCategory, filter, showAllProducts } = attributes;

  // Utiliza la misma lógica de filtrado
  const filteredProducts = filter && selectedCategory
    ? products.filter(product => 
        product.categories && 
        product.categories.some(category => category.id === parseInt(selectedCategory, 10))
      )
    : products;

  // Mostrar todos los productos o solo 10 según la opción seleccionada
  const displayedProducts = showAllProducts ? filteredProducts : filteredProducts.slice(0, 10);

    return (
      <div {...useBlockProps.save()}>
        <div id="success-alert" style="display: none; background-color: #28a745; color: white;">
        ✓ Se añadió tu producto correctamente
        </div>
        <div id="error-alert" style="display: none; background-color: red; color: white;">
          X Error
        </div>
        <div className="grid-container">
        {displayedProducts.map((product) => (
            <div key={product.id} className="product-item" data-product-id={product.id}>
              <div className="image-container">
                {product.add_to_cart && product.add_to_cart.maximum && product.add_to_cart.maximum < 10 && (
                  <div className="stock-alert">{__('Pocas existencias', 'tu-texto-localizacion')}</div>
                )}
                {product.isNew && (
                  <div className="new-label">{__('Nuevo', 'tu-texto-localizacion')}</div>
                )}
                {product.prices.sale_price !== product.prices.regular_price && (
                  <div>
                    <div className="offer-box">{__('Oferta', 'tu-texto-localizacion')}</div>
                    <div className="discount-box">{`-${Math.round(((product.prices.regular_price - product.prices.sale_price) / product.prices.regular_price) * 100)}%`}</div>
                  </div>
                )}
                <a href={product.permalink} target="_blank" rel="noopener noreferrer">
                  <img
                    className='img-size'
                    src={product.images[0].src}
                    data-original-src={product.images[0].src}
                    data-hover-src={product.images[1].src}
                    alt={product.name}
                  />
                </a>
              </div>
              <div className="attribute-category">
               <span>{product.attributeName}</span>
               {product.categoryName && <span> - </span>}
               {product.categoryName && <span className="categoria">{product.categoryName}</span>}
              </div>
              <div className='name-buytiti'>{product.name}</div>
              <div className="sku">SKU: {product.sku}</div>
              {product.prices.sale_price !== product.prices.regular_price ? (
              <div className='container-price'>
                <div className="regular-price">
                  <del>{product.prices.currency_prefix}{(product.prices.regular_price / 100).toFixed(2)}</del>
                </div>
                <div className="sale-price">
                  {product.prices.currency_prefix}{(product.prices.sale_price / 100).toFixed(2)}
                </div>
              </div>
              ) : (
               <div className="price">{product.prices.currency_prefix}{(product.prices.regular_price / 100).toFixed(2)}</div>
              )}
              <div className="quantity-container">
                <label htmlFor={`quantity-${product.id}`}>{__('', 'tu-texto-localizacion')}</label>
                <div className="quantity-input-container">
                  <input className='number-input'
                    type="number"
                    id={`quantity-${product.id}`}
                    name={`quantity-${product.id}`}
                    min="1"
                    value="1"
                  />
                  <button className='btn-addtocart'>
                    {__('Añadir al carrito', 'tu-texto-localizacion')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
    
};

export default MyWooCommerceBlockSave;