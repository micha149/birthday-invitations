import { useLoaderData } from "@remix-run/react";
import { listInvitations } from "~/models/invitation.server"
import { encode } from "~/util/hash.server";

export const loader = async () => {
    const invitations = await listInvitations();
    return invitations.map(row => ({
        hash: encode(row.id),
        ...row
    }))
}

export default function AdminPage() {
    const data = useLoaderData<typeof loader>();

    return (
        <table>
            <tbody>
                {data.map(row => (
                    <tr key={row.id}>
                        <td><a href={`/${row.hash}`}>{row.hash}</a></td>
                        <td>{row.people.map(p => p.name).join(', ')}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}