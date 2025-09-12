import react from 'react';

function Checkout({ cart }){
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handlePay = () => {
        alert("Stripe Integration is coming soon");
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
            <button onClick = {handlePay}>Pay Now</button>
        </div>
    );
}

export default Checkout;