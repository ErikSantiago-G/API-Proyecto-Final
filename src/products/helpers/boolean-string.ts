export function BooleanString(
    value: string | boolean | undefined | null
): boolean | undefined {
    if (value === true || value === "true") return true;
    if (value === false || value === "false") return false;
    return undefined;
}