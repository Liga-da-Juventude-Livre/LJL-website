import { db } from "./seed/client";
import { seedCore } from "./seed/core";
import { seedDemo } from "./seed/demo";
import { seedSamples } from "./seed/samples";

//   npm run db:seed        core + sample content: fronts, the PUC-Rio chapter, the library and its free editions, the first
//                          administrator from the environment, six sample articles and three published tracks/courses
//   npm run db:seed:core   only the core (no sample content): for a database that should start empty of examples
//   npm run db:seed:demo   everything above plus sample LOGINS (admin, editor, authors) with a shared password: development only
async function main() {
  const samples = !process.argv.includes("--no-samples");
  await seedCore({ publishTrack: samples });
  if (samples) await seedSamples();
  if (process.argv.includes("--demo")) await seedDemo();
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
