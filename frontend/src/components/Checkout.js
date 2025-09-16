import React, { useState } from 'react';
import { CardElement, useStripe,useElements } from '@stripe/react-stripe-js';
import { useCart } from './CartContext';

function Checkout(){
    const { cart } = useCart();
    const stripe = useStripe();
    const elements = useElements();

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handlePay = async () => {
        if(!stripe || !elements) return; //Stripe is still loading..
        setLoading(true);

        try {
            //created payment method on backend... 
            const res = await fetch('/api/payment/create-payment-intent', {
                method:"POST",
                headers: {'content-type': 'application/json'},
                body:JSON.stringify({
                    amount:Math.round(total*100),
                    currency:'usd',
                }),
            });

            const {clientSecret} = await res.json()

            //payment with card..
            const result =await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card:elements.getElement(CardElement),
                },
            });

            if(result.error){
                setMessage(result.error.message);
            }else if(result.paymentIntent.status === "succeeded"){
                setMessage("Payment successfull!!!");
                 // TODO: call backend to save order in DB
            }
        }
        catch(error){
            setMessage('Something went wrong, please try again!!!');

        }
        setLoading(false);
        
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold mb-6">Checkout</h2>
            <ul className="space-y-2 mb-4">
                {cart.map((item) => (
                    <li key={item.id}>
                        {item.name} - {item.price} × {item.quantity}
                    </li>
                ))}
            </ul>
            
            <h3 className="text-xl font-semibold mb-4">total: ${total.toFixed(2)}</h3>
            <div className="mb-4">
                <CardElement className="p-2 border rounded" />
            </div>

            

            <button
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition" 
            onClick = {handlePay} disabled={!stripe || loading}>
                {loading ? 'Processing...' : 'Pay Now'}
            </button>

            {message && <p className="mt-4 text-red-500">{message}</p>}
        </div>
    );
}

export default Checkout;