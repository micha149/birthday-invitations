import type { ActionArgs, LoaderArgs} from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { listInvitations, createInvitation } from "~/models/invitation.server"
import { requireAuthentication } from "~/session.server";
import { encode } from "~/util/hash.server";
import Button from "~/components/Button";

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
            <div className="grid grid-cols-6 gap-5 mb-8 text-white">
                <div className="flex flex-col items-center justify-around bg-gradient-to-t from-fuchsia-700 to-fuchsia-500 p-4 aspect-square">
                    <p className="text-9xl font-thin">{data.filter(row => !row.answered).length}</p>
                    <p className="text-3xl">Ausstehend</p>
                </div>
                <div className="flex flex-col items-center justify-around bg-gradient-to-t from-indigo-700 to-indigo-500 p-4 aspect-square">
                    <p className="text-9xl font-thin">{data.filter(row => row.answered).flatMap(row => row.people).filter(p => p.willCome).length}</p>
                    <p className="text-3xl">Gäste</p>
                </div>
            </div>
            <table className="w-1/3 mb-8">
                <tbody>
                    {data.map(row => (
                        <tr key={row.id}>
                            <td><a href={`/${row.hash}`}>{row.hash}</a></td>
                            <td>{row.people.map(p => p.name).join(', ')}</td>
                            <td>
                                {row.answered ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="text-lime-500 w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                ) : null}
                            </td>
                            <td><Link to={`./${row.hash}`}>Bearbeiten</Link></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Form method="POST">
                <Button type="submit" name="_action" value="create">Neue Einladung</Button>
            </Form>
        </>
    )
}