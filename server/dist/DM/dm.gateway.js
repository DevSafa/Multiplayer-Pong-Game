"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DmGateway = void 0;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const dm_msg_1 = require("../dto_msg_room/dm_msg");
const prisma_service_1 = require("../prisma/prisma.service");
let DmGateway = class DmGateway {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger('AppGateway_DM');
    }
    handleMessage() {
        console.log("hello world1!!!!");
    }
    async check_room_name(client, message) {
        let get_name;
        const dm_name = await this.prisma.room.count({
            where: {
                OR: [
                    {
                        name: message.from + message.to,
                    },
                    {
                        name: message.to + message.from,
                    },
                ]
            }
        });
        if (dm_name == 1) {
            get_name = await this.prisma.room.findFirst({
                where: {
                    OR: [
                        {
                            name: message.from + message.to,
                        },
                        {
                            name: message.to + message.from,
                        },
                    ]
                },
                select: {
                    name: true,
                }
            });
        }
        if (dm_name == 0) {
            const add_dm_room = await this.prisma.room.create({
                data: {
                    name: message.from + message.to, type: 'dm', password: '', owner: message.from,
                }
            });
        }
        client.join(get_name.name);
        this.server.to(get_name.name).emit("hello");
    }
    async send_msg(client, message) {
        let get_name;
        get_name = await this.prisma.room.findFirst({
            where: {
                OR: [
                    {
                        name: message.from + message.to,
                    },
                    {
                        name: message.to + message.from,
                    },
                ]
            },
            select: {
                name: true,
            }
        });
        this.server.to(get_name.name).emit('msgToClient_dm', message);
        const newmsg = await this.prisma.directMessage.create({
            data: { creationDate: new Date(), from: message.from, to: message.to, content_msg: message.msg },
        });
    }
    handleDisconnect(client) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }
    handleConnection(client) {
        this.logger.log(`Client connected: ${client.id}`);
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], DmGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('message'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DmGateway.prototype, "handleMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('check_room'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, dm_msg_1.dm_msg]),
    __metadata("design:returntype", Promise)
], DmGateway.prototype, "check_room_name", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('dm_message'),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, dm_msg_1.dm_msg]),
    __metadata("design:returntype", Promise)
], DmGateway.prototype, "send_msg", null);
DmGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        }
    }),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DmGateway);
exports.DmGateway = DmGateway;
//# sourceMappingURL=dm.gateway.js.map