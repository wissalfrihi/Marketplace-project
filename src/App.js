import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Elements from './pages/Elements';
import Blog from './pages/Blog';
import AddProduct from './components/AddProduct';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Cart from './pages/Cart';
import Shoes from './components/Categories/Shoes';
import Coats from './components/Categories/Coats';
import WomenBags from './components/Categories/WomenBags';
import SearchResults from './pages/SearchResults';
import AdminDashboard from './components/AdminDashboard';
import Confirmation from './pages/Confirmation';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './components/Dashboard';

function App() {
 

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-white flex flex-col">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/" element={<PrivateRoute component={Home} />} />
                <Route path="/shop" element={<PrivateRoute component={Shop} />} />
                <Route path="/elements" element={<PrivateRoute component={Elements} />} />
                <Route path="/blog" element={<PrivateRoute component={Blog} />} />
                <Route path="/cart" element={<PrivateRoute component={Cart} />} />
                <Route path="/elements/shoes" element={<PrivateRoute component={Shoes} />} />
                <Route path="/elements/coats" element={<PrivateRoute component={Coats} />} />
                <Route path="/elements/women-bags" element={<PrivateRoute component={WomenBags} />} />
                <Route path="/search" element={<PrivateRoute component={SearchResults} />} />
                <Route path="/add-product" element={<PrivateRoute component={AddProduct} />} />
                <Route path="/admin-dashboard" element={<PrivateRoute adminOnly={true} component={AdminDashboard} />} />
                <Route path="/confirmation" element={<PrivateRoute component={Confirmation} />} />
                <Route path="/dashboard" element={<Dashboard  />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
