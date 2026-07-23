import React, { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';

const emptyProduct = {
  name: '',
  description: '',
  price: '',
  stockQty: '',
  imageUrl: '',
  categoryId: '',
  brandId: '',
};

const AdminPage = ({ searchQuery }) => {
  const {
    products,
    productsError,
    loadingProducts,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    categories,
    brands,
    metadataError,
    currentAdminTab,
  } = useApp();

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [productForm, setProductForm] = useState(emptyProduct);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const filteredProducts = useMemo(() => {
    const query = (searchQuery || '').trim().toLowerCase();
    if (!query) return products;
    return products.filter((product) => (
      product.name.toLowerCase().includes(query)
      || product.description.toLowerCase().includes(query)
      || product.category.toLowerCase().includes(query)
      || product.brand.toLowerCase().includes(query)
    ));
  }, [products, searchQuery]);

  const totalInventory = products.reduce((total, product) => total + product.stock, 0);
  const inventoryValue = products.reduce(
    (total, product) => total + (product.price * product.stock),
    0,
  );

  const openCreateModal = () => {
    setEditingProductId(null);
    setFormError('');
    setProductForm({
      ...emptyProduct,
      categoryId: categories[0]?.id ? String(categories[0].id) : '',
      brandId: brands[0]?.id ? String(brands[0].id) : '',
    });
    setIsProductModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProductId(product.id);
    setFormError('');
    setProductForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      stockQty: String(product.stock),
      imageUrl: product.image,
      categoryId: String(product.categoryId),
      brandId: String(product.brandId),
    });
    setIsProductModalOpen(true);
  };

  const updateField = (field, value) => {
    setProductForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');

    if (!productForm.name.trim()) return setFormError('Product name is required.');
    if (!productForm.description.trim()) return setFormError('Description is required.');
    if (!productForm.price || Number(productForm.price) < 0) return setFormError('Enter a valid price.');
    if (productForm.stockQty === '' || Number(productForm.stockQty) < 0) return setFormError('Enter valid stock.');
    if (!productForm.categoryId) return setFormError('Select a category.');
    if (!productForm.brandId) return setFormError('Select a brand.');

    setSaving(true);
    try {
      if (editingProductId) {
        await updateProduct(editingProductId, productForm);
      } else {
        await addProduct(productForm);
      }
      setIsProductModalOpen(false);
      setProductForm(emptyProduct);
      setEditingProductId(null);
    } catch (error) {
      setFormError(error.message || 'The product could not be saved.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.name}"?`)) return;
    try {
      await deleteProduct(product.id);
    } catch (error) {
      window.alert(error.message || 'The product could not be deleted.');
    }
  };

  const productTable = (
    <div className="bg-white border border-outline-variant/30 rounded-xl overflow-hidden shadow-sm">
      {loadingProducts ? (
        <p className="p-8 text-center text-on-surface-variant" aria-busy="true">Loading products…</p>
      ) : productsError ? (
        <div className="p-8 text-center text-error" role="alert">
          <p>{productsError}</p>
          <button type="button" className="mt-3 underline" onClick={fetchProducts}>Try again</button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[760px]">
            <thead className="bg-surface-container-low border-b border-outline-variant">
              <tr>
                <th className="py-3 px-4 uppercase text-xs text-on-surface-variant">Image</th>
                <th className="py-3 px-4 uppercase text-xs text-on-surface-variant">Product</th>
                <th className="py-3 px-4 uppercase text-xs text-on-surface-variant">Brand</th>
                <th className="py-3 px-4 uppercase text-xs text-on-surface-variant">Category</th>
                <th className="py-3 px-4 uppercase text-xs text-on-surface-variant text-right">Price</th>
                <th className="py-3 px-4 uppercase text-xs text-on-surface-variant">Stock</th>
                <th className="py-3 px-4 uppercase text-xs text-on-surface-variant text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-high">
              {filteredProducts.length === 0 ? (
                <tr><td colSpan="7" className="p-8 text-center text-on-surface-variant">No products returned by the API.</td></tr>
              ) : filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-surface-container-low">
                  <td className="py-3 px-4">
                    {product.image ? (
                      <img src={product.image} alt="" className="w-12 h-12 object-cover rounded border border-outline-variant/30" />
                    ) : (
                      <span className="material-symbols-outlined text-outline">image_not_supported</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <strong className="block">{product.name}</strong>
                    <span className="text-xs text-on-surface-variant">ID {product.id}</span>
                  </td>
                  <td className="py-3 px-4">{product.brand}</td>
                  <td className="py-3 px-4">{product.category}</td>
                  <td className="py-3 px-4 text-right font-bold text-secondary">{product.price.toLocaleString()} ₫</td>
                  <td className="py-3 px-4">{product.stock} units</td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center gap-2">
                      <button type="button" onClick={() => openEditModal(product)} className="p-2 text-secondary" aria-label={`Edit ${product.name}`}>
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                      <button type="button" onClick={() => handleDelete(product)} className="p-2 text-error" aria-label={`Delete ${product.name}`}>
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {currentAdminTab === 'Overview' && (
        <>
          <div>
            <span className="text-sm font-bold uppercase tracking-wider text-admin-primary">Live API data</span>
            <h2 className="font-headline-lg text-admin-headline-lg font-bold">Inventory overview</h2>
            <p className="text-on-surface-variant">All figures below are calculated from the product API.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              ['Products', products.length.toLocaleString(), 'inventory_2'],
              ['Units in stock', totalInventory.toLocaleString(), 'warehouse'],
              ['Inventory value', `${inventoryValue.toLocaleString()} ₫`, 'payments'],
            ].map(([label, value, icon]) => (
              <section key={label} className="bg-white border border-outline-variant/30 rounded-xl p-5 shadow-sm">
                <span className="material-symbols-outlined text-admin-primary">{icon}</span>
                <p className="text-sm text-on-surface-variant mt-3">{label}</p>
                <strong className="text-2xl">{value}</strong>
              </section>
            ))}
          </div>
          {productTable}
        </>
      )}

      {currentAdminTab === 'Products' && (
        <>
          <div className="flex justify-between items-start gap-4">
            <div>
              <h2 className="font-headline-lg text-admin-headline-lg font-bold">Products</h2>
              <p className="text-on-surface-variant">Create, update and delete products through the backend API.</p>
              {metadataError && <p className="text-error mt-2" role="alert">{metadataError}</p>}
            </div>
            <button
              type="button"
              onClick={openCreateModal}
              disabled={categories.length === 0 || brands.length === 0}
              className="bg-admin-primary text-on-primary px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
            >
              <span className="material-symbols-outlined">add</span>
              Add product
            </button>
          </div>
          {productTable}
        </>
      )}

      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button type="button" className="absolute inset-0 bg-black/40" onClick={() => setIsProductModalOpen(false)} aria-label="Close product form" />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-bold">{editingProductId ? 'Update product' : 'Create product'}</h3>
              <button type="button" onClick={() => setIsProductModalOpen(false)} aria-label="Close">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            {formError && <p className="p-3 mb-4 bg-error-container/50 text-error rounded-lg" role="alert">{formError}</p>}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="md:col-span-2">
                <span className="block font-bold mb-1">Product name</span>
                <input className="w-full border rounded-lg p-3" value={productForm.name} onChange={(event) => updateField('name', event.target.value)} />
              </label>
              <label className="md:col-span-2">
                <span className="block font-bold mb-1">Description</span>
                <textarea className="w-full border rounded-lg p-3" rows="3" value={productForm.description} onChange={(event) => updateField('description', event.target.value)} />
              </label>
              <label>
                <span className="block font-bold mb-1">Category</span>
                <select className="w-full border rounded-lg p-3 bg-white" value={productForm.categoryId} onChange={(event) => updateField('categoryId', event.target.value)}>
                  <option value="">Select category</option>
                  {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                </select>
              </label>
              <label>
                <span className="block font-bold mb-1">Brand</span>
                <select className="w-full border rounded-lg p-3 bg-white" value={productForm.brandId} onChange={(event) => updateField('brandId', event.target.value)}>
                  <option value="">Select brand</option>
                  {brands.map((brand) => <option key={brand.id} value={brand.id}>{brand.name}</option>)}
                </select>
              </label>
              <label>
                <span className="block font-bold mb-1">Price (₫)</span>
                <input type="number" min="0" className="w-full border rounded-lg p-3" value={productForm.price} onChange={(event) => updateField('price', event.target.value)} />
              </label>
              <label>
                <span className="block font-bold mb-1">Stock quantity</span>
                <input type="number" min="0" className="w-full border rounded-lg p-3" value={productForm.stockQty} onChange={(event) => updateField('stockQty', event.target.value)} />
              </label>
              <label className="md:col-span-2">
                <span className="block font-bold mb-1">Image URL</span>
                <input type="url" className="w-full border rounded-lg p-3" value={productForm.imageUrl} onChange={(event) => updateField('imageUrl', event.target.value)} />
              </label>
              <div className="md:col-span-2 flex justify-end gap-3 pt-3">
                <button type="button" className="px-4 py-2 border rounded-lg" onClick={() => setIsProductModalOpen(false)}>Cancel</button>
                <button type="submit" disabled={saving} className="px-4 py-2 bg-admin-primary text-on-primary rounded-lg disabled:opacity-50">
                  {saving ? 'Saving…' : editingProductId ? 'Update product' : 'Create product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
