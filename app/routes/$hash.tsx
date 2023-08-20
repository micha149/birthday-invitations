import type { LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getInvitation } from "~/models/invitation.server";
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
}

export default function InvitationPage() {
    const data = useLoaderData<typeof loader>();

    return (
        <>
            <h1>Einladung</h1>
            <p>{createSalutation(data.people)}</p>
            <p>Hiermit lade ich {data.people.length === 1 ? 'dich' : 'euch'} herzlich zu meiner Gartenparty ein.</p>
        </>
    )
}