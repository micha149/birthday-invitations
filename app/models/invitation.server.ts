import { prisma } from "~/db.server";

export async function getInvitation(id: number) {
    return await prisma.invitation.findUnique({
        where: { id },
        include: { people: true },
    });
}

export async function listInvitations() {
    return prisma.invitation.findMany({
        include: { people: true },
    });
}

export async function updateAnswers(invitationId: number, coming: number[]) {
    const people = await prisma.people.findMany({ where: { invitationId }});

    await prisma.$transaction([
        prisma.invitation.update({
            where: {
                id: invitationId,
            },
            data: {
                answered: true,
            }
        }),
        ...people.map(p => (prisma.people.update({
            where: {
                id: p.id,
                invitationId,
            },
            data: {
                willCome: coming.includes(p.id),
            },
        })))
    ])
}

export async function createInvitation() {
    return prisma.invitation.create({
        data: {
            answered: false,
        }
    });
}

export async function addPerson(invitationId: number, name: string, isMale: boolean) {
    return prisma.people.create({
        data: {
            invitationId,
            name,
            isMale,
        }
    });
}

export async function removePerson(invitationId: number, id: number,) {
    return prisma.people.delete({
        where: {
            invitationId,
            id
        }
    });
}
