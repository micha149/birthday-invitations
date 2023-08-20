import { prisma } from "~/db.server";

export async function getInvitation(id: number) {
    return await prisma.invitation.findUnique({
        where: { id },
        include: { people: true },
    });
}
