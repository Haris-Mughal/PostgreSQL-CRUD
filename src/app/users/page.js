"use client";

import { useEffect, useState, useRef } from "react";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [age, setAge] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [editId, setEditId] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const res = await fetch("/api/users");
        const data = await res.json();
        setUsers(data);
    };

    const deleteUser = async (id) => {
        const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
        if (res.ok) fetchUsers();
    };

    const clearForm = () => {
        setName("");
        setEmail("");
        setAge("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !email || !age) return alert("All fields are required");

        setIsLoading(true);

        const url = editId ? `/api/users/${editId}` : "/api/users";
        const method = editId ? "PUT" : "POST";

        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, age }),
        });

        if (res.ok) {
            clearForm();
            setEditId(null);
            fetchUsers();
        }

        setIsLoading(false);
    };

    return (
        <div className="py-10 flex flex-col justify-center items-center">
            <h1 className="text-[62px] font-bold mb-4">CRUD</h1>

            <form
                onSubmit={handleSubmit}
                className="mb-8 w-full max-w-lg bg-white p-6 rounded-lg shadow-md"
            >
                <h2 className="text-3xl text-center font-bold mb-4 text-gray-800">
                    {editId ? "Update" : "Add"}
                </h2>

                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Name"
                        className="border border-gray-300 font-semibold p-3 w-full text-black rounded-lg focus:outline-none focus:border-blue-500 transition duration-300"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className="mb-4">
                    <input
                        type="email"
                        placeholder="Email"
                        className="border border-gray-300 font-semibold p-3 w-full text-black rounded-lg focus:outline-none focus:border-blue-500 transition duration-300"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="mb-4">
                    <input
                        type="number"
                        placeholder="Age"
                        className="border border-gray-300 font-semibold p-3 w-full text-black rounded-lg focus:outline-none focus:border-blue-500 transition duration-300"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                    />
                </div>

                <button
                    type="submit"
                    className={`w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold transition duration-300 ${
                        isLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={isLoading}
                >
                    {isLoading
                        ? "Processing..."
                        : editId
                        ? "Update User"
                        : "Add User"}
                </button>
            </form>

            <div className="w-full py-10 flex justify-center items-center">
                <div className="w-3/4">
                    <table className="table-auto w-full border border-gray-300 rounded-lg overflow-hidden shadow-md">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-3 px-6 font-bold text-xl text-left text-gray-800">
                                    #
                                </th>
                                <th className="py-3 px-6 font-bold text-xl text-left text-gray-800">
                                    Name
                                </th>
                                <th className="py-3 px-6 font-bold text-xl text-left text-gray-800">
                                    Email
                                </th>
                                <th className="py-3 px-6 font-bold text-xl text-left text-gray-800">
                                    Age
                                </th>
                                <th className="py-3 px-6 font-bold text-xl text-center text-gray-800">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length > 0 ? (
                                users.map((user, i) => (
                                    <tr
                                        key={i}
                                        className="bg-white border-b hover:bg-gray-50 transition"
                                    >
                                        <td className="py-3 px-6 font-semibold text-gray-800">
                                            {i + 1}
                                        </td>
                                        <td className="py-3 px-6 font-semibold text-gray-800">
                                            {user.name}
                                        </td>
                                        <td className="py-3 px-6 font-semibold text-gray-800">
                                            {user.email}
                                        </td>
                                        <td className="py-3 px-6 font-semibold text-gray-800">
                                            {user.age}
                                        </td>
                                        <td className="flex justify-center gap-2 py-3">
                                            <button
                                                onClick={() => {
                                                    setEditId(user.id);
                                                    setName(user.name);
                                                    setEmail(user.email);
                                                    setAge(user.age);
                                                }}
                                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded transition"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() =>
                                                    deleteUser(user.id)
                                                }
                                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded transition"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="py-3 px-6 text-center text-gray-500"
                                    >
                                        No users found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
