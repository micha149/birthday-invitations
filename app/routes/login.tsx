import type { ActionArgs } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { createSession } from "~/session.server";

export const action = async ({ request }: ActionArgs) => {
    const data = await request.formData();

    if (data.get('password') !== process.env.ROOT_PASSWORD) {
        throw new Response(null, { status: 400 });
    }

    return createSession({ request, remember: true, redirectTo: '/admin' });
};

export default function LoginPage() {
    return (
        <Form method="POST">
            <input type="password" name="password" />
            <button type="submit">Anmelden</button>
        </Form>
    )
}