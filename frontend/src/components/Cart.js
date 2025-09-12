import React from "react";
import {Link, link} from 'react-router-dom';

function Cart({cart, setCart}){
    const removeFromCart = (id) => {
        setCart(cart.filter((item)=>item.id != id));
    };

    const total = cart.reduce((sum,item) => sum + item.price * item.quantity, 0 );

    return (
        <div>
            <h2>Shopping Cart</h2>
            {cart.length === 0 ? (
                <p>Cart is Empty.</p>
            ):(
                <ul>
                    {cart.map((item) => (
                        <li key={item.id}>
                            {item.name} - {item.price} × {item.quantity}
                            <button onClick={() => removeFromCart(item.id)}>Remove</button>
                        </li>
                    ))}
                </ul>
            )}
            <h3>Total: {total.toFixed(2)}</h3>
            {cart.length > 0 && <Link to='/checkout'>Proceed to Checkout</Link>}
        </div>
    );
}

export default Cart;