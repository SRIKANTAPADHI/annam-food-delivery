"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [resturant, setResturant] = useState([]);
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoryRes, resturantRes, foodRes] =
          await Promise.all([
            fetch(`${API}/categories`),
            fetch(`${API}/resturants`),
            fetch(`${API}/foods`),
          ]);

        const categoryData = await categoryRes.json();
        const resturantData = await resturantRes.json();
        const foodData = await foodRes.json();

        setCategories(
          Array.isArray(categoryData)
            ? categoryData
            : categoryData.categories || []
        );

        setResturant(
          Array.isArray(resturantData)
            ? resturantData
            : resturantData.resturants ||
            resturantData.resturants ||
            []
        );

        setFoods(
          Array.isArray(foodData)
            ? foodData
            : foodData.foods || []
        );

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <main className="bg-gray-50">

      <section className="bg-orange-500">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-20 md:grid-cols-2">

          <div className="text-white">
            <span className="rounded-full bg-white/20 px-4 py-2 text-sm">
              🍴 Delicious food, delivered fast
            </span>

            <h1 className="mt-6 text-4xl font-extrabold leading-tight md:text-6xl">
              Your favorite food,
              <br />
              delivered to you.
            </h1>

            <p className="mt-5 max-w-xl text-lg text-orange-50">
              Discover the best resturant and delicious
              dishes around you. Order your favorites in just
              a few clicks.
            </p>

            <div className="mt-8 flex max-w-xl rounded-2xl bg-white p-2 shadow-xl">
              <span className="flex items-center px-3 text-xl">
                🔎
              </span>

              <input
                type="text"
                placeholder="Search for food or restaurant..."
                className="w-full px-2 text-gray-700 outline-none"
              />

              <Link
                href="/foods"
                className="rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600"
              >
                Search
              </Link>
            </div>
          </div>

          <div className="hidden md:block">
            <img
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80"
              alt="Delicious food"
              className="h-[430px] w-full rounded-3xl object-cover shadow-2xl"
            />
          </div>

        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14">

        <div className="flex items-end justify-between">
          <div>
            <p className="font-semibold text-orange-500">
              EXPLORE
            </p>

            <h2 className="mt-1 text-3xl font-bold">
              What are you craving?
            </h2>
          </div>

          <Link
            href="/foods"
            className="hidden text-sm font-semibold text-orange-500 md:block"
          >
            View all →
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-4 md:grid-cols-6">

          {categories.map((category) => (
            <Link
              href={`/foods?category=${encodeURIComponent(
                category.name
              )}`}
              key={category._id}
              className="group rounded-2xl bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >

              {category.image ? (
                <img
                  src={category.image}
                  alt={category.name}
                  className="mx-auto h-20 w-20 rounded-full object-cover"
                />
              ) : (
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 text-3xl">
                  🍽️
                </div>
              )}

              <p className="mt-3 font-semibold">
                {category.name}
              </p>

            </Link>
          ))}

        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-14">

        <div>
          <p className="font-semibold text-orange-500">
            TOP PICKS
          </p>

          <h2 className="mt-1 text-3xl font-bold">
            Popular resturant
          </h2>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">

          {resturant.map((restaurant) => (
            <Link
              key={restaurant._id || restaurant.name}
              href={`/resturant/${restaurant._id}`}
              className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >

              {restaurant.image && (
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="h-52 w-full object-cover"
                />
              )}

              <div className="p-5">

                <div className="flex items-center justify-between">

                  <h3 className="text-xl font-bold">
                    {restaurant.name}
                  </h3>

                  <span className="rounded-lg bg-green-100 px-2 py-1 text-sm font-semibold text-green-700">
                    ⭐ {restaurant.rating || "4.5"}
                  </span>

                </div>

                <p className="mt-2 text-sm text-gray-500">
                  {restaurant.cuisine}
                </p>

                <p className="mt-4 text-sm font-medium text-gray-600">
                  🛵 {restaurant.time || "30-40 min"}
                </p>

              </div>

            </Link>
          ))}

        </div>
      </section>

      <section className="bg-white py-14">

        <div className="mx-auto max-w-7xl px-6">

          <p className="font-semibold text-orange-500">
            MOST LOVED
          </p>

          <h2 className="mt-1 text-3xl font-bold">
            Popular dishes
          </h2>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {foods.map((food) => (
              <Link
                key={food._id || food.name}
                href={`/food/${food._id}`}
                className="overflow-hidden rounded-2xl border bg-white transition hover:-translate-y-1 hover:shadow-xl"
              >
                {food.image && (
                  <img
                    src={food.image}
                    alt={food.name}
                    className="h-48 w-full object-cover"
                  />
                )}

                <div className="p-4">
                  <div className="flex justify-between">
                    <h3 className="font-bold">
                      {food.name}
                    </h3>

                    <span className="text-sm text-green-600">
                      ⭐ {food.rating || "4.5"}
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-gray-500">
                    {food.category?.name || food.category || "Food"}
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-lg font-bold">
                      ₹{food.price}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        addToCart(food);
                      }}
                      className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
                    >
                      Add +
                    </button>
                  </div>
                </div>
              </Link>
            ))}

          </div>

        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">

        <div className="grid gap-6 md:grid-cols-3">

          <div className="rounded-2xl bg-orange-50 p-8">
            <div className="text-4xl">🚀</div>

            <h3 className="mt-4 text-xl font-bold">
              Fast Delivery
            </h3>

            <p className="mt-2 text-gray-600">
              Get your favorite food delivered quickly
              to your doorstep.
            </p>
          </div>

          <div className="rounded-2xl bg-orange-50 p-8">
            <div className="text-4xl">🍽️</div>

            <h3 className="mt-4 text-xl font-bold">
              Best resturant
            </h3>

            <p className="mt-2 text-gray-600">
              Discover delicious food from resturant
              around you.
            </p>
          </div>

          <div className="rounded-2xl bg-orange-50 p-8">
            <div className="text-4xl">🔒</div>

            <h3 className="mt-4 text-xl font-bold">
              Secure Ordering
            </h3>

            <p className="mt-2 text-gray-600">
              Your account and orders are protected with
              secure authentication.
            </p>
          </div>

        </div>
      </section>

      <section className="bg-gray-900 px-6 py-16 text-center text-white">

        <h2 className="text-3xl font-bold md:text-4xl">
          Hungry? Let's fix that. 🍔
        </h2>

        <p className="mx-auto mt-3 max-w-xl text-gray-400">
          Browse resturant, choose your favorite food,
          and get it delivered to your door.
        </p>

        <Link
          href="/resturant"
          className="mt-7 inline-block rounded-xl bg-orange-500 px-7 py-3 font-semibold hover:bg-orange-600"
        >
          Explore resturant
        </Link>

      </section>

    </main>
  );
}