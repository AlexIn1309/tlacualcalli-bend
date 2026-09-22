/* Generacion random de un UUID */

export function generateUUID(): string {
	return crypto.randomUUID();
}
