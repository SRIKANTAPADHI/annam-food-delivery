"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function CartPage() {
  const [cart, setCart] = useState({
    items: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        window.location.href = "/login";
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
        console.error(data.message);
        return;
      }

      setCart({
        items: Array.isArray(data.items)
          ? data.items
          : [],
      });
    } catch (error) {
      console.error("Load cart error:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (foodId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API}/cart/${foodId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to remove item");
        return;
      }

      setCart({
        items: data.cart?.items || [],
      });
    } catch (error) {
      console.error("Remove item error:", error);
    }
  };

  const updateQuantity = async (foodId, quantity) => {
    if (quantity < 1) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API}/cart/${foodId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            quantity,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to update cart");
        return;
      }

      setCart({
        items: data.cart?.items || [],
      });
    } catch (error) {
      console.error("Update quantity error:", error);
    }
  };

  const total = cart.items.reduce(
    (sum, item) =>
      sum +
      Number(item.price || item.food?.price || 0) *
      Number(item.quantity || 0),
    0
  );

  if (loading) {
    return (
      <main className="min-h-screen bg-orange-50 flex items-center justify-center">
        <p className="text-xl font-semibold">
          Loading cart...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-orange-50 p-6">
      <div className="mx-auto max-w-5xl">

        <h1 className="mb-8 text-3xl font-bold">
          🛒 My Cart
        </h1>

        {cart.items.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow">

            <div className="mb-4 text-6xl">
              🛒
            </div>

            <h2 className="text-2xl font-bold">
              Your cart is empty
            </h2>

            <p className="mt-2 text-gray-500">
              Add some delicious food to your cart.
            </p>

            <Link
              href="/foods"
              className="mt-6 inline-block rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600"
            >
              Browse Food
            </Link>

          </div>
        ) : (

          <div className="space-y-4">

            {cart.items.map((item) => {

              const food = item.food;

              const foodId =
                food?._id || food || item._id;

              const name =
                food?.name || item.name || "Food";

              const image =
                food?.image || item.image;

              const price =
                Number(
                  item.price ??
                  food?.price ??
                  0
                );

              const quantity =
                Number(item.quantity || 1);

              return (
                <div
                  key={foodId}
                  className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow sm:flex-row sm:items-center sm:justify-between"
                >

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
                      <h2 className="text-xl font-bold">
                        {name}
                      </h2>

                      <p className="font-semibold text-orange-600">
                        ₹{price}
                      </p>
                    </div>

                  </div>

                  <div className="flex items-center gap-4">

                    <button
                      onClick={() =>
                        updateQuantity(
                          foodId,
                          quantity - 1
                        )
                      }
                      className="h-9 w-9 rounded-lg border font-bold"
                    >
                      −
                    </button>

                    <span className="font-bold">
                      {quantity}
                    </span>

                    <button
                      onClick={() =>
                        updateQuantity(
                          foodId,
                          quantity + 1
                        )
                      }
                      className="h-9 w-9 rounded-lg border font-bold"
                    >
                      +
                    </button>

                    <button
                      onClick={() =>
                        removeItem(foodId)
                      }
                      className="ml-3 rounded-lg bg-red-100 px-3 py-2 text-sm font-semibold text-red-600"
                    >
                      Remove
                    </button>

                  </div>

                </div>
              );
            })}

            <div className="mt-8 rounded-2xl bg-white p-6 shadow">

              <div className="flex items-center justify-between text-xl font-bold">
                <span>Total</span>

                <span className="text-orange-600">
                  ₹{total.toFixed(2)}
                </span>
              </div>

              {cart.items.length > 0 && (
                <Link
                  href="/checkout"
                  className="mt-5 block w-full rounded-xl bg-orange-500 py-3 text-center font-semibold text-white hover:bg-orange-600"
                >
                  Proceed to Checkout
                </Link>
              )}

            </div>

          </div>
        )}

      </div>
    </main>
  );
}