import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {

  await prisma.quiz.deleteMany();

  await prisma.quiz.createMany({
    data: [
      { title: "Algebra Basics", subject: "Math", difficulty: "Medium", duration: 60 },
      { title: "Newton's Laws", subject: "Science", difficulty: "Hard", duration: 75 },
      { title: "World War II", subject: "History", difficulty: "Easy", duration: 90 },
      { title: "Probability Theory", subject: "Math", difficulty: "Hard", duration: 80 },
    ],
  });

  const quizzes = await prisma.quiz.findMany();
  await prisma.question.createMany({
    data: [
      { quizId: quizzes[0].id, text: "What is 2 + 2?", options: ["3", "4", "5"], answer: "4" },
      { quizId: quizzes[0].id, text: "Solve x: 3x = 9", options: ["1", "2", "3"], answer: "3" },
      { quizId: quizzes[1].id, text: "The formula F=ma represents which of Newton’s Laws?", options: ["First Law", "Second Law", "Third Law"], answer: "Second Law" },
      { quizId: quizzes[1].id, text: "A rocket launches by expelling gas downwards, propelling itself upwards. Which law does this illustrate?", options: ["First Law", "Second Law", "Third Law"], answer: "Third Law" },
      { quizId: quizzes[2].id, text: "In which year did World War II begin?", options: ["1914","1939","1947"], answer: "1939" },
      { quizId: quizzes[2].id, text: "Which two Japanese cities were bombed with atomic bombs by the United States in 1945?", options: ["Tokyo and Kyoto","Hiroshima and Nagasaki","Osaka and Nara"], answer: "Hiroshima and Nagasaki" },
      { quizId: quizzes[3].id, text: "If you flip a fair coin, what is the probability of getting heads?", options: ["0.5","0","1"], answer: "0.5" },
      { quizId: quizzes[3].id, text: "The probability of an impossible event occurring is:", options: ["1", "0.5", "0"], answer: "0" }
    ],
  });

  await prisma.category.upsert({
    where: { name: "Math" },
    update: {},
    create: {
      name: "Math",
      topics: {
        create: [
          {
            name: "Trigonometry",
            imageUrl: "https://t4.ftcdn.net/jpg/00/55/58/41/360_F_55584182_yYGnmk8WELSWVaBHDZKgwsfFNm217M5v.jpg",
            subtopics: {
              create: [
                {
                  name: "Sine and Cosine",
                  videos: {
                    create: [{ name: "Sine and Cosine", url: "https://www.youtube.com/embed/bAerID24QJ0" }]
                  }
                },
                {
                  name: "Tangent and Cotangent",
                  videos: {
                    create: [{ name: "Tangent and Cotangent", url: "https://www.youtube.com/embed/bAerID24QJ0" }]
                  }
                }
              ]
            }
          },
          {
            name: "Geometry",
            imageUrl: "https://www.piqosity.com/wp-content/uploads/2022/12/Depositphotos_400945552_L-e1658434781329-1024x599.jpg",
            subtopics: {
              create: [
                {
                  name: "Triangles",
                  videos: {
                    create: [{ name: "Triangles", url: "https://www.youtube.com/embed/bAerID24QJ0" }]
                  }
                },
                {
                  name: "Circles",
                  videos: {
                    create: [{ name: "Circles", url: "https://www.youtube.com/embed/bAerID24QJ0" }]
                  }
                }
              ]
            }
          },
          {
            name: "Algebra",
            imageUrl: "https://demmelearning.com/wp-content/uploads/2024/08/algebra-1-prep.jpg",
            subtopics: {
              create: [
                {
                  name: "Linear Equations",
                  videos: {
                    create: [{ name: "Linear Equations", url: "https://www.youtube.com/embed/tHm3X_Ta_iE" }]
                  }
                },
                {
                  name: "Linear Inequalities",
                  videos: {
                    create: [{ name: "Linear Inequalities", url: "https://www.youtube.com/embed/DrZJKdXlZ3I" }]
                  }
                }
              ]
            }
          }
        ]
      }
    }
  });

  // Science Category
  await prisma.category.upsert({
    where: { name: "Science" },
    update: {},
    create: {
      name: "Science",
      topics: {
        create: [
          {
            name: "Physics",
            imageUrl: " https://www.shutterstock.com/shutterstock/photos/1988419205/display_1500/stock-vector-physics-chalkboard-background-in-hand-drawn-style-round-composition-with-lettering-and-physical-1988419205.jpg",
            subtopics: {
              create: [
                {
                  name: "Newton's Laws",
                  videos: {
                    create: [{ name: "Newton's Laws", url: "https://www.youtube.com/embed/bAerID24QJ0" }]
                  }
                },
                {
                  name: "Thermodynamics",
                  videos: {
                    create: [{ name: "Thermodynamics", url: "https://www.youtube.com/embed/bAerID24QJ0" }]
                  }
                }
              ]
            }
          },
          {
            name: "Biology",
            imageUrl: " https://img.freepik.com/premium-vector/biology-doodle-set-collection-hand-drawn-elements-science-biology-isolated-white-background_308665-1569.jpg",
            subtopics: {
              create: [
                {
                  name: "Cell Structure",
                  videos: {
                    create: [{ name: "Cell Structure", url: "https://www.youtube.com/embed/bAerID24QJ0" }]
                  }
                },
                {
                  name: "DNA and Genetics",
                  videos: {
                    create: [{ name: "DNA and Genetics", url: "https://www.youtube.com/embed/bAerID24QJ0" }]
                  }
                }
              ]
            }
          },
          {
            name: "Chemistry",
            imageUrl: "https://www.meritstore.in/wp-content/uploads/2016/12/10-reasons-to-love-Chemistry.png",
            subtopics: {
              create: [
                {
                  name: "Chemical Reactions",
                  videos: {
                    create: [{ name: "Chemical Reactions", url: "https://www.youtube.com/embed/Lvbm8horG1U" }]
                  }
                },
                {
                  name: "Organic Chemistry",
                  videos: {
                    create: [{ name: "Organic Chemistry", url: "https://www.youtube.com/embed/nP0gDV0xDLY" }]
                  }
                }
              ]
            }
          }
        ]
      }
    }
  });

  // History Category
  await prisma.category.upsert({
    where: { name: "History" },
    update: {},
    create: {
      name: "History",
      topics: {
        create: [
          {
            name: "Ancient History",
            imageUrl: " https://i.natgeofe.com/k/109a4e08-5ebc-48a5-99ab-3fbfc1bbd611/Giza_Egypt_KIDS_0123_16x9.jpg",
            subtopics: {
              create: [
                {
                  name: "Greek Civilization",
                  videos: {
                    create: [{ name: "Greek Civilization", url: "https://www.youtube.com/embed/bAerID24QJ0" }]
                  }
                },
                {
                  name: "Roman Empire",
                  videos: {
                    create: [{ name: "Roman Empire", url: "https://www.youtube.com/embed/bAerID24QJ0" }]
                  }
                }
              ]
            }
          },
          {
            name: "Modern History",
            imageUrl: "https://defencedirecteducation.com/wp-content/uploads/2022/04/ezgif-5-d9a1447572-696x464.jpg",
            subtopics: {
              create: [
                {
                  name: "World War I",
                  videos: {
                    create: [{ name: "World War I", url: "https://www.youtube.com/embed/bAerID24QJ0" }]
                  }
                },
                {
                  name: "World War II",
                  videos: {
                    create: [{ name: "World War II", url: "https://www.youtube.com/embed/bAerID24QJ0" }]
                  }
                }
              ]
            }
          },
          {
            name: "Industrial Revolution",
            imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Powerloom_weaving_in_1835.jpg/1200px-Powerloom_weaving_in_1835.jpg",
            subtopics: {
              create: [
                {
                  name: "Revolution in Metal Industry",
                  videos: {
                    create: [{ name: "Revolution in Metal Industry", url: "https://www.youtube.com/embed/zsPYi2KQ2a0" }]
                  }
                },
                {
                  name: "Revolution in Taxes",
                  videos: {
                    create: [{ name: "Revolution in Taxes", url: "https://www.youtube.com/embed/HlUiSBXQHCw" }]
                  }
                }
              ]
            }
          }
        ]
      }
    }
  });


}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
