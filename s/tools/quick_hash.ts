
export async function quick_hash(file: File): Promise<string> {
	const array_buffer = await file.arrayBuffer()
	const hash = await crypto.subtle.digest("SHA-256", array_buffer)
	const hash_array = Array.from(new Uint8Array(hash))
	const hash_hex = hash_array.map(b => b.toString(16).padStart(2, "0")).join("")
	return hash_hex
}

