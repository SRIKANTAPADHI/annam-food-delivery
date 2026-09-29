
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function FoodDetails() {
  const params = useParams();
  const router = useRouter();

  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchFood = async () => {
      try {
        const response = await fetch(
          `${API}/foods/${params.id}`
        );

        const data = await response.json();

        if (!response.ok) {
          console.error(data.message || "Food not found");
          return;
        }

        setFood(data.food || data);
      } catch (error) {
        console.error("Fetch food error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchFood();
    }
  }, [params.id]);


  const addToCart = async () => {
    if (!food?._id) {
      console.error("Food not found");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        router.push("/login");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/cart`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            foodId: food._id,
            quantity: Number(quantity),
          }),
        }
      );

      const data = await response.json();
     if (!response.ok) {
        alert(data.message || "Failed to add to cart");
        return;
      }

      alert(`${food.name} added to cart 🛒`);

    } catch (error) {
      console.error("Add to cart error:", error);
      alert("Something went wrong");
    }
  };

  const buyNow = async () => {
    if (!food?._id) {
      console.error("Food not found");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        router.push("/login");
        return;
      }

      // Add directly to backend cart
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/cart`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            foodId: food._id,
            quantity: Number(quantity),
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        alert(data.message || "Failed to add to cart");
        return;
      }

      router.push("/checkout");

    } catch (error) {
      console.error("Buy now error:", error);
      alert("Something went wrong");
    }
  };



  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-orange-50">
        <div className="text-center">
          <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500" />

          <p className="mt-4 font-semibold text-gray-600">
            Preparing your food...
          </p>
        </div>
      </main>
    );
  }

  if (!food) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="rounded-2xl bg-white p-10 text-center shadow-xl">
          <div className="text-6xl">😢</div>

          <h1 className="mt-4 text-2xl font-bold">
            Food not found
          </h1>

          <Link
            href="/food"
            className="mt-6 inline-block rounded-xl bg-orange-500 px-6 py-3 font-bold text-white"
          >
            ← Back to Food
          </Link>
        </div>
      </main>
    );
  }

  const totalPrice = food.price * quantity;

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">

      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-6">

        <Link
          href="/food"
          className="rounded-xl bg-white px-4 py-2 font-semibold text-gray-700 shadow transition hover:bg-orange-500 hover:text-white"
        >
          ← Back to Menu
        </Link>

        <Link
          href="/cart"
          className="rounded-xl bg-gray-900 px-5 py-2.5 font-bold text-white shadow-lg transition hover:bg-orange-500"
        >
          🛒 Cart
        </Link>

      </div>

      <section className="mx-auto max-w-7xl px-5 pb-16">

        <div className="overflow-hidden rounded-[2rem] bg-white shadow-2xl">

          <div className="grid lg:grid-cols-2">

            <div className="relative min-h-[450px] overflow-hidden bg-gray-100">

              {food.image ? (
                <img
                  src={food.image}
                  alt={food.name}
                  className="h-full min-h-[450px] w-full object-cover transition duration-700 hover:scale-105"
                />
              ) : (
                <div className="flex min-h-[450px] items-center justify-center text-8xl">
                  🍔
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              <div className="absolute left-6 top-6">
                <span className="rounded-full bg-white/95 px-5 py-2 text-sm font-bold text-orange-600 shadow-xl">
                  {food.category?.name ||
                    food.category ||
                    "Delicious Food"}
                </span>
              </div>
              <div className="absolute right-6 top-6">
                <div className="rounded-2xl bg-black/70 px-4 py-3 text-white backdrop-blur">
                  <p className="text-xs text-gray-300">
                    Customer Rating
                  </p>

                  <p className="text-xl font-bold">
                    ⭐ {food.rating || "4.5"}
                  </p>
                </div>
              </div>


              <div className="absolute bottom-7 left-7 text-white">
                <p className="text-sm font-medium text-orange-300">
                  FRESH • HOT • DELICIOUS
                </p>

                <h2 className="mt-1 text-3xl font-extrabold">
                  {food.name}
                </h2>
              </div>

            </div>

            <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">


              <p className="font-bold uppercase tracking-[0.2em] text-orange-500">
                Your next favorite
              </p>

              <h1 className="mt-3 text-4xl font-black leading-tight text-gray-900 sm:text-5xl">
                {food.name}
              </h1>

              <div className="mt-5 flex flex-wrap items-center gap-3">

                <span className="rounded-full bg-yellow-100 px-4 py-2 font-bold text-yellow-700">
                  ⭐ {food.rating || "4.5"}
                </span>

                <span className="text-gray-400">
                  •
                </span>

                <span className="font-medium text-gray-500">
                  100+ happy customers
                </span>

              </div>

              <div className="mt-7">

                <p className="text-sm font-medium text-gray-400">
                  PRICE
                </p>

                <div className="flex items-center gap-3">

                  <span className="text-4xl font-black text-orange-600">
                    ₹{food.price}
                  </span>

                  <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-600">
                    Best Price
                  </span>

                </div>

              </div>

              <div className="mt-7">

                <h3 className="text-lg font-bold text-gray-900">
                  About this dish
                </h3>

                <p className="mt-2 leading-7 text-gray-500">
                  {food.description ||
                    "A delicious dish prepared with fresh ingredients and carefully crafted to give you an amazing dining experience."}
                </p>

              </div>

              <div className="mt-7 grid grid-cols-3 gap-3">

                <div className="rounded-2xl bg-orange-50 p-4 text-center">
                  <div className="text-2xl">🚀</div>

                  <p className="mt-1 text-xs font-bold text-gray-700">
                    Fast Delivery
                  </p>

                  <p className="text-xs text-gray-400">
                    30 min
                  </p>
                </div>

                <div className="rounded-2xl bg-green-50 p-4 text-center">
                  <div className="text-2xl">🥗</div>

                  <p className="mt-1 text-xs font-bold text-gray-700">
                    Fresh
                  </p>

                  <p className="text-xs text-gray-400">
                    Quality
                  </p>
                </div>

                <div className="rounded-2xl bg-yellow-50 p-4 text-center">
                  <div className="text-2xl">🔥</div>

                  <p className="mt-1 text-xs font-bold text-gray-700">
                    Hot Food
                  </p>

                  <p className="text-xs text-gray-400">
                    Freshly made
                  </p>
                </div>

              </div>

              <div className="mt-8 flex items-center justify-between">

                <div>
                  <p className="text-sm font-semibold text-gray-500">
                    Quantity
                  </p>

                  <div className="mt-2 flex items-center rounded-xl border border-gray-200 bg-white">

                    <button
                      onClick={() =>
                        setQuantity((q) =>
                          Math.max(1, q - 1)
                        )
                      }
                      className="px-4 py-2 text-xl font-bold text-gray-600 hover:text-orange-500"
                    >
                      −
                    </button>

                    <span className="min-w-[45px] text-center text-lg font-bold">
                      {quantity}
                    </span>

                    <button
                      onClick={() =>
                        setQuantity((q) => q + 1)
                      }
                      className="px-4 py-2 text-xl font-bold text-gray-600 hover:text-orange-500"
                    >
                      +
                    </button>

                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm text-gray-400">
                    Total
                  </p>

                  <p className="text-2xl font-black text-gray-900">
                    ₹{totalPrice}
                  </p>
                </div>

              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">

                <button
                  onClick={addToCart}
                  className="rounded-2xl border-2 border-orange-500 px-5 py-4 font-bold text-orange-600 transition duration-300 hover:bg-orange-500 hover:text-white hover:shadow-xl"
                >
                  🛒 Add to Cart
                </button>

                <button
                  onClick={buyNow}
                  className="rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 px-5 py-4 font-bold text-white shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
                >
                  ⚡ Buy Now
                </button>

              </div>

            </div>

          </div>

        </div>

      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16">

        <div className="grid gap-5 md:grid-cols-3">

          <div className="rounded-3xl bg-white p-7 shadow-lg">
            <div className="text-4xl">🍴</div>

            <h3 className="mt-4 text-xl font-bold">
              Made Fresh
            </h3>

            <p className="mt-2 text-gray-500">
              Your food is prepared fresh after you place the order.
            </p>
          </div>

          <div className="rounded-3xl bg-white p-7 shadow-lg">
            <div className="text-4xl">🚴</div>

            <h3 className="mt-4 text-xl font-bold">
              Quick Delivery
            </h3>

            <p className="mt-2 text-gray-500">
              Get your favorite food delivered straight to your door.
            </p>
          </div>

          <div className="rounded-3xl bg-white p-7 shadow-lg">
            <div className="text-4xl">❤️</div>

            <h3 className="mt-4 text-xl font-bold">
              Made With Love
            </h3>

            <p className="mt-2 text-gray-500">
              Quality ingredients and great taste in every bite.
            </p>
          </div>

        </div>

      </section>

    </main>
  );
}

