import react from 'react';

function Orders(){
    const mockOrders = [
    { id: 1, name: "Product A", price: 20, status: "Paid" },
    { id: 2, name: "Product B", price: 35, status: "Paid" },
  ];

  return (
    <div>
        <h2>My Orders</h2>
        <ul>
            {mockOrders.map((order) => (
                <li key={order.id}>
                    {order.name} - ${order.price} {order.status}

                </li>
            ))}
        </ul>
    </div>
  )
}
export default Orders;