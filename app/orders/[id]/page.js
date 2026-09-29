"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL;

const statuses = [
  "pending",
  "confirmed",
  "preparing",
  "out_for_delivery",
  "delivered",
];

const statusLabels = {
  pending: "Order Placed",
  confirmed: "Confirmed",
  preparing: "Preparing",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          router.push("/login");
          return;
        }

        const response = await fetch(`${API}/orders/${params.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch order");
        }

        setOrder(data);
      } catch (error) {
        console.error("Fetch order error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchOrder();
    }
  }, [params.id, router]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-orange-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500" />
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="min-h-screen bg-orange-50 px-4 py-12">
        <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 text-center shadow">
          <div className="text-5xl">😕</div>

          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            Order Not Found
          </h1>

          <p className="mt-2 text-gray-500">
            {error || "Unable to load this order."}
          </p>

          <Link
            href="/orders"
            className="mt-6 inline-block rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600"
          >
            My Orders
          </Link>
        </div>
      </main>
    );
  }

  const currentIndex = statuses.indexOf(order.status);

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl">

        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-orange-500">
              Order Details
            </p>

            <h1 className="mt-1 text-3xl font-extrabold text-gray-900">
              Order #{order._id.slice(-6).toUpperCase()}
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              {order.createdAt
                ? new Date(order.createdAt).toLocaleString()
                : ""}
            </p>
          </div>

          <Link
            href="/orders"
            className="rounded-xl border border-gray-300 bg-white px-5 py-3 text-center font-semibold text-gray-700 hover:bg-gray-50"
          >
            ← My Orders
          </Link>
        </div>

        {order.status === "cancelled" ? (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-6">
            <h2 className="text-xl font-bold text-red-700">
              Order Cancelled
            </h2>

            <p className="mt-1 text-red-600">
              This order has been cancelled.
            </p>
          </div>
        ) : (

          <div className="mb-6 rounded-2xl bg-white p-6 shadow-md">
            <h2 className="mb-6 text-xl font-bold text-gray-900">
              Order Status
            </h2>

            <div className="space-y-5">
              {statuses.map((status, index) => {
                const completed =
                  index <= currentIndex;

                return (
                  <div
                    key={status}
                    className="flex items-center gap-4"
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold ${completed
                          ? "bg-orange-500 text-white"
                          : "bg-gray-200 text-gray-500"
                        }`}
                    >
                      {completed ? "✓" : index + 1}
                    </div>

                    <div>
                      <p
                        className={`font-semibold ${completed
                            ? "text-gray-900"
                            : "text-gray-400"
                          }`}
                      >
                        {statusLabels[status]}
                      </p>

                      {status === order.status && (
                        <p className="text-sm text-orange-500">
                          Current status
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">

          <div className="lg:col-span-2">
            <div className="rounded-2xl bg-white p-6 shadow-md">
              <h2 className="mb-5 text-xl font-bold text-gray-900">
                Ordered Items
              </h2>

              <div className="space-y-4">
                {order.items?.map((item, index) => (
                  <div
                    key={item._id || index}
                    className="flex items-center justify-between border-b pb-4 last:border-b-0 last:pb-0"
                  >
                    <div className="flex items-center gap-4">
                      {item.food?.image ? (
                        <img
                          src={item.food.image}
                          alt={item.name}
                          className="h-16 w-16 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-orange-100 text-2xl">
                          🍔
                        </div>
                      )}

                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {item.name || item.food?.name}
                        </h3>

                        <p className="text-sm text-gray-500">
                          ₹{item.price} × {item.quantity}
                        </p>
                      </div>
                    </div>

                    <p className="font-bold text-gray-900">
                      ₹{item.price * item.quantity}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-white p-6 shadow-md">
              <h2 className="mb-3 text-xl font-bold text-gray-900">
                Delivery Address
              </h2>

              <p className="text-gray-600">
                {order.deliveryAddress || "Address not available"}
              </p>
            </div>
          </div>

          <div>
            <div className="sticky top-6 rounded-2xl bg-white p-6 shadow-md">
              <h2 className="mb-5 text-xl font-bold text-gray-900">
                Payment Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-semibold">
                    ₹{order.subtotal || 0}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Delivery Fee
                  </span>
                  <span className="font-semibold">
                    ₹{order.deliveryFee || 0}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Tax</span>
                  <span className="font-semibold">
                    ₹{order.tax || 0}
                  </span>
                </div>

                <div className="my-4 border-t" />

                <div className="flex justify-between text-lg">
                  <span className="font-bold">Total</span>
                  <span className="font-extrabold text-orange-600">
                    ₹{order.totalAmount || 0}
                  </span>
                </div>
              </div>

              <div className="mt-6 rounded-xl bg-green-50 p-4 text-center">
                <p className="text-sm text-green-600">
                  Payment
                </p>

                <p className="font-bold text-green-700">
                  Cash on Delivery
                </p>
              </div>

              <Link
                href="/foods"
                className="mt-5 block rounded-xl bg-orange-500 px-4 py-3 text-center font-bold text-white hover:bg-orange-600"
              >
                Continue Shopping
              </Link>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}