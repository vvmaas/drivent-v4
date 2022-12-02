import bookingRepository from "@/repositories/booking-repository.ts";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import roomRepository from "@/repositories/room-repository";
import { notFoundError, forbiddenError, badRequestError } from "@/errors";

async function getBooking(userId: number) {
  const booking = await bookingRepository.findBooking(userId);

  if(!booking) {
    throw notFoundError();
  }
  return booking;
}

async function getBookingId(roomId: number, userId: number) {
  return await bookingRepository.findBookingId(roomId, userId);
}

async function postBooking(roomId: number, userId: number) {
  await validateId(roomId);
  await checkForBooking(userId);
  await checkRoom(roomId);

  const bookingData = {
    userId,
    roomId
  };
  await bookingRepository.createBooking(bookingData);

  return await bookingRepository.findBookingId(roomId, userId);
}

async function putBooking(bookingId: number, roomId: number, userId: number) {
  await validateId(roomId);
  await validateId(bookingId);
  await checkRoom(roomId);

  const booking = await checkUserBooking(userId);

  if(booking.id !== bookingId) {
    throw forbiddenError();
  }
  
  const bookingData = {
    userId,
    roomId
  };
  await bookingRepository.updateBooking(bookingId, bookingData);
  
  return await bookingRepository.findBookingId(roomId, userId);
}

async function checkForBooking(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw forbiddenError();
  }
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket || ticket.status === "RESERVED" || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw forbiddenError();
  }
}

async function checkRoom(roomId: number) {
  const room = await roomRepository.findRoom(roomId);

  if(!room) {
    throw notFoundError();
  }

  const bookings = await bookingRepository.findBookingsByRoom(roomId);

  if(room.capacity === bookings.length) {
    throw forbiddenError();
  }
}

async function checkUserBooking(userId: number) {
  const booking = await bookingRepository.findBookingByUser(userId);

  if(!booking) {
    throw forbiddenError();
  }

  return booking;
}

async function validateId(id: number) {
  if(id == null || id<0 || isNaN(id)) {
    throw badRequestError();
  }
}

const bookingService = {
  getBooking,
  postBooking,
  putBooking,
  getBookingId,
};
  
export default bookingService;

