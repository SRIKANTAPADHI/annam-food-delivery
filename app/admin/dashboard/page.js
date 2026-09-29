
"use client";

import Link from "next/link";
import { userAgent } from "next/server";
import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRestaurants: 0,
    totalFoods: 0,
    totalOrders: 0,
    revenue: 0,
  });

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("No token found");
          setLoading(false);
          return;
        }

        if (!API) {
          console.error("NEXT_PUBLIC_API_URL is not defined");
          setLoading(false);
          return;
        }
 const res = await fetch(`${API}/dashboard/stats`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();

        if (!res.ok) {
          console.error(
            "Dashboard error:",
            data.message || "Failed to fetch dashboard"
          );

          if (res.status === 401) {
            alert("Please login again.");
          }

          if (res.status === 403) {
            alert("Admin access required.");
          }

          return;
        }

        setStats({
          totalUsers: data.totalUsers || 0,
          totalRestaurants: data.totalRestaurants || 0,
          totalFoods: data.totalFoods || 0,
          totalOrders: data.totalOrders || 0,
          revenue: data.revenue || 0,
        });
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    fetchStats();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100">

      {/* HEADER */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <div>
            <p className="text-sm font-medium text-orange-500">
              FOOD DELIVERY
            </p>

            <h1 className="text-2xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
          </div>

          <Link
            href="/"
            className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
          >
            View Website
          </Link>

        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">

        {/* WELCOME */}
        <div className="mb-8 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 p-8 text-white shadow">

          <p className="text-orange-100">
            Welcome
            <span className="font-bold"> {user?.name || "User"}👋</span>
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            Manage your food delivery system
          </h2>

          <p className="mt-2 max-w-2xl text-orange-100">
            Manage restaurants, categories, foods and customer
            orders from one place.
          </p>

        </div>

        {/* STAT CARDS */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <StatCard
            title="Total Users"
            value={loading ? "..." : stats.totalUsers}
            icon="👥"
          />

          <StatCard
            title="Restaurants"
            value={loading ? "..." : stats.totalRestaurants}
            icon="🍽️"
          />

          <StatCard
            title="Foods"
            value={loading ? "..." : stats.totalFoods}
            icon="🍔"
          />

          <StatCard
            title="Orders"
            value={loading ? "..." : stats.totalOrders}
            icon="📦"
          />

        </div>

        {/* REVENUE */}
        <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">

          <p className="text-sm text-gray-500">
            Delivered Order Revenue
          </p>

          <h2 className="mt-2 text-3xl font-bold text-green-600">
            ₹{loading ? "..." : stats.revenue}
          </h2>

        </div>

        {/* MANAGEMENT */}
        <div className="mt-10">

          <h2 className="text-2xl font-bold">
            Management
          </h2>

          <p className="mt-1 text-gray-500">
            Manage your application data
          </p>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

            <AdminCard
              href="/admin/resturants"
              icon="🍽️"
              title="Restaurants"
              description="Add and manage resturants"
            />

            <AdminCard
              href="/admin/categories"
              icon="🏷️"
              title="Categories"
              description="Add and manage food categories"
            />

            <AdminCard
              href="/admin/foods"
              icon="🍔"
              title="Foods"
              description="Add and manage food items"
            />

            <AdminCard
              href="/admin/orders"
              icon="📦"
              title="Orders"
              description="View and manage customer orders"
            />

          </div>

        </div>

        {/* QUICK ACTIONS */}
        <div className="mt-10 rounded-2xl bg-white p-6 shadow-sm">

          <h2 className="text-xl font-bold">
            Quick Actions
          </h2>

          <div className="mt-5 flex flex-wrap gap-3">

            <Link
              href="/admin/resturants"
              className="rounded-lg bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600"
            >
              + Restaurant
            </Link>

            <Link
              href="/admin/categories"
              className="rounded-lg bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600"
            >
              + Category
            </Link>

            <Link
              href="/admin/foods"
              className="rounded-lg bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600"
            >
              + Food
            </Link>

            <Link
              href="/admin/orders"
              className="rounded-lg border px-5 py-3 font-semibold hover:bg-gray-50"
            >
              View Orders
            </Link>

          </div>

        </div>

      </div>

    </main>
  );
}


/* STAT CARD */

function StatCard({ title, value, icon }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm text-gray-500">
            {title}
          </p>

          <h3 className="mt-2 text-3xl font-bold">
            {value}
          </h3>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-2xl">
          {icon}
        </div>

      </div>

    </div>
  );
}


/* ADMIN CARD */

function AdminCard({
  href,
  icon,
  title,
  description,
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >

      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-orange-100 text-3xl transition group-hover:scale-110">
        {icon}
      </div>

      <h3 className="mt-5 text-xl font-bold">
        {title}
      </h3>

      <p className="mt-2 text-sm text-gray-500">
        {description}
      </p>

      <p className="mt-5 font-semibold text-orange-500">
        Manage →
      </p>

    </Link>
  );
}

