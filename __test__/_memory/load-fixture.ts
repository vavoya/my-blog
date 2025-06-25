import { Db } from 'mongodb';

export async function loadFixture(db: Db, fixture: Record<string, any[]>) {
    for (const [collectionName, docs] of Object.entries(fixture)) {
        const col = db.collection(collectionName);
        await col.deleteMany({});
        if (docs.length > 0) {
            await col.insertMany(docs);
        }
    }
}
