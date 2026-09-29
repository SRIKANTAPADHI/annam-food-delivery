"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    image: "",
  });

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API}/categories`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        console.error(data.message);
        return;
      }

      setCategories(
        Array.isArray(data)
          ? data
          : Array.isArray(data.categories)
            ? data.categories
            : []
      );
    } catch (error) {
      console.error("Fetch categories error:", error);
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API}/categories`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert("Category added successfully");

      setForm({
        name: "",
        description: "",
        image: "",
      });

      fetchCategories();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmDelete) return;

    const token = localStorage.getItem("token");

    const res = await fetch(
      `${API}/categories/${id}`,
      {
        method: "DELETE",

        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    fetchCategories();
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">

      <div className="mx-auto max-w-7xl">

        <h1 className="mb-8 text-3xl font-bold">
          Category Management
        </h1>

        <div className="grid gap-8 lg:grid-cols-3">

          {/* ADD CATEGORY */}

          <div className="rounded-2xl bg-white p-6 shadow">

            <h2 className="mb-5 text-xl font-bold">
              Add Category
            </h2>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >

              <input
                type="text"
                placeholder="Category name"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
                className="w-full rounded-lg border p-3 outline-none focus:border-orange-500"
                required
              />

              <input
                type="text"
                placeholder="Image URL"
                value={form.image}
                onChange={(e) =>
                  setForm({
                    ...form,
                    image: e.target.value,
                  })
                }
                className="w-full rounded-lg border p-3 outline-none focus:border-orange-500"
              />

              <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
                }
                className="w-full rounded-lg border p-3 outline-none focus:border-orange-500"
                rows="4"
              />

              <button
                type="submit"
                className="w-full rounded-lg bg-orange-500 py-3 font-semibold text-white hover:bg-orange-600"
              >
                + Add Category
              </button>

            </form>
          </div>

          {/* CATEGORY LIST */}

          <div className="lg:col-span-2">

            <div className="grid gap-5 sm:grid-cols-2">

              {categories.map((category) => (

                <div
                  key={category._id}
                  className="overflow-hidden rounded-2xl bg-white shadow"
                >

                  {category.image && (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="h-60 w-3xl object-cover"
                    />
                  )}

                  <div className="p-5">

                    <h3 className="text-xl font-bold">
                      {category.name}
                    </h3>

                    <p className="mt-2 text-sm text-gray-500">
                      {category.description}
                    </p>

                    <button
                      onClick={() =>
                        handleDelete(category._id)
                      }
                      className="mt-4 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
                    >
                      Delete
                    </button>

                  </div>

                </div>

              ))}

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}