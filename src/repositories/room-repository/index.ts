import { prisma } from "@/config";

async function findRoom(id: number) {
  return prisma.room.findUnique({
    where: { id }
  });
}

const roomRepository = {
  findRoom,

};

export default roomRepository;
