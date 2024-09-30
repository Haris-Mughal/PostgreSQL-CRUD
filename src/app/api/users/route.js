import { query } from "@/app/lib/db";

export async function GET(request) {
    try {
        const result = await query("SELECT * FROM users");
        return new Response(JSON.stringify(result.rows), {
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

export async function POST(request) {
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
            "INSERT INTO users (name, email, age, image) VALUES ($1, $2, $3, $4) RETURNING *",
            [name, email, age, image]
        );

        return new Response(JSON.stringify(result.rows[0]), {
            status: 201,
            headers: { "Content-Type": "application/json" },
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
