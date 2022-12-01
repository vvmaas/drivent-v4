import bookingRepository from "@/repositories/booking-repository.ts";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import roomRepository from "@/repositories/room-repository";
import { notFoundError, forbiddenError } from "@/errors";

async function getBooking(userId: number) {
  const booking = await bookingRepository.findBooking(userId);

  if(!booking) {
    throw notFoundError();
  }
  return booking;
}

async function postBooking(roomId: number, userId: number) {
  checkForBooking(userId);
  checkRoom(roomId);

  const bookingData = {
    userId,
    roomId
  };
  await bookingRepository.createBooking(bookingData);

  return await bookingRepository.findBookingId(roomId, userId);
}

async function putBooking(bookingId: number, roomId: number, userId: number) {
  checkForBooking(userId);
  checkRoom(roomId);
  checkUserBooking(userId);
  
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
    throw notFoundError();
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
  const booking = await bookingRepository.findBookingsByUser(userId);

  if(!booking) {
    throw forbiddenError();
  }
}

const bookingService = {
  getBooking,
  postBooking,
  putBooking,
};
  
export default bookingService;

