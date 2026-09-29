
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          localStorage.removeItem("user");
        }
      }
    };

    loadUser();

    window.addEventListener("userChanged", loadUser);

    return () => {
      window.removeEventListener("userChanged", loadUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setOpen(false);

    window.dispatchEvent(new Event("userChanged"));
  };

  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        <Link
          href="/"
          className="text-2xl font-bold text-orange-500"
        >
          अन्नम् (Annam)
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <Link href="/" className="hover:text-orange-500">
            Home
          </Link>

          <Link href="/resturant" className="hover:text-orange-500">
            Restaurants
          </Link>

          <Link href="/foods" className="hover:text-orange-500">
            Foods
          </Link>

          <Link href="/cart" className="hover:text-orange-500">
            Cart
          </Link>

          <Link href="/orders" className="hover:text-orange-500">
            My Orders
          </Link>
        </div>

        <div className="relative">

          {!user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="rounded-lg border px-4 py-2 hover:bg-gray-100"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="rounded-lg bg-orange-500 px-4 py-2 text-white hover:bg-orange-600"
              >
                Register
              </Link>
            </div>
          ) : (
            <>

              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 rounded-full border bg-white px-3 py-2 shadow-sm hover:bg-gray-50"
              >

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 font-bold text-white">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </div>

                <span className="font-medium">
                  {user.name || "User"}
                </span>


                <span
                  className={`text-gray-500 transition-transform ${open ? "rotate-180" : ""
                    }`}
                >
                  ▼
                </span>
              </button>


              {open && (
                <div className="absolute right-0 top-14 z-50 w-56 overflow-hidden rounded-xl border bg-white shadow-xl">

                  {/* User Info */}
                  <div className="border-b px-4 py-3">
                    <p className="font-semibold text-gray-800">
                      {user.name}
                    </p>

                    <p className="truncate text-sm text-gray-500">
                      {user.email}
                    </p>
                  </div>

                  <Link
                    href="/profile"
                    onClick={() => setOpen(false)}
                    className="block px-4 py-3 hover:bg-gray-100"
                  >
                    👤 My Profile
                  </Link>

                  <Link
                    href="/orders"
                    onClick={() => setOpen(false)}
                    className="block px-4 py-3 hover:bg-gray-100"
                  >
                    📦 My Orders
                  </Link>

                  {user.role?.toLowerCase() === "admin" && (
                    <Link
                      href="/admin/dashboard"
                      onClick={() => setOpen(false)}
                      className="block border-t px-4 py-3 font-semibold text-purple-600 hover:bg-purple-50"
                    >
                      🛡️ Admin Panel
                    </Link>
                  )}


                  <button
                    onClick={handleLogout}
                    className="w-full border-t px-4 py-3 text-left text-red-500 hover:bg-red-50"
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
