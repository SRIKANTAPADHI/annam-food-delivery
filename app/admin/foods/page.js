
"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function AdminFoods() {
  const [foods, setFoods] = useState([]);
  const [resturants, setResturants] = useState([]);
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "",
    resturant: "",
    isAvailable: true,
  });

  const fetchData = async () => {
    try {
      const [foodRes, restaurantRes, categoryRes] =
        await Promise.all([
          fetch(`${API}/foods`),
          fetch(`${API}/resturants`),
          fetch(`${API}/categories`),
        ]);

      const foodData = await foodRes.json();
      const restaurantData = await restaurantRes.json();
      const categoryData = await categoryRes.json();

      setFoods(
        Array.isArray(foodData)
          ? foodData
          : foodData.foods || []
      );

      setResturants(
        Array.isArray(restaurantData)
          ? restaurantData
          : restaurantData.resturants ||
          restaurantData.restaurants ||
          []
      );

      setCategories(
        Array.isArray(categoryData)
          ? categoryData
          : categoryData.categories || []
      );
    } catch (error) {
      console.error("Fetch data error:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return;
    }

    if (!form.resturant) {
      alert("Please select a restaurant");
      return;
    }

    if (!form.category) {
      alert("Please select a category");
      return;
    }

    try {
      const res = await fetch(`${API}/foods`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          name: form.name,
          description: form.description,
          price: Number(form.price),
          image: form.image,
          category: form.category,
          resturant: form.resturant,
          isAvailable: form.isAvailable,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Failed to add food");
        return;
      }

      alert("Food added successfully");

      setForm({
        name: "",
        description: "",
        price: "",
        image: "",
        category: "",
        resturant: "",
        isAvailable: true,
      });

      fetchData();
    } catch (error) {
      console.error("Add food error:", error);
      alert("Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this food?"
    );

    if (!confirmDelete) return;

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return;
    }

    try {
      const res = await fetch(`${API}/foods/${id}`, {
        method: "DELETE",

        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to delete food");
        return;
      }

      alert("Food deleted successfully");

      fetchData();
    } catch (error) {
      console.error("Delete food error:", error);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">

      <div className="mx-auto max-w-7xl">

        <h1 className="mb-8 text-3xl font-bold">
          Food Management
        </h1>

        <div className="grid gap-8 lg:grid-cols-3">

          <div className="rounded-2xl bg-white p-6 shadow">

            <h2 className="mb-5 text-xl font-bold">
              Add Food
            </h2>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >

              <input
                required
                type="text"
                placeholder="Food name"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
                className="w-full rounded-lg border p-3 outline-none focus:border-orange-500"
              />

              <textarea
                required
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
                }
                rows={4}
                className="w-full rounded-lg border p-3 outline-none focus:border-orange-500"
              />

              <input
                required
                type="number"
                min="0"
                placeholder="Price"
                value={form.price}
                onChange={(e) =>
                  setForm({
                    ...form,
                    price: e.target.value,
                  })
                }
                className="w-full rounded-lg border p-3 outline-none focus:border-orange-500"
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


              <select
                required
                value={form.category}
                onChange={(e) =>
                  setForm({
                    ...form,
                    category: e.target.value,
                  })
                }
                className="w-full rounded-lg border p-3 outline-none focus:border-orange-500"
              >

                <option value="">
                  Select Category
                </option>

                {categories.map((category) => (
                  <option
                    key={category._id}
                    value={category.name}
                  >
                    {category.name}
                  </option>
                ))}

              </select>

              <select
                required
                value={form.resturant}
                onChange={(e) =>
                  setForm({
                    ...form,
                    resturant: e.target.value,
                  })
                }
                className="w-full rounded-lg border p-3 outline-none focus:border-orange-500"
              >

                <option value="">
                  Select Restaurant
                </option>

                {resturants.map((restaurant) => (
                  <option
                    key={restaurant._id}
                    value={restaurant._id}
                  >
                    {restaurant.name}
                  </option>
                ))}

              </select>
              <label className="flex items-center gap-2">

                <input
                  type="checkbox"
                  checked={form.isAvailable}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      isAvailable: e.target.checked,
                    })
                  }
                />

                <span>
                  Available
                </span>

              </label>

              <button
                type="submit"
                className="w-full rounded-lg bg-orange-500 py-3 font-semibold text-white transition hover:bg-orange-600"
              >
                + Add Food
              </button>

            </form>

          </div>

          <div className="lg:col-span-2">

            <div className="grid gap-5 sm:grid-cols-2">

              {foods.length === 0 ? (

                <div className="rounded-2xl bg-white p-8 text-center shadow sm:col-span-2">

                  <p className="text-gray-500">
                    No foods found
                  </p>

                </div>

              ) : (

                foods.map((food) => (

                  <div
                    key={food._id}
                    className="overflow-hidden rounded-2xl bg-white shadow transition hover:shadow-lg"
                  >

                    {/* IMAGE */}

                    {food.image ? (

                      <img
                        src={food.image}
                        alt={food.name}
                        className="h-44 w-full object-cover"
                      />

                    ) : (

                      <div className="flex h-44 items-center justify-center bg-orange-100 text-5xl">
                        🍽️
                      </div>

                    )}

                    <div className="p-5">

                      <div className="flex items-start justify-between gap-3">

                        <h3 className="text-xl font-bold">
                          {food.name}
                        </h3>

                        {food.isAvailable === false && (
                          <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-600">
                            Unavailable
                          </span>
                        )}

                      </div>

                      <p className="mt-1 text-sm text-gray-500">
                        {food.category?.name ||
                          food.category}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        {food.resturant?.name ||
                          food.resturant?.name}
                      </p>

                      {food.description && (
                        <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                          {food.description}
                        </p>
                      )}

                      <p className="mt-3 text-lg font-bold text-orange-500">
                        ₹{food.price}
                      </p>

                      <button
                        onClick={() =>
                          handleDelete(food._id)
                        }
                        className="mt-4 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                ))

              )}

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}
