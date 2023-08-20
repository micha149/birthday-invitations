import type { LoaderArgs } from "@remix-run/node"
import type { EventAttributes, EventStatus } from 'ics';
import { createEvent } from 'ics';
import { getInvitation } from "~/models/invitation.server";
import { InvalidHashError, decode } from "~/util/hash.server";

const createIcsResponse = (event: EventAttributes) => new Promise((resolve, reject) => {
    createEvent(event, (error, value) => {
      if (error) {
          reject(error)
      }

      resolve(new Response(value, {headers: { 'Content-Type': 'text/calendar', 'Content-Disposition': 'attachment; filename="michaels-40ster.ics"' } }))
    })
});

const getEventStatus = (invitation: { answered: boolean, people: { willCome: boolean }[] }): EventStatus => {
    if (!invitation.answered) {
        return 'TENTATIVE';
    }

    if (invitation.people.some(p => p.willCome)) {
        return 'CONFIRMED';
    }

    return 'CANCELLED';
}

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

    return createIcsResponse({
        start: [2023, 9, 16, 18, 0],
        duration: { hours: 6 },
        busyStatus: 'BUSY',
        status: getEventStatus(invitation),
        geo: { lat: 50.783449704554485, lon: 7.156723831526755 },
        location: 'Nobelstraße 64, 53757 Sankt Augustin',
        title: 'Michaels Geburtagsparty',
        description: 'Michael wird 40. Das wird im Garten gefeiert!'
    });
};

