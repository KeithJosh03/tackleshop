import CartClient from './CartClient';

export default function CartPage() {
    return (
        <main className="min-h-screen pt-24 pb-16 px-4 sm:px-8 max-w-7xl mx-auto">
            <h1 className="text-3xl font-black text-ma-on-surface uppercase tracking-widest mb-8">Shopping Cart</h1>
            <CartClient />
        </main>
    );
}
