import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { db, storage } from '../firebase';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const AddProduct = () => {
  const auth = getAuth();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [image, setImage] = useState(null);
  const [products, setProducts] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        fetchUserProducts(user.uid); // Fetch products owned by the user
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  const fetchUserProducts = async (userId) => {
    try {
      const productsCollection = collection(db, 'products');
      const productsSnapshot = await getDocs(productsCollection);
      const userProducts = productsSnapshot.docs
        .filter((doc) => doc.data().userId === userId) // Filter for the current user's products
        .map((doc) => ({ id: doc.id, ...doc.data() }));
      setProducts(userProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!image) throw new Error('Please upload an image.');
      const storageRef = ref(storage, `images/${image.name}`);
      await uploadBytes(storageRef, image);
      const imageUrl = await getDownloadURL(storageRef);
      await addDoc(collection(db, 'products'), {
        title,
        price: parseFloat(price),
        category,
        image: imageUrl,
        status,
        userId: currentUser.uid, // Link product to current user
      });
      setSuccessMessage('Product added successfully!');
      fetchUserProducts(currentUser.uid); // Refresh product list
      setTitle('');
      setPrice('');
      setCategory('');
      setStatus('');
      setImage(null);
    } catch (error) {
      console.error('Error adding product:', error);
      setSuccessMessage(`Error adding product: ${error.message}`);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const productRef = doc(db, 'products', productId);
      await deleteDoc(productRef);
      setSuccessMessage('Product deleted successfully!');
      // Update state to remove the deleted product
      setProducts(products.filter((product) => product.id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
      setSuccessMessage(`Error deleting product: ${error.message}`);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!currentUser) return <Navigate to="/login" />;

  return (
    <div className="container mt-5">
      <h1 className="h3 mb-4">Add a New Product</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-3">
          <label className="form-label">Product Name</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter the product name"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Price</label>
          <input
            type="number"
            className="form-control"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter the product price"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Category</label>
          <div>
            <input
              type="radio"
              id="shoes"
              name="category"
              value="shoes"
              checked={category === 'shoes'}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
            <label htmlFor="shoes" className="ms-2 me-3">Shoes</label>
            <input
              type="radio"
              id="women-bags"
              name="category"
              value="women-bags"
              checked={category === 'women-bags'}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
            <label htmlFor="women-bags" className="ms-2 me-3">Women Bags</label>
            <input
              type="radio"
              id="coats"
              name="category"
              value="coats"
              checked={category === 'coats'}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
            <label htmlFor="coats" className="ms-2 me-3">Coats</label>
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">Product Status</label>
          <input
            type="text"
            className="form-control"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            placeholder="Enter the product status"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Product Image</label>
          <input
            type="file"
            accept="image/*"
            className="form-control"
            onChange={handleImageChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Add Product
        </button>
      </form>
      {successMessage && <div className="alert alert-success mt-4">{successMessage}</div>}

      <h2 className="h3 mt-4">Your Products</h2>
      <ul className="list-group">
        {products.length > 0 ? (
          products.map((product) => (
            <li key={product.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <img
                  src={product.image}
                  alt={product.title}
                  className="img-thumbnail me-3"
                  style={{ width: '50px' }}
                />
                {product.title}
              </div>
              {currentUser.uid === product.userId && (
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="btn btn-danger btn-sm"
                >
                  Delete
                </button>
              )}
            </li>
          ))
        ) : (
          <p>No products found</p>
        )}
      </ul>
    </div>
  );
};

export default AddProduct;
