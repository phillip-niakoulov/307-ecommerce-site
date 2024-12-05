const OrderStatus = Object.freeze({
    AWAITING_PAYMENT: { value: 'awaiting_payment', text: 'Awaiting Payment' },
    PAID: { value: 'paid', text: 'Paid' },
    SHIPPED: { value: 'shipped', text: 'Shipped' },
    DELIVERED: { value: 'delivered', text: 'Delivered' },
});

export default OrderStatus;