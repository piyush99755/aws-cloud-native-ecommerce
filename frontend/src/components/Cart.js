import React from "react";
import {Link} from 'react-router-dom';
import { useCart } from "./CartContext";

function Cart(){
    const { cart, removeFromCart } = useCart();
    
    /* const removeFromCart = (id) => {
        setCart(cart.filter((item)=>item.id !== id));
    };
 */
    const total = cart.reduce((sum,item) => sum + item.price * item.quantity, 0 );

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold mb-6" >Shopping Cart</h2>
            {cart.length === 0 ? (
                <p className="text-gray-700">Cart is Empty.</p>
            ):(
                <ul>
                    {cart.map((item) => (
                        <li key={item.id} className="flex justify-between items-center bg-white p-4 rounded shadow">
                            <h3 className="font-semibold">{item.name}</h3>
                            <p>${item.price} × {item.quantity}</p>
                            <button
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                             onClick={() => removeFromCart(item.id)}>Remove</button>
                        </li>
                    ))}
                </ul>
            )}
            <h3 className="text-xl font-bold">Total: {total.toFixed(2)}</h3>
            {cart.length > 0 && <Link to='/checkout' className="inline-block mt-4 bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition">Proceed to Checkout</Link>}
        </div>
    );
}

export default Cart;