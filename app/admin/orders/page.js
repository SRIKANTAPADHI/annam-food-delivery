"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL;

const statuses = [
  "pending",
  "confirmed",
  "preparing",
  "out_for_delivery",
  "delivered",
  "cancelled",
];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        `${API}/orders/admin/all`,
        {
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

      setOrders(
        Array.isArray(data)
          ? data
          : Array.isArray(data.orders)
            ? data.orders
            : []
      );

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        `${API}/orders/admin/${id}/status`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      fetchOrders();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">

      <div className="mx-auto max-w-7xl">

        <h1 className="mb-8 text-3xl font-bold flex justify-center">
          Order Management
        </h1>

        <div className="space-y-5">

          {orders.length === 0 ? (
            <div className="rounded-2xl bg-white p-10 text-center shadow">
              <p className="text-gray-500">
                No orders found
              </p>
            </div>
          ) : (
            orders.map((order) => (

              <div
                key={order._id}
                className="rounded-2xl bg-white p-6 shadow"
              >

                <div className="flex flex-col justify-between gap-4 md:flex-row">

                  <div>
                    <p className="text-sm text-gray-500">
                      Order ID
                    </p>

                    <h2 className="font-bold">
                      #{order._id}
                    </h2>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Customer
                    </p>

                    <p className="font-semibold">
                      {order.user?.name || "Customer"}
                    </p>

                    <p className="text-sm text-gray-500">
                      {order.user?.email}
                    </p>
                  </div>

                  {/* STATUS */}

                  <div>
                    <p className="mb-1 text-sm text-gray-500">
                      Status
                    </p>

                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateStatus(
                          order._id,
                          e.target.value
                        )
                      }
                      className="rounded-lg border p-2"
                    >
                      {statuses.map((status) => (
                        <option
                          key={status}
                          value={status}
                        >
                          {status.replaceAll(
                            "_",
                            " "
                          )}
                        </option>
                      ))}
                    </select>
                  </div>

                </div>

                <hr className="my-5" />

                <div>
                  <h3 className="mb-3 font-bold">
                    Ordered Items
                  </h3>

                  <div className="space-y-2">

                    {order.items?.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between rounded-lg bg-gray-50 p-3"
                      >
                        <span>
                          {item.name} × {item.quantity}
                        </span>

                        <span className="font-semibold">
                          ₹
                          {item.price *
                            item.quantity}
                        </span>
                      </div>
                    ))}

                  </div>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-3">

                  <div>
                    <p className="text-sm text-gray-500">
                      Delivery Address
                    </p>

                    <p className="font-medium">
                      {order.deliveryAddress}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Order Total
                    </p>

                    <p className="text-xl font-bold text-orange-500">
                      ₹{order.totalAmount}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Ordered On
                    </p>

                    <p>
                      {new Date(
                        order.createdAt
                      ).toLocaleString()}
                    </p>
                  </div>

                </div>

              </div>

            ))
          )}

        </div>
      </div>

    </main>
  );
}