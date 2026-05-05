export interface Cart{
    cartId: number;
    userId: number;
    productId: number;
    quantity: number;

    // 🔥 ADD THIS (optional because backend doesn't send it)
    productName?: string;
}