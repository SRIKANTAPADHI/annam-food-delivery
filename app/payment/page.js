
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function PaymentPage() {
  const router = useRouter();

  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState({ items: [] });
  const [cartLoading, setCartLoading] = useState(true);

  useEffect(() => {
    const savedAddress =
      sessionStorage.getItem("deliveryAddress");

    if (!savedAddress) {
      router.push("/checkout");
      return;
    }

    setAddress(savedAddress);
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      const res = await fetch(`${API}/cart`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();


      if (!res.ok) {
        alert(data.message || "Failed to load cart");
        return;
      }

      setCart({
        items: Array.isArray(data.items) ? data.items : [],
      });
    } catch (error) {
      console.error("Fetch cart error:", error);
    } finally {
      setCartLoading(false);
    }
  };

  const getPrice = (item) => {
    return Number(
      item.price ??
      item.food?.price ??
      0
    );
  };

  const subtotal = cart.items.reduce(
    (sum, item) => {
      const price = getPrice(item);
      const quantity = Number(item.quantity || 1);

      return sum + price * quantity;
    },
    0
  );

  const deliveryFee = subtotal > 0 ? 40 : 0;

  const tax = Number(
    (subtotal * 0.05).toFixed(2)
  );

  const total = subtotal + deliveryFee + tax;

  const placeOrder = async () => {
    if (cart.items.length === 0) {
      alert("Your cart is empty");
      return;
    }

    if (!address.trim()) {
      alert("Please enter delivery address");
      router.push("/checkout");
      return;
    }

    if (paymentMethod !== "cod") {
      alert("Online payment is not available yet.");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      const res = await fetch(`${API}/orders`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          deliveryAddress: address,
          paymentMethod: paymentMethod,
        }),
      });

      const data = await res.json();


      if (!res.ok) {
        alert(
          data.message ||
          "Failed to place order"
        );
        return;
      }

      sessionStorage.removeItem(
        "deliveryAddress"
      );

      sessionStorage.removeItem(
        "checkoutTotal"
      );

      const orderId =
        data.order?._id ||
        data._id;

      if (!orderId) {
        alert("Order created but order ID was not returned.");
        return;
      }

      router.push(
        `/order-success?id=${orderId}`
      );

    } catch (error) {
      console.error(
        "Place order error:",
        error
      );

      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  if (cartLoading) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="rounded-2xl bg-white p-8 shadow">
          <p className="text-lg font-semibold">
            Loading payment...
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
            Please add food before making payment.
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

        <div className="mb-8">

          <h1 className="text-3xl font-bold text-gray-900">
            Payment
          </h1>

          <p className="mt-1 text-gray-500">
            Review your order and choose your payment method
          </p>

        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-2xl bg-white p-6 shadow-sm">

              <div className="mb-5 flex items-center justify-between">

                <h2 className="text-xl font-bold">
                  🛒 Your Items
                </h2>

                <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-600">
                  {cart.items.length} item
                  {cart.items.length !== 1 ? "s" : ""}
                </span>

              </div>

              <div className="space-y-5">

                {cart.items.map((item, index) => {

                  const food = item.food;

                  const name =
                    food?.name ||
                    item.name ||
                    "Food";

                  const image =
                    food?.image ||
                    item.image;

                  const price =
                    getPrice(item);

                  const quantity =
                    Number(item.quantity || 1);

                  const itemTotal =
                    price * quantity;

                  return (
                    <div
                      key={
                        food?._id ||
                        item._id ||
                        index
                      }
                      className="flex gap-4 border-b pb-5 last:border-b-0 last:pb-0"
                    >
                      {image ? (
                        <img
                          src={image}
                          alt={name}
                          className="h-24 w-24 shrink-0 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-4xl">
                          🍔
                        </div>
                      )}
                      <div className="min-w-0 flex-1">

                        <h3 className="text-lg font-bold text-gray-900">
                          {name}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          ₹{price.toFixed(2)} × {quantity}
                        </p>

                        <p className="mt-2 font-semibold text-orange-600">
                          Item Total: ₹
                          {itemTotal.toFixed(2)}
                        </p>

                      </div>

                    </div>
                  );
                })}

              </div>

            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">

              <div className="flex items-center justify-between">

                <h2 className="text-xl font-bold">
                  📍 Delivery Address
                </h2>

                <button
                  onClick={() =>
                    router.push("/checkout")
                  }
                  className="text-sm font-semibold text-orange-600 hover:text-orange-700"
                >
                  Change
                </button>

              </div>

              <div className="mt-4 rounded-xl bg-gray-50 p-4">

                <p className="leading-6 text-gray-700">
                  {address}
                </p>

              </div>

            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm">

              <h2 className="text-xl font-bold">
                💳 Payment Method
              </h2>

              <div className="mt-5 space-y-4">
                <label
                  className={`flex cursor-pointer items-center gap-4 rounded-xl border-2 p-4 transition ${paymentMethod === "cod"
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-200"
                    }`}
                >

                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={
                      paymentMethod === "cod"
                    }
                    onChange={(e) =>
                      setPaymentMethod(
                        e.target.value
                      )
                    }
                    className="h-5 w-5 accent-orange-500"
                  />

                  <div className="flex-1">

                    <p className="font-bold text-gray-900">
                      Cash on Delivery
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Pay when your order arrives
                    </p>

                  </div>

                  <span className="text-2xl">
                    💵
                  </span>

                </label>
                <label
                  className={`flex cursor-not-allowed items-center gap-4 rounded-xl border-2 p-4 opacity-50 ${paymentMethod === "online"
                    ? "border-orange-500"
                    : "border-gray-200"
                    }`}
                >

                  <input
                    type="radio"
                    name="payment"
                    value="online"
                    checked={
                      paymentMethod === "online"
                    }
                    onChange={(e) =>
                      setPaymentMethod(
                        e.target.value
                      )
                    }
                    disabled
                    className="h-5 w-5"
                  />

                  <div className="flex-1">

                    <p className="font-bold text-gray-900">
                      Online Payment
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      UPI / Card / PhonePe
                    </p>

                  </div>

                  <span className="text-2xl">
                    💳
                  </span>

                </label>

                <p className="text-xs text-gray-400">
                  Online payment will be available soon.
                </p>

              </div>

            </div>

          </div>


          <div className="h-fit rounded-2xl bg-white p-6 shadow-sm lg:sticky lg:top-6">

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

            <div className="mt-6 rounded-xl bg-gray-50 p-4">

              <p className="text-sm text-gray-500">
                Payment Method
              </p>

              <p className="mt-1 font-semibold">
                {paymentMethod === "cod"
                  ? "💵 Cash on Delivery"
                  : "💳 Online Payment"}
              </p>

            </div>

            <button
              onClick={placeOrder}
              disabled={
                loading ||
                paymentMethod !== "cod"
              }
              className="mt-6 w-full rounded-xl bg-orange-500 py-3 font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {loading
                ? "Processing..."
                : `Place Order • ₹${total.toFixed(2)}`}
            </button>

            <button
              onClick={() =>
                router.push("/checkout")
              }
              className="mt-3 w-full rounded-xl border py-3 font-semibold text-gray-600 hover:bg-gray-50"
            >
              ← Back to Checkout
            </button>

            <p className="mt-4 text-center text-xs text-gray-400">
              🔒 Your order information is secure
            </p>

          </div>

        </div>

      </div>

    </main>
  );
}
