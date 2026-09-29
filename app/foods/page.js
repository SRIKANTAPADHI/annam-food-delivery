"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function FoodPage() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);
  const [buyingId, setBuyingId] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await fetch(`${API}/foods`);

        const data = await response.json();

        if (!response.ok) {
          console.error(
            data.message || "Failed to fetch foods"
          );
          return;
        }

        setFoods(
          Array.isArray(data)
            ? data
            : data.foods || []
        );
      } catch (error) {
        console.error(
          "Fetch foods error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, []);


  const addToCart = async (food) => {
    if (!food?._id) {
      console.error("Food not found:", food);
      return;
    }

    try {
      setAddingId(food._id);

      const token =
        localStorage.getItem("token");

      if (!token) {
        alert(
          "Please login before adding food to cart."
        );

        router.push("/login");

        return;
      }

      const response = await fetch(
        `${API}/cart`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            foodId: food._id,
            quantity: 1,
          }),
        }
      );

      const text = await response.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        console.error("Server returned non-JSON response");
        alert("Cart API URL is incorrect or cart route is not available.");
        return;
      }

      if (!response.ok) {
        alert(
          data.message ||
          "Failed to add food to cart"
        );

        return;
      }

      alert(
        `${food.name} added to cart 🛒`
      );
    } catch (error) {
      console.error(
        "Add to cart error:",
        error
      );

      alert(
        "Unable to add food to cart"
      );
    } finally {
      setAddingId(null);
    }
  };

  const buyNow = async (food) => {
    if (!food?._id) {
      console.error(
        "Invalid food:",
        food
      );

      return;
    }

    try {
      setBuyingId(food._id);

      const token =
        localStorage.getItem("token");

      if (!token) {
        alert(
          "Please login before buying."
        );

        router.push("/login");

        return;
      }

      const response = await fetch(
        `${API}/cart`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            foodId: food._id,
            quantity: 1,
          }),
        }
      );

      const text = await response.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch {
        console.error("Server returned non-JSON response");
        alert("Cart API URL is incorrect or cart route is not available.");
        return;
      }

      if (!response.ok) {
        alert(
          data.message ||
          "Failed to process Buy Now"
        );

        return;
      }

      router.push("/checkout");
    } catch (error) {
      console.error(
        "Buy now error:",
        error
      );

      alert(
        "Unable to process Buy Now"
      );
    } finally {
      setBuyingId(null);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 px-4 py-10 sm:px-6 lg:px-10">

        <div className="flex min-h-[500px] items-center justify-center">

          <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500"></div>

        </div>

      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 px-4 py-10 sm:px-6 lg:px-10">

      {/* HEADER */}

      <div className="mx-auto mb-10 max-w-7xl">

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

          <div>

            <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-orange-500">
              Delicious Food
            </p>

            <h1 className="text-4xl font-extrabold text-gray-900">
              Explore Our Menu 🍽️
            </h1>

            <p className="mt-2 text-gray-500">
              Choose your favorite food and order now.
            </p>

          </div>


          <Link
            href="/cart"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-3 font-semibold text-white shadow-lg transition hover:bg-orange-500"
          >
            🛒 Cart
          </Link>

        </div>

      </div>


      <div className="mx-auto grid max-w-7xl gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

        {foods.length === 0 ? (

          <div className="col-span-full rounded-2xl bg-white p-12 text-center shadow">

            <div className="mb-3 text-5xl">
              🍽️
            </div>

            <h2 className="text-2xl font-bold text-gray-800">
              No foods found
            </h2>

            <p className="mt-2 text-gray-500">
              Please check back later.
            </p>

          </div>

        ) : (

          foods.map((food) => (

            <div
              key={food._id}
              className="group overflow-hidden rounded-2xl bg-white shadow-md transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >


              <div className="relative overflow-hidden">

                {food.image ? (

                  <img
                    src={food.image}
                    alt={food.name}
                    className="h-56 w-full object-cover transition duration-500 group-hover:scale-110"
                  />

                ) : (

                  <div className="flex h-56 items-center justify-center bg-gray-100 text-5xl">
                    🍔
                  </div>

                )}

                <div className="absolute left-3 top-3">

                  <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-orange-600 shadow">

                    {food.category?.name ||
                      food.category ||
                      "Food"}

                  </span>

                </div>


                <div className="absolute right-3 top-3">

                  <span className="rounded-full bg-black/70 px-3 py-1 text-sm font-semibold text-white">

                    ⭐ {food.rating || "4.5"}

                  </span>

                </div>

              </div>


              <div className="p-5">

                <h2 className="truncate text-xl font-bold text-gray-900">
                  {food.name}
                </h2>

                <p className="mt-1 line-clamp-2 min-h-[40px] text-sm text-gray-500">

                  {food.description ||
                    "Delicious and freshly prepared food."}

                </p>


                <div className="mt-4 flex items-center justify-between">

                  <div>

                    <p className="text-sm text-gray-400">
                      Price
                    </p>

                    <p className="text-2xl font-extrabold text-orange-600">
                      ₹{food.price}
                    </p>

                  </div>

                  <span className="rounded-lg bg-green-50 px-2 py-1 text-xs font-semibold text-green-600">
                    ● Available
                  </span>

                </div>


                <Link
                  href={`/food/${food._id}`}
                  className="mt-4 block text-center text-sm font-semibold text-orange-600 transition hover:text-orange-700"
                >
                  View Details →
                </Link>


                <div className="mt-4 grid grid-cols-2 gap-3">


                  <button
                    onClick={() =>
                      addToCart(food)
                    }
                    disabled={
                      addingId === food._id ||
                      buyingId === food._id
                    }
                    className="rounded-xl border-2 border-orange-500 px-3 py-3 text-sm font-bold text-orange-600 transition hover:bg-orange-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >

                    {addingId === food._id
                      ? "Adding..."
                      : "🛒 Add to Cart"}

                  </button>


                  <button
                    onClick={() =>
                      buyNow(food)
                    }
                    disabled={
                      buyingId === food._id ||
                      addingId === food._id
                    }
                    className="rounded-xl bg-orange-500 px-3 py-3 text-sm font-bold text-white shadow-md transition hover:bg-orange-600 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                  >

                    {buyingId === food._id
                      ? "Processing..."
                      : "⚡ Buy Now"}

                  </button>

                </div>

              </div>

            </div>

          ))

        )}

      </div>

    </main>
  );
}