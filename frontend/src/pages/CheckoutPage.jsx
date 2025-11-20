import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CheckoutForm from '../components/checkout/CheckoutForm';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.cart);

  useEffect(() => {
    // Redirect to cart if no items
    if (!items || items.length === 0) {
      navigate('/cart');
    }
  }, [items, navigate]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <CheckoutForm />
      </div>
    </div>
  );
};

export default CheckoutPage;
