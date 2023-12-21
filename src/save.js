const { useBlockProps } = wp.blockEditor;
import { __ } from '@wordpress/i18n';

const MyWooCommerceBlockSave = ({ attributes }) => {
  const { products } = attributes;

  return (
    <div {...useBlockProps.save()}>
      <div className="grid-container">
        {products.map((product) => (
          <div key={product.id} className="product-item" data-product-id={product.id}>
            <div className="image-container">
              {product.prices.sale_price && <div className="offer-box">{__('Oferta', 'tu-texto-localizacion')}</div>}
              {product.prices.sale_price ? (
                <>
                  <div className="discount-box">{`-${Math.round(((product.prices.regular_price - product.prices.sale_price) / product.prices.regular_price) * 100)}%`}</div>
                  <a href={product.permalink} target="_blank" rel="noopener noreferrer">
                    <img
                      className='img-size'
                      src={product.images[0].src}
                      data-original-src={product.images[0].src}
                      data-hover-src={product.images[1].src}
                      alt={product.name}
                    />
                  </a>
                </>
              ) : (
                <a href={product.permalink} target="_blank" rel="noopener noreferrer">
                  <img
                    className='img-size'
                    src={product.images[0].src}
                    alt={product.name}
                  />
                </a>
              )}
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