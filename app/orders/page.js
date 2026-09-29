
"use client";

import { useEffect, useState } from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          window.location.href = "/login";
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/orders/my-orders`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          console.error(data.message);
          return;
        }

        setOrders(data.orders || []);
      } catch (error) {
        console.error("Fetch orders error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <main className="p-6">
        <h1 className="text-3xl font-bold mb-6">
          My Orders
        </h1>

        <p>Loading orders...</p>
      </main>
    );
  }

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        My Orders
      </h1>

      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              className="border rounded-xl p-5 shadow-sm"
              key={order._id}
            >
              <p>
                <strong>Order ID:</strong>{" "}
                {order._id}
              </p>

              <p>
                <strong>Total:</strong>{" "}
                ₹{order.totalAmount}
              </p>

              <p className="font-semibold">
                Status:{" "}
                <span>{order.status}</span>
              </p>

              <p>
                <strong>Date:</strong>{" "}
                {new Date(
                  order.createdAt
                ).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

