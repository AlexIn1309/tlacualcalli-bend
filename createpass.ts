// PARA EJECUTAR ESTE ARCHIVO ES NECESARIO
// bun dev createpass.ts
import bcrypt from "bcryptjs";

(async () => {
	console.log(await bcrypt.hash("password123",12));
})();

export default { async fetch() {
	return new Response("OK");
}};
