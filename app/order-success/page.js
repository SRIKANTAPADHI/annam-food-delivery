"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function OrderSuccess() {
  const searchParams = useSearchParams();

  const orderId = searchParams.get("id");

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-6">

      <div className="w-full max-w-lg rounded-3xl bg-white p-10 text-center shadow">

        <div className="text-6xl">
          ✅
        </div>

        <h1 className="mt-6 text-3xl font-bold">
          Order Placed!
        </h1>

        <p className="mt-3 text-gray-500">
          Your order has been successfully placed.
        </p>

        {orderId && (
          <div className="mt-6 rounded-xl bg-gray-50 p-4">
            <p className="text-sm text-gray-500">
              Order ID
            </p>

            <p className="mt-1 break-all font-bold">
              #{orderId}
            </p>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3">

          <Link
            href={`/orders/${orderId}`}
            className="rounded-xl bg-orange-500 py-3 font-semibold text-white hover:bg-orange-600"
          >
            Track Order
          </Link>

          <Link
            href="/orders"
            className="rounded-xl border py-3 font-semibold hover:bg-gray-50"
          >
            My Orders
          </Link>

          <Link
            href="/foods"
            className="rounded-xl border py-3 font-semibold hover:bg-gray-50"
          >
            Continue Shopping
          </Link>

        </div>

      </div>

    </main>
  );
}