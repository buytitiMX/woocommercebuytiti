const { useBlockProps } = wp.blockEditor;
import { __ } from '@wordpress/i18n';

const MyWooCommerceBlockSave = ({ attributes }) => {
  const { products } = attributes;

  return (
    <div {...useBlockProps.save()}>
      <div>
        <div className="grid-container">
          {products.map((product) => (
            <div key={product.id} className="product-item" data-product-id={product.id}>
              <div className="image-container">
                {product.prices.sale_price && (
                  <div className="offer-box">{__('Oferta', 'tu-texto-localizacion')}</div>
                )}
                <div className="discount-box">{`-${Math.round(((product.prices.regular_price - product.prices.sale_price) / product.prices.regular_price) * 100)}%`}</div>
                <a href={product.permalink} target="_blank" rel="noopener noreferrer">
                <img
  class='img-size'
  src={product.images[0].src}
  data-original-src={product.images[0].src}
  data-hover-src={product.images[1].src}
  alt={product.name}
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
              <button className='btn-addtocart'>
                Añadir al carrito
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyWooCommerceBlockSave;