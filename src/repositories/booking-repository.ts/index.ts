import { prisma } from "@/config";
import { Booking } from "@prisma/client";

async function findBooking(userId: number) {
  return prisma.booking.findFirst({
    where: {
      userId
    },
    select: {
      id: true,
      Room: true,
    },
  });
}

async function findBookingId(roomId: number, userId: number) {
  return prisma.booking.findFirst({
    where: {
      userId,
      roomId
    },
    select: {
      id: true,
    },
  });
}

async function createBooking(booking: CreateBookingParams) {
  return prisma.booking.create({
    data: {
      ...booking
    },
  });
}

async function updateBooking(id: number, booking: CreateBookingParams) {
  return prisma.booking.update({
    where: {
      id,
    },
    data: {
      ...booking
    },
  });
}

async function findBookingsByRoom(roomId: number) {
  return prisma.booking.findMany({
    where: {
      roomId,
    },
  });
}

async function findBookingByUser(userId: number) {
  return prisma.booking.findFirst({
    where: {
      userId,
    },
  });
}

export type CreateBookingParams = Omit<Booking, "id" | "createdAt" | "updatedAt">

const bookingRepository = {
  findBooking,
  createBooking,
  findBookingId,
  updateBooking,
  findBookingsByRoom,
  findBookingByUser,
};
  
export default bookingRepository;
  
