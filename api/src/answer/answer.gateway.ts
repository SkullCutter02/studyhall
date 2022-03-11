import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { UseFilters, ValidationPipe } from "@nestjs/common";
import { Server, Socket } from "socket.io";

import { AnswerService } from "./answer.service";
import { CreateAnswerDto } from "./dto/createAnswer.dto";
import { WsExceptionFilter } from "../filters/wsException.filter";

@UseFilters(WsExceptionFilter)
@WebSocketGateway()
export class AnswerGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly answerService: AnswerService) {}

  @SubscribeMessage("join_question_room")
  joinRoom(@MessageBody() roomId: string, @ConnectedSocket() socket: Socket) {
    socket.join(roomId);
  }

  @SubscribeMessage("leave_question_room")
  leaveRoom(@MessageBody() roomId: string, @ConnectedSocket() socket: Socket) {
    socket.leave(roomId);
  }

  @SubscribeMessage("send_answer")
  async sendAnswer(
    @MessageBody(new ValidationPipe({ transform: true })) createAnswerDto: CreateAnswerDto,
    @ConnectedSocket() socket: Socket
  ) {
    const author = await this.answerService.getUserFromSocket(socket);
    const answer = await this.answerService.create(createAnswerDto, author);

    this.server.to(createAnswerDto.questionId).emit("receive_answer", answer);
  }
}
