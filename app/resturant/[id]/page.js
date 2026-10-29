
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function ResturantDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const id = params?.id;

  const [resturant, setResturant] = useState(null);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [foodLoading, setFoodLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Fetch restaurant and its foods.
  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();

    const fetchResturant = async () => {
      try {
        if (!API) {
          throw new Error(
            "NEXT_PUBLIC_API_URL is not configured."
          );
        }

        const response = await fetch(
          `${API}/resturants/${id}`,
          { signal: controller.signal }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Restaurant not found."
          );
        }

        setResturant(data.resturant || data);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Restaurant fetch error:", error);
          setResturant(null);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    const fetchFoods = async () => {
      try {
        if (!API) {
          throw new Error(
            "NEXT_PUBLIC_API_URL is not configured."
          );
        }

        const response = await fetch(
          `${API}/foods?resturant=${encodeURIComponent(id)}`,
          { signal: controller.signal }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch foods."
          );
        }

        const foodList = Array.isArray(data)
          ? data
          : data.foods || [];

        setFoods(foodList);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Foods fetch error:", error);
          setFoods([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setFoodLoading(false);
        }
      }
    };

    setLoading(true);
    setFoodLoading(true);
    setResturant(null);
    setFoods([]);

    fetchResturant();
    fetchFoods();

    return () => controller.abort();
  }, [id]);


const addToCart = async (food) => {
  if (!food?._id) {
    alert("Food not found");
    return;
  }

  try {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      router.push("/login");
      return;
    }

    const response = await fetch(`${API}/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        foodId: food._id,
        quantity: 1,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Failed to add to cart");
      return;
    }

    // Notify components that listen for cart updates.
    window.dispatchEvent(new Event("cartUpdated"));

    alert(`${food.name} added to cart 🛒`);
  } catch (error) {
    console.error("Add to cart error:", error);
    alert("Something went wrong while adding food to cart");
  }
};

const buyNow = async (food) => {
  if (!food?._id) {
    alert("Food not found");
    return;
  }

  try {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      router.push("/login");
      return;
    }

    const response = await fetch(`${API}/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        foodId: food._id,
        quantity: 1,
      }),
    });

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

  // Search food by name.
  const filteredFoods = foods.filter((food) =>
    food.name
      ?.toLowerCase()
      .includes(search.toLowerCase().trim())
  );

  // Loading state.
  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-orange-50">
        <div className="text-center">
          <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500" />

          <p className="mt-4 font-semibold text-gray-600">
            Loading restaurant...
          </p>
        </div>
      </main>
    );
  }

  // Restaurant not found.
  if (!resturant) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100 px-5">
        <div className="rounded-3xl bg-white p-10 text-center shadow-xl">
          <div className="text-7xl">😢</div>

          <h1 className="mt-5 text-2xl font-bold">
            Restaurant not found
          </h1>

          <p className="mt-2 text-gray-500">
            We couldn't load this restaurant. Please try again.
          </p>

          <Link
            href="/resturant"
            className="mt-6 inline-block rounded-xl bg-orange-500 px-6 py-3 font-bold text-white transition hover:bg-orange-600"
          >
            ← Back to Restaurants
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Navigation */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
        <Link
          href="/resturant"
          className="rounded-xl bg-white px-4 py-2.5 font-semibold text-gray-700 shadow transition hover:bg-orange-500 hover:text-white"
        >
          ← Restaurants
        </Link>

        <Link
          href="/cart"
          className="rounded-xl bg-gray-900 px-5 py-2.5 font-bold text-white shadow-lg transition hover:bg-orange-500"
        >
          🛒 Cart
        </Link>
      </nav>

      {/* Restaurant Hero */}
      <section className="mx-auto max-w-7xl px-5">
        <div className="relative overflow-hidden rounded-[2rem] bg-gray-900 shadow-2xl">
          {resturant.image ? (
            <img
              src={resturant.image}
              alt={resturant.name || "Restaurant"}
              className="absolute inset-0 h-full w-full object-cover opacity-60"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-600" />
          )}

          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />

          <div className="relative px-7 py-16 sm:px-12 sm:py-20">
            <div className="max-w-3xl">
              <span className="inline-block rounded-full bg-orange-500 px-4 py-2 text-sm font-bold text-white shadow-lg">
                🍽️ {resturant.cuisine || "Restaurant"}
              </span>

              <h1 className="mt-5 text-4xl font-black text-white sm:text-6xl">
                {resturant.name}
              </h1>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-200">
                {resturant.description ||
                  "Delicious food, fresh ingredients and an amazing dining experience."}
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
                  ⭐ {resturant.rating || "4.5"} Rating
                </span>

                <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
                  🚴 25–35 min
                </span>

                <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
                  🟢 Open Now
                </span>
              </div>

              <div className="mt-6 flex items-start gap-2 text-gray-200">
                <span className="text-xl">📍</span>

                <span>
                  {resturant.address || "Address not available"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Food Menu */}
      <section className="mx-auto max-w-7xl px-5 py-12">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-orange-500">
              Our Menu
            </p>

            <h2 className="mt-1 text-4xl font-black text-gray-900">
              Delicious Food 🍔
            </h2>

            <p className="mt-2 text-gray-500">
              Choose something delicious from our menu.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">
              🔎
            </span>

            <input
              type="text"
              placeholder="Search food..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              className="w-full rounded-2xl border border-gray-200 bg-white py-4 pl-12 pr-4 shadow-sm outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
            />
          </div>
        </div>

        {/* Loading Skeleton */}
        {foodLoading && (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-3xl bg-white shadow"
              >
                <div className="h-52 animate-pulse bg-gray-200" />

                <div className="space-y-4 p-5">
                  <div className="h-6 w-3/4 animate-pulse rounded bg-gray-200" />

                  <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />

                  <div className="h-10 animate-pulse rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Food Cards */}
        {!foodLoading && (
          <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {filteredFoods.length === 0 ? (
              <div className="col-span-full rounded-3xl bg-white p-16 text-center shadow">
                <div className="text-6xl">🍽️</div>

                <h3 className="mt-4 text-2xl font-bold">
                  No food found
                </h3>

                <p className="mt-2 text-gray-500">
                  {search
                    ? "Try searching for something else."
                    : "This restaurant has no food items available yet."}
                </p>
              </div>
            ) : (
              filteredFoods.map((food) => (
                <div
                  key={food._id}
                  className="group overflow-hidden rounded-3xl bg-white shadow-md transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
                >
                  {/* Food Image */}
                  <div className="relative h-56 overflow-hidden">
                    {food.image ? (
                      <img
                        src={food.image}
                        alt={food.name || "Food"}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-orange-100 text-6xl">
                        🍔
                      </div>
                    )}

                    <div className="absolute left-4 top-4">
                      <span className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-orange-600 shadow">
                        {food.category?.name ||
                          food.category ||
                          "Food"}
                      </span>
                    </div>

                    <div className="absolute right-4 top-4">
                      <span className="rounded-full bg-black/70 px-3 py-1.5 text-sm font-bold text-white">
                        ⭐ {food.rating || "4.5"}
                      </span>
                    </div>
                  </div>

                  {/* Food Information */}
                  <div className="p-5">
                    <h3 className="text-xl font-black text-gray-900">
                      {food.name}
                    </h3>

                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-500">
                      {food.description ||
                        "Delicious food prepared fresh for you."}
                    </p>

                    <div className="mt-5 flex items-center justify-between">
                      <span className="text-2xl font-black text-orange-600">
                        ₹{food.price}
                      </span>

                      <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-600">
                        ● Available
                      </span>
                    </div>

                    {/* Cart and Buy Now */}
                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => addToCart(food)}
                        className="rounded-xl border-2 border-orange-500 px-3 py-3 text-sm font-bold text-orange-600 transition hover:bg-orange-500 hover:text-white"
                      >
                        🛒 Add to Cart
                      </button>

                      <button
                        type="button"
                        onClick={() => buyNow(food)}
                        className="rounded-xl bg-gradient-to-r from-orange-500 to-red-500 px-3 py-3 text-sm font-bold text-white shadow transition hover:shadow-lg"
                      >
                        ⚡ Buy Now
                      </button>
                    </div>

                    <Link
                      href={`/food/${food._id}`}
                      className="mt-4 block text-center text-sm font-bold text-gray-500 transition hover:text-orange-500"
                    >
                      View Food Details →
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </section>

      {/* Restaurant Benefits */}
      <section className="mx-auto max-w-7xl px-5 pb-16">
        <div className="grid gap-5 md:grid-cols-3">
          <div className="rounded-3xl bg-white p-7 shadow-lg">
            <div className="text-4xl">🚴</div>

            <h3 className="mt-4 text-xl font-black">
              Fast Delivery
            </h3>

            <p className="mt-2 text-gray-500">
              Fresh food delivered quickly to your doorstep.
            </p>
          </div>

          <div className="rounded-3xl bg-white p-7 shadow-lg">
            <div className="text-4xl">🥗</div>

            <h3 className="mt-4 text-xl font-black">
              Fresh Ingredients
            </h3>

            <p className="mt-2 text-gray-500">
              Carefully selected ingredients for every dish.
            </p>
          </div>

          <div className="rounded-3xl bg-white p-7 shadow-lg">
            <div className="text-4xl">❤️</div>

            <h3 className="mt-4 text-xl font-black">
              Great Taste
            </h3>

            <p className="mt-2 text-gray-500">
              Delicious meals made with care and passion.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
