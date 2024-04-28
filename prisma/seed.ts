import { prisma } from '../src/lib/prisma'
import { faker } from '@faker-js/faker'
import { Prisma } from '@prisma/client'
import dayjs from 'dayjs'

async function seed() {
  await prisma.event.deleteMany()

  const uniteSummitId = '9e9bd979-9d10-4915-b339-3786b1634f33'
  await prisma.event.create({
    data: {
      id: uniteSummitId,
      title: 'Unite Summit',
      slug: 'unite-summit',
      details: 'Um evento p/ devs apaixonados(as) por código!',
      maximumAttendees: 120,
    },
  })

  const codeConId = 'd4f0f5dc-79b0-4a12-a921-0b45744c6a3e'
  await prisma.event.create({
    data: {
      id: codeConId,
      title: 'CodeCon',
      slug: 'code-con',
      details: 'Conferência sobre codificação e desenvolvimento de software.',
      maximumAttendees: 150,
    },
  })

  const uniteSummitAttendees: Prisma.AttendeeUncheckedCreateInput[] = []
  for (let i = 0; i <= 119; i++) {
    uniteSummitAttendees.push({
      id: 10000 + i,
      name: faker.person.fullName(),
      email: faker.internet.email(),
      eventId: uniteSummitId,
      createdAt: faker.date.recent({
        days: 30,
        refDate: dayjs().subtract(8, 'days').toDate(),
      }),
      checkIn: faker.helpers.arrayElement<
        Prisma.CheckInUncheckedCreateNestedOneWithoutAttendeeInput | undefined
      >([
        undefined,
        {
          create: {
            createdAt: faker.date.recent({ days: 7 }),
          },
        },
      ]),
    })
  }

  const codeConAttendees: Prisma.AttendeeUncheckedCreateInput[] = []
  for (let i = 0; i <= 80; i++) {
    codeConAttendees.push({
      id: 20000 + i,
      name: faker.person.fullName(),
      email: faker.internet.email(),
      eventId: codeConId,
      createdAt: faker.date.recent({
        days: 30,
        refDate: dayjs().subtract(8, 'days').toDate(),
      }),
      checkIn: faker.helpers.arrayElement([
        undefined,
        {
          create: {
            createdAt: faker.date.recent({ days: 7 }),
          },
        },
      ]),
    })
  }

  await Promise.all(
    uniteSummitAttendees.map((data) => {
      return prisma.attendee.create({
        data,
      })
    }),
  )

  await Promise.all(
    codeConAttendees.map((data) => {
      return prisma.attendee.create({
        data,
      })
    }),
  )
}

seed().then(() => {
  console.log('Database seeded!')
  prisma.$disconnect()
})
