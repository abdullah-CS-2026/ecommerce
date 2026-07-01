export const OrdersTab = ({ orders, formatDate }) => {

    console.log(orders);
    return (

        <div>
            <h2 className="text-2xl font-black mb-6">Order History</h2>
            {orders.length === 0 ? (
                <p className="text-slate-600 text-center py-8">No orders yet. Start shopping now!</p>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order._id} className="border border-slate-300 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="font-semibold text-slate-900">Order #{order._id.slice(-8)}</h3>
                                    <p className="text-sm text-slate-600">{formatDate(order.createdAt)}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-bold text-slate-900">Rs. {order.totalAmount.toLocaleString()}</p>
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                        order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                                            order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                {order.items.map((item) => (
                                    <div key={item._id} className="flex justify-between text-sm text-slate-600">
                                        <span>{item.name} × {item.quantity}</span>
                                        <span>Rs. {(item.price * item.quantity).toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

    )
}