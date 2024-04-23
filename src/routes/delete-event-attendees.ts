import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { BadRequest } from './_errors/bad-request'

export async function deleteEventAttendees(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    '/events/:eventId/:attendeeId',
    {
      schema: {
        summary: 'Delete an attendee',
        tags: ['attendees'],
        params: z.object({
          eventId: z.string().uuid(),
          attendeeId: z.coerce.number().int(),
        }),
        response: {
          204: z.null(),
        },
      },
    },
    async (request, reply) => {
      const { eventId, attendeeId } = request.params

      const attendee = await prisma.attendee.findUnique({
        where: {
          id: attendeeId,
          event: {
            id: eventId,
          },
        },
      })

      if (attendee === null) {
        throw new BadRequest('Attendee not found!')
      }

      await prisma.attendee.delete({
        where: {
          id: attendeeId,
          event: {
            id: eventId,
          },
        },
      })

      reply.code(204).send()
    },
  )
}
