const bcrypt = require('bcryptjs');
async function main() {
  const superHash  = await bcrypt.hash('Admin@123', 10);
  const tenantHash = await bcrypt.hash('Venue@123', 10);
  console.log(JSON.stringify({ superHash, tenantHash }));
}
main();
