import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { Loader } from 'lucide-react';

// Lazy load pages
// Lazy load pages
const HomeScreen = lazy(() => import('./pages/HomeScreen'));
const LoginScreen = lazy(() => import('./pages/LoginScreen'));
const ProductScreen = lazy(() => import('./pages/ProductScreen'));
const ProductsScreen = lazy(() => import('./pages/ProductsScreen'));
const CategoryScreen = lazy(() => import('./pages/CategoryScreen'));
const CartScreen = lazy(() => import('./pages/CartScreen'));
const SearchScreen = lazy(() => import('./pages/SearchScreen'));
const CheckoutScreen = lazy(() => import('./pages/CheckoutScreen'));
const OrderScreen = lazy(() => import('./pages/OrderScreen'));
const ProfileScreen = lazy(() => import('./pages/ProfileScreen'));
const OrdersListScreen = lazy(() => import('./pages/OrdersListScreen'));

// Lazy load admin components/pages
const AdminRoute = lazy(() => import('./components/AdminRoute'));
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProductList = lazy(() => import('./pages/admin/AdminProductList'));
const AdminProductEdit = lazy(() => import('./pages/admin/AdminProductEdit'));
const AdminOrderList = lazy(() => import('./pages/admin/AdminOrderList'));
const AdminUserList = lazy(() => import('./pages/admin/AdminUserList'));
const AdminCategoryList = lazy(() => import('./pages/admin/AdminCategoryList'));
const AdminReviewList = lazy(() => import('./pages/admin/AdminReviewList'));
const AdminCouponList = lazy(() => import('./pages/admin/AdminCouponList'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));

const LoadingFallback = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <Loader className="w-10 h-10 animate-spin text-primary-600" />
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  <Route path="/" element={<HomeScreen />} />
                  <Route path="/products" element={<ProductsScreen />} />
                  <Route path="/category/:name" element={<CategoryScreen />} />
                  <Route path="/login" element={<LoginScreen />} />
                  <Route path="/search" element={<SearchScreen />} />
                  <Route path="/product/:id" element={<ProductScreen />} />
                  <Route path="/cart" element={<CartScreen />} />
                  <Route path="/checkout" element={
                    <ProtectedRoute>
                      <CheckoutScreen />
                    </ProtectedRoute>
                  } />
                  <Route path="/order/:id" element={
                    <ProtectedRoute>
                      <OrderScreen />
                    </ProtectedRoute>
                  } />
                  <Route path="/orders" element={
                    <ProtectedRoute>
                      <OrdersListScreen />
                    </ProtectedRoute>
                  } />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <ProfileScreen />
                    </ProtectedRoute>
                  } />

                  {/* Admin Routes */}
                  <Route path="/admin" element={
                    <AdminRoute>
                      <AdminLayout />
                    </AdminRoute>
                  }>
                    <Route index element={<AdminDashboard />} />
                    <Route path="products" element={<AdminProductList />} />
                    <Route path="products/new" element={<AdminProductEdit />} />
                    <Route path="products/:id/edit" element={<AdminProductEdit />} />
                    <Route path="orders" element={<AdminOrderList />} />
                    <Route path="orders/:id" element={<OrderScreen />} />
                    <Route path="categories" element={<AdminCategoryList />} />
                    <Route path="users" element={<AdminUserList />} />
                    <Route path="reviews" element={<AdminReviewList />} />
                    <Route path="coupons" element={<AdminCouponList />} />
                    <Route path="settings" element={<AdminSettings />} />
                  </Route>
                </Routes>
              </Suspense>
            </main>
            <Footer />
          </div>
          <Toaster position="bottom-right" />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
