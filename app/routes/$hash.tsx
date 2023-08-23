import type { LoaderArgs, ActionArgs } from "@remix-run/node";
import { Form, useActionData, useLoaderData, Link, useNavigation } from "@remix-run/react";
import { getInvitation, updateAnswers } from "~/models/invitation.server";
import { InvalidHashError, decode } from '~/util/hash.server';
import { createSalutation } from "~/util/salutation";
import { Suspense, useEffect, useState, lazy } from "react";
import GlowInk from "~/components/GlowInk";
import Button from "~/components/Button";
import InputToggle from "~/components/InputToggle";

const Hero = lazy(() => import('~/components/Hero'));

const HeroFallback = () => (
    <img className="w-full h-full object-cover" src="/fallback.webp" alt="Bild der Zahl 40" html-fetchpriority="high" />
);

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
    const [editMode, setEditMode] = useState(false);
    const navigation = useNavigation();
    const isSubmitting = navigation.state === 'submitting';

    useEffect(() => {
        if (!isSubmitting) {
            setEditMode(false);
        }
    }, [isSubmitting]);

    const pluralize = (single: string, plural: string): string => data.people.length === 1 ? single : plural;

    return (
        <div className="">

            <div className="relative h-[800px] w-screen">
                <Suspense fallback={<HeroFallback />}>
                    <Hero />
                </Suspense>
                <GlowInk as="h1" className="absolute w-full top-20 inset-x-0 text-center text-9xl transform -rotate-12 -translate-x-12">
                    Ich werde <span className="sr-only">40!</span>
                </GlowInk>
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black via-black/80" />
            </div>


            <div className="relative font-extralight tracking-wider leading-7 max-w-[40ch] mx-auto w-full -mt-32 px-8">
                <p className="mb-4 text-xl">{createSalutation(data.people)}</p>
                <p>
                    Es ist soweit, ich werde vierzig. Ich lade {pluralize('dich', 'euch')} herzlich ein, dieses
                    unfassbare Ereignis mit mir zu feiern.
                </p>

                <GlowInk as="h2" className="mt-10 mb-4 text-center">
                    Wann und wo?
                </GlowInk>
                <p className="my-4 text-xl text-center whitespace-nowrap">Samstag, 16. September – 18 Uhr </p>
                <div className="flex justify-center">
                    <p className="content">
                        Bei uns im Garten<br />
                        Nobelstraße 64<br />
                        53757 Sankt Augustin
                    </p>
                </div>
                <p className="my-8 text-center">
                    <Button as={Link}  to="./ical" reloadDocument className="">
                        Im Kalender speichern
                    </Button>
                </p>

                <GlowInk as="h2" className="mt-10 mb-4 text-center">
                    Geschenke?
                </GlowInk>
                <p className="mt-8">
                    Bares wäre mir sehr willkommen, so kann
                    ich mir einen meiner teureren Wünsche erfüllen.
                </p>

                <GlowInk as="h2" className="mt-10 mb-4 text-center">
                    Antwort!
                </GlowInk>
                <p>Bitte {pluralize('gib', 'gebt')} mir bis zum 9. September Bescheid, ob ich mit {pluralize('dir', 'euch')} rechnen kann.</p>

                <Form className="mb-8" method="POST">
                    <div className="divide-y divide-dashed divide-black mt-8 mb-4">
                        {data.people.map(p => (
                            <InputToggle
                                disabled={data.answered && !editMode}
                                key={p.id}
                                className="flex"
                                label={p.name}
                                value={p.id}
                                name="people"
                                defaultChecked={p.willCome}
                            />
                        ))}
                    </div>
                    {!data.answered || editMode ? (
                        <Button className="block mx-auto" type="submit">
                            {isSubmitting ? 'Speichere…' : data.answered ? 'Aktualisieren' :'Antwort speichern'}
                        </Button>
                    ) : (
                        <>
                            <p className="text-center text-sm">Danke für {pluralize('deine', 'eure')} Antwort!</p>
                            <button className="p-4 block mx-auto underline" type="button" onClick={() => setEditMode(true)}>Antwort ändern</button>
                        </>
                    )}
                </Form>

                {data.answered && data.people.every(p => !p.willCome) ? (
                    <p>Schade, dass {pluralize('du', 'ihr')} nicht dabei sein {pluralize('kannst', 'könnt')}.</p>

                ) : (
                    <p>Ich freue mich auf einen tollen Abend mit {pluralize('dir', 'euch')}!</p>
                )}

                <GlowInk className="mt-8 mb-20 text-right transform -rotate-12">{pluralize('Dein', 'Euer')} Michael</GlowInk>
            </div>


        </div>
    )
}