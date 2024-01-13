import { useEffect, useState } from "react";
import { __ } from "@wordpress/i18n";
import { useBlockProps, InspectorControls } from "@wordpress/block-editor";
import { PanelBody, SelectControl, Button } from "@wordpress/components";
import { RadioControl } from "@wordpress/components";

const MyWooCommerceBlock = ({ attributes, setAttributes }) => {
	const { products = [], categories, selectedCategory, filter } = attributes;
	const [loading, setLoading] = useState(true);
	const [showAllProducts, setShowAllProducts] = useState(false);

	// Función para manejar el cambio en la opción de cantidad de productos
	const handleShowAllProductsChange = (newValue) => {
		setShowAllProducts(newValue);
		// Aquí actualizamos solo el atributo showAllProducts
		setAttributes({ ...attributes, showAllProducts: newValue });
	};

	const filterProducts = () => {
		let filtered = products;

		// Filtrar por categoría si se seleccionó una
		if (selectedCategory) {
			filtered = filtered.filter(
				(product) =>
					product.categories &&
					product.categories.some(
						(category) => category.id === parseInt(selectedCategory, 10),
					),
			);
		}

		// Filtrar por productos en oferta
		if (filter === "on_sale") {
			filtered = filtered.filter(
				(product) => product.prices.sale_price !== product.prices.regular_price,
			);
		}

		return filtered;
	};

	const filteredProducts = filterProducts();

	// Mostrar todos los productos o solo 10 según la opción seleccionada
	const displayedProducts = showAllProducts
		? filteredProducts
		: filteredProducts.slice(0, 10);

	useEffect(() => {
		const fetchWooCommerceProducts = async () => {
			try {
				let allProducts = [];
				for (let page = 1; page <= 20; page++) {
					const response = await fetch(
						`http://localhost/wordpress/wp-json/wc/store/products?per_page=100&page=${page}`,
					);

					if (!response.ok) {
						throw new Error(`Error en la solicitud: ${response.statusText}`);
					}

					const data = await response.json();
					allProducts = [...allProducts, ...data];
				}

				const productsWithIsNew = await Promise.all(
					allProducts.map(async (product) => {
						try {
							const productResponse = await fetch(
								`http://localhost/wordpress/wp-json/wp/v2/product/${product.id}`,
							);
							if (!productResponse.ok) {
								throw new Error(
									`Error en la solicitud de producto: ${productResponse.statusText}`,
								);
							}
							const productData = await productResponse.json();
							const isNew = isProductNew(productData.date);

							// Add attribute name and category to the product object
							const attributeName = product.attributes[0]?.name || "Buytiti";
							const categoryName = product.categories[0]?.name;

							return { ...product, isNew, attributeName, categoryName };
						} catch (error) {
							console.error(
								`Error al obtener información del producto ${product.id}: ${error.message}`,
							);
							return product;
						}
					}),
				);

				// Filtrar productos nuevos
				const newProducts = productsWithIsNew.filter(
					(product) => product.isNew,
				);

				// Ordenar los productos por fecha y hora (de más reciente a más antiguo)
				const sortedProducts = productsWithIsNew.sort((a, b) => {
					const dateA = new Date(a.date).getTime();
					const dateB = new Date(b.date).getTime();
					return dateB - dateA;
				});

				setAttributes({ products: sortedProducts });
				setLoading(false);
			} catch (error) {
				console.error("Error fetching WooCommerce products:", error.message);
				setLoading(false);
			}
		};

		const fetchWooCommerceCategories = async () => {
			try {
				const response = await fetch(
					"http://localhost/wordpress/wp-json/wc/store/products/categories",
				);

				if (!response.ok) {
					throw new Error(`Error en la solicitud: ${response.statusText}`);
				}

				const data = await response.json();
				setAttributes({ categories: data });
			} catch (error) {
				console.error("Error fetching WooCommerce categories:", error.message);
			}
		};

		fetchWooCommerceProducts();
		fetchWooCommerceCategories();
	}, [setAttributes]);

	const handleCategoryChange = (value) => {
		setAttributes({ selectedCategory: value });
	};

	const handleFilterClick = () => {
		setAttributes({ filter: true });
	};

	const handleResetFilter = () => {
		setAttributes({ filter: false, selectedCategory: "" });
	};

	const isProductNew = (productDate) => {
		const SEVEN_DAYS_IN_MS = 7 * 24 * 60 * 60 * 1000;
		const productTimestamp = new Date(productDate).getTime();
		const currentTimestamp = new Date().getTime();
		return currentTimestamp - productTimestamp < SEVEN_DAYS_IN_MS;
	};

	const [showAlert, setShowAlert] = useState(false);
	const [errorAlert, setErrorAlert] = useState(false);

	const handleAddToCart = async (productId) => {
		const quantityInput = document.getElementById(`quantity-${productId}`);
		const quantity = quantityInput ? parseInt(quantityInput.value, 10) : 1;

		try {
			// Obtener el producto actual
			const product = filteredProducts.find((p) => p.id === productId);

			// Verificar si la cantidad seleccionada supera el stock máximo
			if (
				product.add_to_cart &&
				product.add_to_cart.maximum &&
				quantity > product.add_to_cart.maximum
			) {
				setErrorAlert(
					`Error: Este artículo tiene solo ${product.add_to_cart.maximum} unidades en stock.`,
				);
				setTimeout(() => {
					setErrorAlert(false);
				}, 4000);
				return;
			}

			const response = await fetch(
				`/wordpress/carrito/?add-to-cart=${productId}&quantity=${quantity}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization:
							"Basic " +
							btoa(
								"ck_ff9474de189b37a7aa63b4a9ea3279c5685d3749" +
									":" +
									"cs_aaab9f6527fdc3f132bdb2c10516d08e1c4222bd",
							),
					},
					body: JSON.stringify({
						product_id: productId,
						quantity: quantity,
					}),
				},
			);

			if (!response.ok) {
				throw new Error(
					`Error al añadir el producto al carrito: ${response.statusText}`,
				);
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

	return (
		<div {...useBlockProps()}>
			<InspectorControls>
				<PanelBody title={__("Filtro de categoría", "tu-texto-localizacion")}>
					<SelectControl
						label={__("Selecciona una categoría", "tu-texto-localizacion")}
						value={selectedCategory}
						options={[
							{ label: "Ninguna", value: "" },
							...categories.map((category) => ({
								label: category.name,
								value: category.id,
							})),
						]}
						onChange={handleCategoryChange}
					/>
					<SelectControl
						label={__("Selecciona un filtro", "tu-texto-localizacion")}
						value={filter}
						options={[
							{ label: "Ninguno", value: "" },
							{ label: "En oferta", value: "on_sale" },
							...categories.map((category) => ({
								label: category.name,
								value: category.id,
							})),
						]}
						onChange={(value) => setAttributes({ filter: value })}
					/>

					<Button isPrimary onClick={handleFilterClick}>
						{__("Filtrar", "tu-texto-localizacion")}
					</Button>
					{filter && (
						<Button onClick={handleResetFilter}>
							{__("Limpiar filtro", "tu-texto-localizacion")}
						</Button>
					)}
				</PanelBody>
				<RadioControl
					label={__("Cantidad de productos", "tu-texto-localizacion")}
					selected={showAllProducts ? "all" : "10"}
					options={[
						{ label: "10", value: "10" },
						{ label: "Todos", value: "all" },
					]}
					onChange={(value) => handleShowAllProductsChange(value === "all")}
				/>
			</InspectorControls>
			{loading ? (
				<p>{__("Cargando productos...", "tu-texto-localizacion")}</p>
			) : (
				<div>
					{showAlert && (
						<div
							className="alert"
							style={{ backgroundColor: "#FF7942", color: "white" }}
						>
							Se añadió tu producto correctamente
						</div>
					)}
					{errorAlert && (
						<div
							className="alert"
							style={{ backgroundColor: "#FF0000", color: "white" }}
						>
							{errorAlert}
						</div>
					)}
					<div className="grid-container">
						{displayedProducts.map((product) => (
							<div
								key={product.id}
								className="product-item"
								data-product-id={product.id}
							>
								<div className="image-container">
									{product.add_to_cart &&
										product.add_to_cart.maximum &&
										product.add_to_cart.maximum < 10 && (
											<div className="stock-alert">
												{__("Pocas existencias", "tu-texto-localizacion")}
											</div>
										)}
									{product.isNew && (
										<div className="new-label">
											{__("Nuevo", "tu-texto-localizacion")}
										</div>
									)}
									{product.prices.sale_price !==
										product.prices.regular_price && (
										<div>
											<div className="offer-box">
												{__("Oferta", "tu-texto-localizacion")}
											</div>
											<div className="discount-box">{`-${Math.round(
												((product.prices.regular_price -
													product.prices.sale_price) /
													product.prices.regular_price) *
													100,
											)}%`}</div>
										</div>
									)}
									<a
										href={product.permalink}
										target="_blank"
										rel="noopener noreferrer"
									>
										<img
											className="img-size"
											src={product.images[0].src}
											alt={product.name}
											onMouseOver={(e) => {
												e.currentTarget.src = product.images[1].src;
											}}
											onMouseOut={(e) => {
												e.currentTarget.src = product.images[0].src;
											}}
										/>
									</a>
									{product.add_to_cart && product.add_to_cart.maximum && (
										<div className="stock-info">
											{__("Disponibles", "tu-texto-localizacion")}:{" "}
											{product.add_to_cart.maximum}
										</div>
									)}
								</div>
								<div className="attribute-category">
									<span>{product.attributeName}</span>
									{product.categoryName && <span> - </span>}
									{product.categoryName && (
										<span className="categoria">{product.categoryName}</span>
									)}
								</div>
								<div className="name-buytiti">{product.name}</div>
								<div className="sku">SKU: {product.sku}</div>
								{product.prices.sale_price !== product.prices.regular_price ? (
									<div className="container-price">
										<div className="regular-price">
											<del>
												{product.prices.currency_prefix}
												{(product.prices.regular_price / 100).toFixed(2)}
											</del>
										</div>
										<div className="sale-price">
											{product.prices.currency_prefix}
											{(product.prices.sale_price / 100).toFixed(2)}
										</div>
									</div>
								) : (
									<div className="price">
										{product.prices.currency_prefix}
										{(product.prices.regular_price / 100).toFixed(2)}
									</div>
								)}
								<div className="quantity-container">
									<label htmlFor={`quantity-${product.id}`}>
										{__("", "tu-texto-localizacion")}
									</label>
									<div className="quantity-input-container">
										<input
											className="number-input"
											type="number"
											id={`quantity-${product.id}`}
											name={`quantity-${product.id}`}
											min="1"
											max={
												product.add_to_cart
													? product.add_to_cart.maximum
													: undefined
											}
											defaultValue="1"
											onChange={(e) => {
												if (
													product.add_to_cart &&
													product.add_to_cart.maximum
												) {
													if (e.target.value > product.add_to_cart.maximum) {
														e.target.value = product.add_to_cart.maximum;
													}
												}
											}}
										/>
										<Button
											className="btn-addtocart"
											isPrimary
											onClick={() => handleAddToCart(product.id)}
										>
											{__("Añadir al carrito", "tu-texto-localizacion")}
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
