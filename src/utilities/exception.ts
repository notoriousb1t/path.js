/**
 * Raises an exception.  This is more or less to improve minification
 * @param message 
 */
export function raiseError(message: string): never {
	throw new Error(message);
}
