import bcrypt from "bcryptjs";
const hash = await bcrypt.hash("Pumangol2026!", 12);
console.log(hash);
