export function parseEntityId(name: string, prefix: string): string | null {
    if (name?.startsWith(prefix)) {
        return name.replace(prefix, "");
    }
    return null;
}
