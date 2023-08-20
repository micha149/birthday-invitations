import type { LoaderArgs, ActionArgs } from "@remix-run/node";
import { Form, useActionData, useLoaderData, Link } from "@remix-run/react";
import { getInvitation, updateAnswers } from "~/models/invitation.server";
import { InvalidHashError, decode } from '~/util/hash.server';
import { createSalutation } from "~/util/salutation";

export const loader = async ({ params, request }: LoaderArgs) => {
    let id: number;
    let invitation: Awaited<ReturnType<typeof getInvitation>> = null;

    try {
        id = decode(params.hash!);
        invitation = await getInvitation(id);
    } catch (e) {
        if (!(e instanceof InvalidHashError)) {
            throw e;
        }
    }

    if (!invitation) {
        throw new Response(null, {
            status: 404,
            statusText: "Not Found",
        });
    }

    return invitation;
};

export const action = async ({params, request}: ActionArgs) => {
    const body = await request.formData();
    const id = decode(params.hash!);

    await updateAnswers(id, body.getAll('people').map(x => parseInt(x as string, 10)));

    return true
};

export default function InvitationPage() {
    const data = useLoaderData<typeof loader>();
    const saved = useActionData<typeof action>();

    return (
        <>
            <h1>Einladung</h1>
            <p>{createSalutation(data.people)}</p>
            <p>Hiermit lade ich {data.people.length === 1 ? 'dich' : 'euch'} herzlich zu meiner Gartenparty ein.</p>
            <Link to="./ical" reloadDocument>Kalender herunterladen</Link>
            <Form method="POST">
                {data.people.map(p => (
                    <label key={p.id} className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" name="people" value={String(p.id)} defaultChecked={p.willCome} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">{p.name}</span>
                    </label>
                ))}
                <button type="submit">Antwort speichern</button>
            </Form>
            {saved ? 'Gespeichert!' : ''}
        </>
    )
}