// const { MongoClient } = require('mongodb');
// const url = "mongodb://localhost:27017";

// const client = new MongoClient(url);
// const dbName = "Shopping_Website";
// let db;

// async function dbConnect() {
//     try {
//         await client.connect();
//         db = client.db(dbName);
//         console.log("Database connected successfully");
//     } catch (err) {
//         console.error("Database connection error:", err);
//     }
// }
// function getDb() {
//     if (!db) {
//         throw new Error("Database not connected yet!");
//     }
//     return db;
// }

// async function getData(colName, query) {
//     let output = [];
//     try {
//         const collection = db.collection(colName);
//         const cursor = collection.find(query);
//         for await (const data of cursor) {
//             output.push(data);
//         }
//     } catch (err) {
//         output.push({ "Error": "Error in getting data" });
//     }
//     return output;
// }

// async function postData(colName, data) {
//     let output;
//     try {
//         const collection = db.collection(colName);
//         await collection.insertOne(data);
//         output = { "response": "Data added successfully" };
//     } catch (err) {
//         output = { "response": "Error in sending data" };
//     }
//     return output;
// }
// async function deleteData(collectionName, query) {
//   const collection = db.collection(collectionName);
//   try {
//     const result = await collection.deleteOne(query);
//     return result;
//   } catch (error) {
//     console.error("Delete Error in DB:", error);
//     throw error;  // Let the route catch this and respond with 500
//   }
// }


// module.exports = {
//     dbConnect,
//     getData,
//     getDb,
//     postData,
//     deleteData
// };



const { MongoClient } = require('mongodb');
const url = "mongodb://localhost:27017";
// mongodb://localhost:27017
// 
const client = new MongoClient(url);
const dbName = "Shopping_Website";
let db;

async function dbConnect() {
    try {
        await client.connect();
        db = client.db(dbName);
        console.log("Database connected successfully");
    } catch (err) {
        console.error("Database connection error:", err);
    }
}

function getDb() {
    if (!db) {
        throw new Error("Database not connected yet!");
    }
    return db;
}

async function getData(colName, query) {
    let output = [];
    if (!db) throw new Error("Database not connected yet!");
    try {
        const collection = db.collection(colName);
        const cursor = collection.find(query);
        for await (const data of cursor) {
            output.push(data);
        }
    } catch (err) {
        console.error("Error in getting data:", err);
        output.push({ "Error": "Error in getting data" });
    }
    return output;
}

async function postData(colName, data) {
    if (!db) throw new Error("Database not connected yet!");
    try {
        const collection = db.collection(colName);
        const result = await collection.insertOne(data);
        return result; // return the original insert result
    } catch (err) {
        console.error("Error in sending data:", err);
        throw err; // propagate the error to the caller
    }
}


async function closeConnection() {
    if (client) {
        await client.close();
        console.log("Database connection closed.");
    }
}

module.exports = {
    dbConnect,
    getDb,
    getData,
    postData,
    closeConnection
};