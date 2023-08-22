export const createSalutation = (people: {name: string, isMale: boolean}[]): string => {
    const seperated = people.map(p => `liebe${p.isMale ? 'r' : ''} ${p.name}`);
    const combined = seperated.join(', ') + '.';

    return combined.charAt(0).toUpperCase() + combined.slice(1);
}