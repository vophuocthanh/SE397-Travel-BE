"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const db_1 = require("../../lib/db");
const exceptions_1 = require("../../utils/exceptions");
const schema_1 = require("../../utils/schema");
const zod_validator_1 = require("@hono/zod-validator");
const hono_1 = require("hono");
exports.router = new hono_1.Hono();
exports.router
    .get('/', (0, zod_validator_1.zValidator)('query', schema_1.paginationSchema), async (c) => {
    const user = c.get('user');
    const name = c.req.query('name');
    const page = +c.req.query('page') || 1;
    const limit = +c.req.query('limit') || 5;
    const orgs = await db_1.db.org.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: {
            userID: user === null || user === void 0 ? void 0 : user.id,
            name: {
                contains: name,
            },
        },
    });
    const total = await db_1.db.org.count({
        where: {
            userID: user === null || user === void 0 ? void 0 : user.id,
            name: {
                contains: name,
            },
        },
    });
    return c.json({
        data: orgs,
        total: total,
        totalPage: Math.ceil(total / limit),
    });
})
    .get('/:id', async (c) => {
    const user = c.get('user');
    const orgs = await db_1.db.org.findMany({
        where: {
            userID: user === null || user === void 0 ? void 0 : user.id,
            id: c.req.param('id'),
        },
    });
    return c.json(orgs);
})
    .post('/', async (c) => {
    const user = c.get('user');
    const { name, icon } = await c.req.json();
    const orgs = await db_1.db.org.create({
        data: {
            name: name,
            icon: icon,
            userID: user === null || user === void 0 ? void 0 : user.id,
        },
    });
    return c.json(orgs);
})
    .put('/:id', async (c) => {
    try {
        const user = c.get('user');
        const { name, icon } = await c.req.json();
        await db_1.db.org.update({
            where: {
                id: c.req.param('id'),
            },
            data: {
                name: name,
                icon: icon,
                userID: user === null || user === void 0 ? void 0 : user.id,
            },
        });
        return c.json({
            message: 'Update orgs successfully!',
        });
    }
    catch (error) {
        throw new exceptions_1.BadRequestException(error);
    }
})
    .delete('/:id', async (c) => {
    try {
        await db_1.db.org.delete({
            where: {
                id: c.req.param('id'),
            },
        });
        return c.json({
            message: 'Delete orgs successfully!',
        });
    }
    catch (error) {
        throw new exceptions_1.BadRequestException(error);
    }
})
    .get('/:orgId/channels', (c) => c.json([
    {
        id: '1',
        name: 'Class 1',
        category: {
            id: 1,
            name: 'Class',
        },
    },
    {
        id: '2',
        name: 'Class 2',
        category: {
            id: 1,
            name: 'Class',
        },
    },
    {
        id: '3',
        name: 'Class 1',
        category: {
            id: 2,
            name: 'Class Audio',
        },
    },
    {
        id: '4',
        name: 'Class 2',
        category: {
            id: 2,
            name: 'Class Audio',
        },
    },
]))
    .get('/:orgId/members', async (c) => {
    const orgId = c.req.param('orgId');
    const members = await db_1.db.usersOnOrgs.findMany({
        where: {
            orgID: orgId,
        },
    });
    console.log('members:', members);
    c.json([
        {
            id: '001',
            displayName: 'John Doe',
            username: 'john_doe',
            avatar: 'https://sukienvietsky.com/upload/news/son-tung-mtp-7359.jpeg',
            memberSince: '2022-01-01',
            joinedDiscord: '2022-01-01',
            joinMethod: 'Discord',
            roles: ['Admin'],
        },
        {
            id: '001',
            displayName: 'Goku',
            username: 'goku',
            avatar: 'https://images.immediate.co.uk/production/volatile/sites/3/2023/08/2023.06.28-06.20-boundingintocomics-649c79f009cdf-Cropped-8d74232.png?resize=768,574',
            memberSince: '2022-01-01',
            joinedDiscord: '2022-01-01',
            joinMethod: 'Discord',
            roles: ['Members'],
        },
    ]);
})
    .post('/:orgId/members', async (c) => {
    const orgId = c.req.param('orgId');
    const members = await db_1.db.usersOnOrgs.findMany({
        where: {
            orgID: orgId,
        },
    });
    console.log('members:', members);
    c.json([
        {
            id: '001',
            displayName: 'John Doe',
            username: 'john_doe',
            avatar: 'https://sukienvietsky.com/upload/news/son-tung-mtp-7359.jpeg',
            memberSince: '2022-01-01',
            joinedDiscord: '2022-01-01',
            joinMethod: 'Discord',
            roles: ['Admin'],
        },
        {
            id: '001',
            displayName: 'Goku',
            username: 'goku',
            avatar: 'https://images.immediate.co.uk/production/volatile/sites/3/2023/08/2023.06.28-06.20-boundingintocomics-649c79f009cdf-Cropped-8d74232.png?resize=768,574',
            memberSince: '2022-01-01',
            joinedDiscord: '2022-01-01',
            joinMethod: 'Discord',
            roles: ['Members'],
        },
    ]);
})
    .get('/:orgId/channels/:channelId/messages', (c) => c.json([
    {
        id: 1,
        sender: {
            id: 1,
            name: 'John Doe',
            avatar: 'https://sukienvietsky.com/upload/news/son-tung-mtp-7359.jpeg',
        },
        createdAt: '2022-01-01T00:00:00.000Z',
        message: 'Hey, how are you?',
    },
    {
        id: 2,
        sender: {
            id: 1,
            name: 'Vo Phuoc Thanh',
            avatar: 'https://staticg.sportskeeda.com/editor/2023/01/9487f-16728933915704-1920.jpg?w=840',
        },
        createdAt: '2022-01-01T00:00:00.000Z',
        message: 'What are you doing?',
    },
]))
    .get('/:orgId/channels/:channelId/members', (c) => c.json([
    {
        id: 1,
        name: 'Vo Phuoc Thanh',
        avatar: 'https://staticg.sportskeeda.com/editor/2023/01/9487f-16728933915704-1920.jpg?w=840',
        roles: ['Admin', 'F0'],
        backgroundColor: '#d40000',
        category: {
            id: 1,
            name: 'Đà Nẵng',
        },
    },
    {
        id: 2,
        name: 'Nobita',
        avatar: 'https://i.ex-cdn.com/mgn.vn/files/news/2023/01/04/ctdragon-ball-son-goku-bao-nhieu-tuoi-trong-tung-phan-cua-bo-anime-210923.jpg',
        roles: ['Học viên'],
        backgroundColor: '#00FF00',
        category: {
            id: 2,
            name: 'Online',
        },
    },
    {
        id: 3,
        name: 'Doraemon',
        avatar: 'https://cdn.pixabay.com/photo/2019/10/16/09/09/doraemon-4553920_960_720.png',
        roles: ['Học viên'],
        backgroundColor: '#FF99CC',
        category: {
            id: 2,
            name: 'Online',
        },
    },
]));
//# sourceMappingURL=orgs.controller.js.map