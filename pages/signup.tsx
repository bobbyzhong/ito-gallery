import { useState } from "react";
import supabase from "./supabaseClient";

export default function Signup() {
    const [email, setEmail] = useState<string | undefined>();
    const [password, setPassword] = useState<string | undefined>();

    async function signUpWithEmail() {
        try {
            if (email && password) {
                const res = await supabase.auth.signUp({
                    email: email,
                    password: password,
                });
                if (res.error) throw res.error;
                const userId = res.data.user?.id;
                console.log("userID: ", userId);
            }
        } catch {}
    }
    return (
        <div className="flex w-full flex-col justify-center items-center">
            <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
            >
                Email
            </label>
            <div className="mt-1">
                <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="youremail@example.com"
                    className="block w-full rounded-md border-gray-300 shadow-sm "
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mt-4"
            >
                Password
            </label>
            <div className="mt-1">
                <input
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    name="password"
                    id="password"
                    placeholder="password"
                    className="block w-full rounded-md border-gray-300 shadow-sm "
                />
            </div>
            <button
                type="button"
                onClick={signUpWithEmail}
                className="inline-flex items-center bg-slate-500 rounded-md px-5 py-1 border border-transparent text-white shadow-sm mt-4"
            >
                Sign Up
            </button>
        </div>
    );
}
