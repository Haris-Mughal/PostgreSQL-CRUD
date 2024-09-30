import { query } from "@/app/lib/db";

export async function PUT(request, { params }) {
    const { id } = params;
    const { name, email, age, image } = await request.json();

    if (!name || !email || !age) {
        return new Response(
            JSON.stringify({ error: "Name, email, and age are required" }),
            {
                status: 400,
                headers: { "Content-Type": "application/json" },
            }
        );
    }

    try {
        const result = await query(
            "UPDATE users SET name = $1, email = $2, age = $3, image = $4 WHERE id = $5 RETURNING *",
            [name, email, age, image, id]
        );

        return new Response(JSON.stringify(result.rows[0]), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}

export async function DELETE(request, { params }) {
    const { id } = params;

    try {
        const result = await query(
            "DELETE FROM users WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rowCount === 0) {
            return new Response(JSON.stringify({ error: "User not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        return new Response(JSON.stringify({ message: "User deleted" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
