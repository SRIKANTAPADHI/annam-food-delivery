
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function ResturantPage() {
  const [resturants, setResturants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchResturants = async () => {
      try {

        const response = await fetch(`${API}/resturants`);

        const data = await response.json();


        if (!response.ok) {
          console.error(
            data.message || "Failed to fetch resturants"
          );
          return;
        }

        setResturants(
          Array.isArray(data)
            ? data
            : data.resturants ||
            data.resturants ||
            []
        );
      } catch (error) {
        console.error(
          "Fetch resturants error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchResturants();
  }, []);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">

      <section className="relative overflow-hidden bg-gradient-to-r from-orange-500 via-orange-600 to-red-500">

        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10" />
        <div className="absolute -bottom-32 left-10 h-72 w-72 rounded-full bg-white/10" />

        <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8">

          <div className="max-w-2xl">

            <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-orange-100">
              Discover • Order • Enjoy
            </p>

            <h1 className="text-4xl font-black leading-tight text-white sm:text-6xl">
              Discover
              <br />
              Amazing Resturants 🍽️
            </h1>

            <p className="mt-5 max-w-xl text-lg leading-7 text-orange-100">
              Explore the best resturants around you,
              discover delicious cuisines and order your
              favorite meals.
            </p>

          </div>

        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8">

        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-orange-500">
              Explore
            </p>

            <h2 className="mt-1 text-3xl font-black text-gray-900">
              Popular Resturants
            </h2>

            <p className="mt-2 text-gray-500">
              Find your next favorite place to eat.
            </p>
          </div>

          <div className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-gray-600 shadow">
            🍴 {resturants.length} Resturants
          </div>

        </div>

        {loading && (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">

            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-3xl bg-white shadow"
              >
                <div className="h-56 animate-pulse bg-gray-200" />

                <div className="space-y-4 p-6">
                  <div className="h-6 w-3/4 animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                  <div className="h-12 animate-pulse rounded-xl bg-gray-200" />
                </div>
              </div>
            ))}

          </div>
        )}

        {!loading && resturants.length === 0 && (
          <div className="rounded-3xl bg-white px-6 py-20 text-center shadow-xl">

            <div className="text-7xl">
              🍽️
            </div>

            <h2 className="mt-5 text-2xl font-bold text-gray-900">
              No resturants found
            </h2>

            <p className="mt-2 text-gray-500">
              We couldn't find any resturants right now.
            </p>

          </div>
        )}

        {!loading && resturants.length > 0 && (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">

            {resturants.map((resturant) => (

              <article
                key={resturant._id}
                className="group overflow-hidden rounded-3xl bg-white shadow-md transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >

                <div className="relative h-60 overflow-hidden">

                  {resturant.image ? (
                    <img
                      src={resturant.image}
                      alt={resturant.name}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-orange-100 to-red-100 text-7xl">
                      🍽️
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                  <div className="absolute left-4 top-4">
                    <span className="rounded-full bg-white/95 px-4 py-2 text-xs font-bold text-orange-600 shadow-lg backdrop-blur">
                      {resturant.cuisine || "Resturant"}
                    </span>
                  </div>

                  <button
                    onClick={() =>
                      toggleFavorite(resturant._id)
                    }
                    className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-xl shadow-lg transition hover:scale-110"
                  >
                    {favorites.includes(resturant._id)
                      ? "❤️"
                      : "🤍"}
                  </button>

                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">

                    <div>

                      <div className="mb-1 flex items-center gap-2">

                        <span className="rounded-full bg-green-500 px-2 py-1 text-xs font-bold text-white">
                          ● Open
                        </span>

                        <span className="text-xs font-medium text-white">
                          25–35 min
                        </span>

                      </div>

                      <h2 className="text-2xl font-black text-white">
                        {resturant.name}
                      </h2>

                    </div>

                    <div className="rounded-xl bg-white px-3 py-2 text-center shadow-lg">
                      <p className="text-sm font-black text-gray-900">
                        ⭐ 4.5
                      </p>

                      <p className="text-[10px] text-gray-400">
                        Rating
                      </p>
                    </div>

                  </div>

                </div>

                <div className="p-6">

                  <div className="flex items-center gap-2 text-sm">

                    <span className="text-lg">
                      🍴
                    </span>

                    <span className="font-semibold text-gray-700">
                      {resturant.cuisine ||
                        "Multi Cuisine"}
                    </span>

                  </div>

                  <div className="mt-4 flex items-start gap-2">

                    <span className="mt-0.5 text-lg">
                      📍
                    </span>

                    <p className="line-clamp-2 text-sm leading-6 text-gray-500">
                      {resturant.address ||
                        "Location not available"}
                    </p>

                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-2">

                    <div className="rounded-xl bg-orange-50 p-3 text-center">
                      <div className="text-lg">
                        🚴
                      </div>

                      <p className="mt-1 text-[11px] font-bold text-gray-600">
                        Delivery
                      </p>
                    </div>

                    <div className="rounded-xl bg-green-50 p-3 text-center">
                      <div className="text-lg">
                        🥗
                      </div>

                      <p className="mt-1 text-[11px] font-bold text-gray-600">
                        Fresh
                      </p>
                    </div>

                    <div className="rounded-xl bg-yellow-50 p-3 text-center">
                      <div className="text-lg">
                        ⚡
                      </div>

                      <p className="mt-1 text-[11px] font-bold text-gray-600">
                        Fast
                      </p>
                    </div>

                  </div>

                  <Link
                    href={`/resturant/${resturant._id}`}
                    className="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 px-5 py-3.5 font-bold text-white shadow-lg transition duration-300 hover:-translate-y-0.5 hover:shadow-xl"
                  >
                    View Resturant
                    <span className="transition group-hover:translate-x-1">
                      →
                    </span>
                  </Link>

                </div>

              </article>

            ))}

          </div>
        )}

      </section>

    </main>
  );
}

