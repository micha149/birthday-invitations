import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { Form, useLoaderData, Link, useNavigation } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { getInvitation, addPerson, removePerson } from "~/models/invitation.server"
import { InvalidHashError, decode } from "~/util/hash.server";

export const loader = async ({ params }: LoaderArgs) => {
    let invitation: Awaited<ReturnType<typeof getInvitation>> = null;

    try {
        const id = decode(params.hash!);
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

export const action = async({ params, request }: ActionArgs) => {
    const invitationId = decode(params.hash!);
    const body = await request.formData();
    const action = body.get('_action');

    if (action === 'create') {
        const name = body.get('name');
        const gender = body.get('gender');

        if (!name || !gender) {
            throw new Response(null, { status: 400 });
        }

        await addPerson(invitationId, name, gender === 'male');
    } else if (action === 'remove') {
        const id = body.get('person');
        await removePerson(invitationId, parseInt(id, 10));
    }

    return true;
}

export default function AdminPage() {
    const { people } = useLoaderData<typeof loader>();
    const formRef = useRef<HTMLFormElement>(null);
    const navigation = useNavigation();
    const isAdding = navigation.state === 'submitting' && navigation.formData?.get('_action') === 'create';

    useEffect(() => {
        if (!formRef.current) {
            return;
        }

        if (!isAdding) {
            formRef.current.reset();
            formRef.current.querySelector<HTMLElement>('[name="name"]')?.focus();
        }
    }, [isAdding])

    return (
        <>
            <Link to="/admin">&lt; Zurück</Link>
            <table>
                <tbody>
                    {people.map(person => (
                        <tr key={person.id}>
                            <td>{person.name}, {person.isMale ? 'Er' : 'Sie'}</td>
                            <td>
                                <Form method="POST">
                                    <input type="hidden" name="person" value={person.id} />
                                    <button type="submit" name="_action" value="remove">Entfernen</button>
                                </Form>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Form ref={formRef} replace method="POST">
                <input type="text" name="name" required />
                <label>
                    <input type="radio" name="gender" value="male" defaultChecked />
                    Er
                </label>
                <label>
                    <input type="radio" name="gender" value="female" />
                    Sie
                </label>
                <button type="submit" name="_action" value="create">Hinzufügen</button>
            </Form>
        </>
    )
}