
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Register() {
    const router = useRouter();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const API = process.env.NEXT_PUBLIC_API_URL;
        try {
            const res = await fetch(`${API}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            }
            );

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || "Registration failed");
                return;
            }

            alert("Registration successful");

            router.push("/login");
        } catch (error) {
            console.error(error);
            alert("Server error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg"
            >
                <h1 className="mb-2 text-3xl font-bold">
                    Create Account
                </h1>

                <p className="mb-6 text-gray-500">
                    Register for your Food Delivery account
                </p>

                <input
                    type="text"
                    placeholder="Full name"
                    value={form.name}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            name: e.target.value,
                        })
                    }
                    className="mb-4 w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-orange-400"
                    required
                />

                <input
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            email: e.target.value,
                        })
                    }
                    className="mb-4 w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-orange-400"
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            password: e.target.value,
                        })
                    }
                    className="mb-6 w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-orange-400"
                    required
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-lg bg-orange-500 py-3 font-semibold text-white hover:bg-orange-600 disabled:opacity-50"
                >
                    {loading ? "Creating..." : "Register"}
                </button>

                <p className="mt-5 text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        className="font-semibold text-orange-500 hover:underline"
                    >
                        Login
                    </Link>
                </p>
            </form>
        </div>
    );
}

