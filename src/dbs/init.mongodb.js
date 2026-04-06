import mongoose from 'mongoose';
import {countConect} from '../helpers/check.connect.js';
import config from '../configs/config.mongodb.js';
const connectString = `mongodb://${config.db.host}:${config.db.port}/${config.db.name}`
// const connectString =  `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@ac-qjawiq2-shard-00-00.hrvy57a.mongodb.net:27017,ac-qjawiq2-shard-00-01.hrvy57a.mongodb.net:27017,ac-qjawiq2-shard-00-02.hrvy57a.mongodb.net:27017/?ssl=true&replicaSet=atlas-149c59-shard-0&authSource=admin&appName=Cluster0`

class Database {
    constructor() {
        this.connect();
    }
    async connect() {
        console.log(`[MongoDB] Attempting to connect...`)
        console.log(`[MongoDB] Connection string:`, connectString.split('@')[0] + '@****')
        try{
            await mongoose.connect(connectString,{
                /* pool size là khái niệm về lượng kết nối tối đa 
                nếu lượng kết nối lớn hơn 50 thì bắt req phải chờ 
                cho đến khi có kết nối nào rảnh thì sẽ chèn vào 
                */
                maxPoolSize : 50,
                serverSelectionTimeoutMS: 10000,
                socketTimeoutMS: 45000
            })
            console.log(`[MongoDB] ✅ Connected successfully with database: ${config.db.name}`, countConect())
        }
        catch(err){
            console.error("[MongoDB] ❌ Cannot connect db")
            console.error("[MongoDB] Error message:", err.message)
            console.error("[MongoDB] Error code:", err.code)
            process.exit(1)
        }
    }
    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}
export default  Database

