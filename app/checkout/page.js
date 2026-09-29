
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function CheckoutPage() {
    const router = useRouter();

    const [cart, setCart] = useState({ items: [] });
    const [address, setAddress] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCart();
    }, []);

    const loadCart = async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                router.push("/login");
                return;
            }

            const response = await fetch(`${API}/cart`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Unable to load cart");
                return;
            }

            setCart({
                items: Array.isArray(data.items)
                    ? data.items
                    : [],
            });

        } catch (error) {
            console.error("Checkout cart error:", error);
        } finally {
            setLoading(false);
        }
    };

    const getPrice = (item) => {
        return Number(
            item.food?.price ??
            item.price ??
            0
        );
    };

    const subtotal = cart.items.reduce(
        (total, item) => {
            const price = getPrice(item);
            const quantity = Number(item.quantity || 0);

            return total + price * quantity;
        },
        0
    );


    const deliveryFee = subtotal > 0 ? 40 : 0;

    const tax = Number(
        (subtotal * 0.05).toFixed(2)
    );

    const total = subtotal + deliveryFee + tax;

    const handleContinue = () => {

        if (!address.trim()) {
            alert("Please enter your delivery address");
            return;
        }

        sessionStorage.setItem(
            "deliveryAddress",
            address
        );

        sessionStorage.setItem(
            "checkoutTotal",
            total.toString()
        );

        router.push("/payment");
    };


    if (loading) {
        return (
            <main className="min-h-screen bg-gray-100 flex items-center justify-center">

                <div className="rounded-2xl bg-white p-8 shadow">
                    <p className="text-lg font-semibold">
                        Loading checkout...
                    </p>
                </div>

            </main>
        );
    }



    if (cart.items.length === 0) {
        return (
            <main className="min-h-screen bg-gray-100 p-6">

                <div className="mx-auto mt-20 max-w-md rounded-2xl bg-white p-10 text-center shadow">

                    <div className="text-6xl">
                        🛒
                    </div>

                    <h1 className="mt-5 text-2xl font-bold">
                        Your cart is empty
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Please add food to your cart before checkout.
                    </p>

                    <button
                        onClick={() => router.push("/foods")}
                        className="mt-6 rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600"
                    >
                        Browse Food
                    </button>

                </div>

            </main>
        );
    }


    return (
        <main className="min-h-screen bg-gray-100 p-4 sm:p-6">

            <div className="mx-auto max-w-6xl">

                {/* HEADER */}

                <div className="mb-8">

                    <h1 className="text-3xl font-bold">
                        Checkout
                    </h1>

                    <p className="mt-1 text-gray-500">
                        Complete your order
                    </p>

                </div>


                <div className="grid gap-6 lg:grid-cols-3">


                    {/* =========================
                        LEFT
                    ========================= */}

                    <div className="space-y-6 lg:col-span-2">


                        {/* ADDRESS */}

                        <div className="rounded-2xl bg-white p-6 shadow-sm">

                            <h2 className="mb-5 text-xl font-bold">
                                📍 Delivery Address
                            </h2>

                            <textarea
                                value={address}
                                onChange={(e) =>
                                    setAddress(e.target.value)
                                }
                                rows={5}
                                placeholder="Enter your complete delivery address..."
                                className="w-full resize-none rounded-xl border border-gray-300 p-4 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                            />

                        </div>


                        {/* ITEMS */}

                        <div className="rounded-2xl bg-white p-6 shadow-sm">

                            <h2 className="mb-5 text-xl font-bold">
                                🛒 Your Items
                            </h2>


                            <div className="space-y-5">

                                {cart.items.map((item, index) => {

                                    const name =
                                        item.food?.name ||
                                        item.name ||
                                        "Food";

                                    const image =
                                        item.food?.image ||
                                        item.image;

                                    const price =
                                        getPrice(item);

                                    const quantity =
                                        Number(
                                            item.quantity || 1
                                        );

                                    const itemTotal =
                                        price * quantity;

                                    return (

                                        <div
                                            key={
                                                item.food?._id ||
                                                item.food ||
                                                item._id ||
                                                index
                                            }
                                            className="flex items-center justify-between gap-4 border-b pb-5 last:border-b-0 last:pb-0"
                                        >

                                            {/* FOOD INFO */}

                                            <div className="flex items-center gap-4">

                                                {image ? (

                                                    <img
                                                        src={image}
                                                        alt={name}
                                                        className="h-20 w-20 rounded-xl object-cover"
                                                    />

                                                ) : (

                                                    <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-orange-100 text-3xl">
                                                        🍔
                                                    </div>

                                                )}


                                                <div>

                                                    <h3 className="font-bold">
                                                        {name}
                                                    </h3>

                                                    <p className="mt-1 text-sm text-gray-500">
                                                        ₹{price} × {quantity}
                                                    </p>

                                                </div>

                                            </div>


                                            {/* ITEM TOTAL */}

                                            <p className="font-bold">
                                                ₹{itemTotal}
                                            </p>

                                        </div>

                                    );
                                })}

                            </div>

                        </div>

                    </div>


                    {/* =========================
                        RIGHT
                    ========================= */}

                    <div className="h-fit rounded-2xl bg-white p-6 shadow-sm">

                        <h2 className="text-xl font-bold">
                            Order Summary
                        </h2>


                        <div className="mt-6 space-y-4">

                            <div className="flex justify-between text-gray-600">

                                <span>
                                    Subtotal
                                </span>

                                <span>
                                    ₹{subtotal.toFixed(2)}
                                </span>

                            </div>


                            <div className="flex justify-between text-gray-600">

                                <span>
                                    Delivery Fee
                                </span>

                                <span>
                                    ₹{deliveryFee.toFixed(2)}
                                </span>

                            </div>


                            <div className="flex justify-between text-gray-600">

                                <span>
                                    Tax (5%)
                                </span>

                                <span>
                                    ₹{tax.toFixed(2)}
                                </span>

                            </div>


                            <div className="border-t pt-4">

                                <div className="flex justify-between text-xl font-bold">

                                    <span>
                                        Total
                                    </span>

                                    <span className="text-orange-600">
                                        ₹{total.toFixed(2)}
                                    </span>

                                </div>

                            </div>

                        </div>


                        <button
                            onClick={handleContinue}
                            className="mt-6 w-full rounded-xl bg-orange-500 py-3 font-bold text-white transition hover:bg-orange-600"
                        >
                            Continue to Payment →
                        </button>


                        <button
                            onClick={() => router.push("/cart")}
                            className="mt-3 w-full rounded-xl border py-3 font-semibold text-gray-600 hover:bg-gray-50"
                        >
                            ← Back to Cart
                        </button>

                    </div>

                </div>

            </div>

        </main>
    );
}
