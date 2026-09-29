"use client";

import { useEffect, useState } from "react";

export default function AdminResturants() {
  const [resturants, setResturants] = useState([]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    image: "",
    address: "",
    cuisine: "",
  });

  const fetchResturants = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/resturants`
    );

    const data = await res.json();

    setResturants(data.resturants);
  };

  useEffect(() => {
    fetchResturants();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/resturants`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    alert("Restaurant added successfully");

    setForm({
      name: "",
      description: "",
      image: "",
      address: "",
      cuisine: "",
    });

    fetchResturants();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="mb-8 text-3xl font-bold">
        Restaurant Management
      </h1>

      <div className="grid gap-8 lg:grid-cols-3">

        {/* Add Restaurant */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white p-6 shadow"
        >
          <h2 className="mb-5 text-xl font-bold">
            Add Restaurant
          </h2>

          <input
            className="mb-3 w-full rounded-lg border p-3"
            placeholder="Restaurant name"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
          />

          <input
            className="mb-3 w-full rounded-lg border p-3"
            placeholder="Cuisine"
            value={form.cuisine}
            onChange={(e) =>
              setForm({
                ...form,
                cuisine: e.target.value,
              })
            }
          />

          <input
            className="mb-3 w-full rounded-lg border p-3"
            placeholder="Address"
            value={form.address}
            onChange={(e) =>
              setForm({
                ...form,
                address: e.target.value,
              })
            }
          />

          <input
            className="mb-3 w-full rounded-lg border p-3"
            placeholder="Image URL"
            value={form.image}
            onChange={(e) =>
              setForm({
                ...form,
                image: e.target.value,
              })
            }
          />

          <textarea
            className="mb-4 w-full rounded-lg border p-3"
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
          />

          <button
            type="submit"
            className="w-full rounded-lg bg-orange-500 py-3 font-semibold text-white hover:bg-orange-600"
          >
            + Add Restaurant
          </button>
        </form>

        {/* Restaurant List */}
        <div className="lg:col-span-2">
          <div className="grid gap-4 md:grid-cols-2">
            {resturants.map((restaurant) => (
              <div
                key={restaurant._id}
                className="rounded-2xl bg-white p-5 shadow"
              >
                <h3 className="text-xl font-bold">
                  {restaurant.name}
                </h3>

                <p className="mt-1 text-gray-500">
                  {restaurant.cuisine}
                </p>

                <p className="mt-2 text-sm text-gray-600">
                  {restaurant.address}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}