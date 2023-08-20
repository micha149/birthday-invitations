import Hashids from 'hashids';

const hashid = new Hashids(process.env.HASH_IDS_SALT, 6);

export class InvalidHashError extends Error { }

export function encode(id: number): string {
    return hashid.encode(id);
}

export function decode(hash: string): number {
    const id = hashid.decode(hash)[0];

    if (!id || typeof id === "bigint") {
        throw new InvalidHashError();
    }

    return id;
}
