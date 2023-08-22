import type { ActionArgs, LoaderArgs} from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { listInvitations, createInvitation } from "~/models/invitation.server"
import { requireAuthentication } from "~/session.server";
import { encode } from "~/util/hash.server";

export const loader = async ({ request }: LoaderArgs) => {
    await requireAuthentication(request);

    const invitations = await listInvitations();

    return invitations.map(row => ({
        hash: encode(row.id),
        ...row
    }))
}

export const action = async({ request }: ActionArgs) => {
    const body = await request.formData();
    const action = body.get('_action');

    if (action === 'create') {
        const invitation = await createInvitation();
        return redirect(`./${encode(invitation.id)}`)
    }

    return null;
}

export default function AdminPage() {
    const data = useLoaderData<typeof loader>();

    return (
        <>
            <table>
                <tbody>
                    {data.map(row => (
                        <tr key={row.id}>
                            <td><a href={`/${row.hash}`}>{row.hash}</a></td>
                            <td>{row.people.map(p => p.name).join(', ')}</td>
                            <td><Link to={`./${row.hash}`}>Bearbeiten</Link></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Form method="POST">
                <button type="submit" name="_action" value="create">Neue Einladung</button>
            </Form>
        </>
    )
}