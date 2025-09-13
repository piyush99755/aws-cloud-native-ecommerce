import React, { useState } from 'react';
import { CardElement, useStripe,useElements } from '@stripe/react-stripe-js';

function Checkout({ cart = [] }){
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
        <div>
            <h2>Checkout</h2>
            <ul>
                {cart.map((item) => (
                    <li key={item.id}>
                        {item.name} - {item.price} × {item.quantity}
                    </li>
                ))}
            </ul>
            <h3>total: ${total.toFixed(2)}</h3>

            {/* Stripe Card Input */}
            <CardElement />

            <button onClick = {handlePay} disabled={!stripe || loading}>
                {loading ? 'Processing...' : 'Pay Now'}
            </button>

            {message && <p>{message}</p>}
        </div>
    );
}

export default Checkout;