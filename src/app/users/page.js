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
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">User Management</h1>

            <form onSubmit={handleSubmit} className="mb-4">
                <input
                    type="text"
                    placeholder="Name"
                    className="border p-2 mb-2 w-full"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="email"
                    placeholder="Email"
                    className="border p-2 mb-2 w-full"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Age"
                    className="border p-2 mb-2 w-full"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                />
                <button
                    type="submit"
                    className={`bg-blue-500 text-white px-4 py-2 rounded ${
                        isLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={isLoading}
                >
                    {editId ? "Update User" : "Add User"}
                </button>
            </form>

            <div className="space-y-2">
                {users.length > 0 ? (
                    users.map((user) => (
                        <div key={user.id} className="p-4 border rounded">
                            <p>
                                <strong>Name:</strong> {user.name}
                            </p>
                            <p>
                                <strong>Email:</strong> {user.email}
                            </p>
                            <p>
                                <strong>Age:</strong> {user.age}
                            </p>
                            <div className="space-x-2">
                                <button
                                    onClick={() => {
                                        setEditId(user.id);
                                        setName(user.name);
                                        setEmail(user.email);
                                        setAge(user.age);
                                    }}
                                    className="bg-yellow-500 text-white px-4 py-1 rounded"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => deleteUser(user.id)}
                                    className="bg-red-500 text-white px-4 py-1 rounded"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No users found</p>
                )}
            </div>
        </div>
    );
}
