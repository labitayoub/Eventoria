import { IsUUID } from 'class-validator';

export class CreateReservationDto {
  @IsUUID()
  eventId: string;
}
