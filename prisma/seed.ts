import { db } from "@/utils/db";

async function main() {
  // await db.education.createMany({
  //   data: [
  //     {
  //       degree: "Diploma In Engineering",
  //       field: "Computer Technology",
  //       school: "Noakhali Ideal Polytechnic Institute",
  //       start: new Date("2020-01-01"),
  //       end: new Date("2025-01-04"),
  //       description:
  //         "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.",
  //     },
  //     {
  //       degree: "Secondary School Certificate",
  //       field: "Business Studies",
  //       school: "Harinarayanpur Union High School",
  //       start: new Date("2018-01-01"),
  //       end: new Date("2020-01-01"),
  //       description:
  //         "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.",
  //     },
  //     {
  //       degree: "Junior School Certificate",
  //       field: "N/A",
  //       school: "Harinarayanpur Union High School",
  //       start: new Date("2016-01-01"),
  //       end: new Date("2018-01-01"),
  //       description:
  //         "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.",
  //     },
  //   ],
  // });

  // await db.experience.createMany({
  //   data: [
  //     {
  //       company: "Divine IT Limited",
  //       role: "Software Engineer Intern",
  //       start: new Date("2024-07-01"),
  //       end: new Date("2024-11-30"),
  //       description:
  //         "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.",
  //     },
  //   ],
  // });

  await db.blog.createMany({
    data: [
      {
        title: "Blog 1",
        slug: "blog-1",
        description:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.",
        content:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.",
        tags: ["tag1", "tag2", "tag3"],
      },
      {
        title: "Blog 2",
        slug: "blog-2",
        description:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.",
        content:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.",
        tags: ["tag1", "tag2", "tag3"],
      },
      {
        title: "Blog 3",
        slug: "blog-3",
        description:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.",
        content:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.",
        tags: ["tag1", "tag2", "tag3"],
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
