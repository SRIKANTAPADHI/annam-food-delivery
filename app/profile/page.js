"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      router.push("/login");
      return;
    }

    try {
      setUser(JSON.parse(storedUser));
    } catch (error) {
      console.error("Invalid user data:", error);
      localStorage.removeItem("user");
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    router.push("/login");
  };

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-2xl">

        <h1 className="mb-6 text-3xl font-bold">
          My Profile
        </h1>

        <div className="rounded-2xl bg-white p-6 shadow">

          <div className="mb-6 flex items-center gap-4 border-b pb-6">

            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-orange-500 text-3xl font-bold text-white">
              {user.name?.charAt(0).toUpperCase()}
            </div>

            <div>
              <h2 className="text-2xl font-bold">
                {user.name}
              </h2>

              <p className="text-gray-500">
                {user.email}
              </p>
            </div>

          </div>

          <div className="space-y-4">

            <div>
              <p className="text-sm text-gray-500">
                Name
              </p>

              <p className="font-semibold">
                {user.name}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Email
              </p>

              <p className="font-semibold">
                {user.email}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Role
              </p>

              <p className="font-semibold capitalize">
                {user.role}
              </p>
            </div>

          </div>

          <div className="mt-8 flex gap-3">

            <button
              onClick={() => router.push("/orders")}
              className="rounded-lg bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600"
            >
              My Orders
            </button>

            <button
              onClick={handleLogout}
              className="rounded-lg bg-red-500 px-5 py-3 font-semibold text-white hover:bg-red-600"
            >
              Logout
            </button>

          </div>

        </div>
      </div>
    </main>
  );
}