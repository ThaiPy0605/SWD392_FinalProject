import React, { useEffect, useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import Pagination from '../components/catalog/Pagination';

const PRODUCTS_PER_PAGE = 3;

const ProductPage = ({ searchQuery, selectedFilter, maxPrice }) => {
  const { products, addToCart } = useApp();
  const [currentPage, setCurrentPage] = useState(1);
  const [addedProductId, setAddedProductId] = useState(null);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return products.filter((product) => {
      const matchesGroup =
        selectedFilter === 'All' ||
        product.category === selectedFilter ||
        product.ageRange === selectedFilter;
      const matchesPrice = product.price <= maxPrice;
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.sku.toLowerCase().includes(query);

      return matchesGroup && matchesPrice && matchesSearch;
    });
  }, [products, searchQuery, selectedFilter, maxPrice]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedFilter, maxPrice]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE));
  const visibleProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE,
  );

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedProductId(product.id);
    window.setTimeout(() => setAddedProductId(null), 1600);
  };

  const featuredProduct = products.find((product) => product.id === 4) || products[0];

  return (
    <div className="catalog-page">
      <section className="catalog-hero" aria-labelledby="catalog-title">
        <div className="catalog-hero__glow parallax-layer--back" aria-hidden="true" />
        <div className="catalog-hero__content parallax-layer--front">
          <span className="hero-kicker">
            <span className="material-symbols-outlined" aria-hidden="true">bolt</span>
            New classroom series
          </span>
          <h1 id="catalog-title">Small kits.<br />Big ideas.</h1>
          <p>
            Hands-on robotics and electronics that turn curiosity into
            real-world engineering skills.
          </p>
          <div className="catalog-hero__actions">
            <button type="button" onClick={() => handleAddToCart(featuredProduct)}>
              Explore the Yolo:Bit kit
              <span className="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
            </button>
            <span>Designed in Vietnam · Classroom ready</span>
          </div>
        </div>
        <div className="catalog-hero__visual parallax-layer--back" aria-hidden="true">
          <div className="hero-orbit hero-orbit--one" />
          <div className="hero-orbit hero-orbit--two" />
          <img src={featuredProduct?.image} alt="" />
          <div className="hero-stat">
            <strong>50+</strong>
            <span>guided projects</span>
          </div>
        </div>
      </section>

      <section className="catalog-section" aria-labelledby="products-heading">
        <div className="catalog-section__heading">
          <div>
            <span className="eyebrow">Curated for makers</span>
            <h2 id="products-heading">Learning starts with building</h2>
          </div>
          <div className="catalog-result-count" aria-live="polite">
            <span>{filteredProducts.length}</span>
            {filteredProducts.length === 1 ? ' product' : ' products'}
          </div>
        </div>

        {visibleProducts.length === 0 ? (
          <div className="catalog-empty" role="status">
            <span className="material-symbols-outlined" aria-hidden="true">search_off</span>
            <h3>No matching kits</h3>
            <p>Try a different search, category, or price range.</p>
          </div>
        ) : (
          <>
            <div className="product-grid">
              {visibleProducts.map((product) => {
                const wasAdded = addedProductId === product.id;
                return (
                  <article className="product-card" key={product.id}>
                    <div className="product-card__media">
                      <span className="product-card__category">{product.category}</span>
                      <img src={product.image} alt={product.name} />
                      <button type="button" aria-label={`Save ${product.name} to favorites`}>
                        <span className="material-symbols-outlined" aria-hidden="true">favorite</span>
                      </button>
                    </div>
                    <div className="product-card__body">
                      <div className="product-card__meta">
                        <span>{product.ageRange}</span>
                        <span>
                          <span className="material-symbols-outlined" aria-hidden="true">star</span>
                          {product.rating} ({product.reviews})
                        </span>
                      </div>
                      <h3>{product.name}</h3>
                      <p className="product-card__sku">SKU {product.sku}</p>
                      <div className="product-card__footer">
                        <strong>{product.price.toLocaleString()} ₫</strong>
                        <button
                          type="button"
                          className={wasAdded ? 'is-added' : ''}
                          onClick={() => handleAddToCart(product)}
                          aria-label={`Add ${product.name} to cart`}
                        >
                          <span className="material-symbols-outlined" aria-hidden="true">
                            {wasAdded ? 'check' : 'add'}
                          </span>
                          {wasAdded ? 'Added' : 'Add'}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => {
                setCurrentPage(page);
                document.getElementById('products-heading')?.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start',
                });
              }}
            />
          </>
        )}
      </section>

      <section className="catalog-band" id="schools">
        <div>
          <span className="eyebrow">For schools & educators</span>
          <h2>Build a lab students remember.</h2>
        </div>
        <p>Flexible classroom packs, lesson plans, and local educator support—all in one program.</p>
        <a href="mailto:education@ohstem.vn">
          Talk to our education team
          <span className="material-symbols-outlined" aria-hidden="true">north_east</span>
        </a>
      </section>
    </div>
  );
};

export default ProductPage;
