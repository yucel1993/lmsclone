const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();

async function main() {
  try {
    await database.category.createMany({
      data: [
        { name: "Computer Science" },
        { name: "Music" },
        { name: "Fitness" },
        { name: "Photography" },
        { name: "Accounting" },
        { name: "Engineering" },
        { name: "Filming" },
      ],
    });
    console.log("Success");
  } catch (error) {
    console.log("Error");
  } finally {
    await database.$disconnect();
  }
}

main();

//* then shut down the terminal and write this $ node scripts/seed.ts
//* then you will see the success text which mean that everything is okey
