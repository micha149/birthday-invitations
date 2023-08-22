import { createCookieSessionStorage, redirect } from "@remix-run/node";

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
});

export async function getSession(request: Request) {
    const cookie = request.headers.get("Cookie");
    return sessionStorage.getSession(cookie);
}

export async function requireAuthentication(
    request: Request,
    redirectTo: string = new URL(request.url).pathname,
) {
    const session = await getSession(request);

    if (!session.get('authenticated')) {
        const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
        throw redirect(`/login?${searchParams}`);
    }
    return session;
}

export async function createSession({
  request,
  remember,
  redirectTo,
}: {
  request: Request;
  remember: boolean;
  redirectTo: string;
}) {
    const session = await getSession(request);
    session.set('authenticated', true);
    return redirect(redirectTo, {
        headers: {
            'Set-Cookie': await sessionStorage.commitSession(session, {
            maxAge: remember
                ? 60 * 60 * 24 * 7 // 7 days
                : undefined,
            }),
        },
    });
}

export async function logout(request: Request) {
    const session = await getSession(request);
    return redirect('/', {
        headers: {
            'Set-Cookie': await sessionStorage.destroySession(session),
        },
    });
}