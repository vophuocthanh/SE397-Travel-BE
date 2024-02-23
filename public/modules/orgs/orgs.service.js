"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrgsService = void 0;
const db_1 = require("../../lib/db");
class OrgsService {
    static async deleteOrgs() {
        try {
            const orgs = await db_1.db.org.deleteMany({
                where: {
                    id: {
                        not: '1',
                    },
                },
            });
            return orgs;
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }
}
exports.OrgsService = OrgsService;
//# sourceMappingURL=orgs.service.js.map