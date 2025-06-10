// Importing Packages
const express = require('express');
const mongo = require('mongodb');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

const { ObjectId } = require('mongodb');


let app = express();
const port = process.env.PORT || 9003;

app.use(cors());

let { getData, dbConnect, postData, deleteData } = require('./controller/dbController');


const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());



app.get('/', (req, res) => {
    res.send("Hii I'm from express server really I'm here");
    console.log('Message sent');
})

app.get('/ProductList', async (req, res) => {
    let query = {};
    let collection = "ProductDesc";
    let output = await getData(collection, query);
    res.send(output);
})
app.get('/ProductList2', async (req, res) => {
    let query = {};
    let collection = "ProductList2";
    let output = await getData(collection, query);
    res.send(output);
})
app.get('/ProductList1', async (req, res) => {
    let query = {};
    let collection = "ProductList1";
    let output = await getData(collection, query);
    res.send(output);
})
app.get('/ProductList3', async (req, res) => {
    let query = {};
    let collection = "ProductList3";
    let output = await getData(collection, query);
    res.send(output);
})
// Express route (make sure CORS is enabled)
app.get('/search', async (req, res) => {
    const query = req.query.query;
    try {
        const data = await getData("ProductDesc", {
            name: { $regex: query, $options: 'i' }
        });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: "Search failed" });
    }
});


// app.get('/ProductDesc', async (req, res) => {
//     let Pip_id = Number(req.query.p_id);
//     let query = { p_id: Pip_id };
//     let collection = "ProductDesc";
//     let output = await getData(collection, query);
//     res.send(output);
// });

// app.get('/ProductDesc', async (req, res) => {
//     let query = {};
//     let collection = "ProductDesc";
//     let output = await getData(collection, query);
//     res.send(output);
// })

app.get('/ProductDesc', async (req, res) => {
  let query = {}; // empty query returns all documents
  let collection = "ProductDesc";
  let output = await getData(collection, query);
  res.send(output);
});

app.delete('/ProductDesc/:id', async (req, res) => {
  const id = req.params.id;
  console.log("Delete request for id:", id);

  if (!ObjectId.isValid(id)) {
    return res.status(400).send("Invalid ID");
  }

  try {
    const result = await deleteData('ProductDesc', { _id: new ObjectId(id) });
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to delete");
  }
});




app.get('/ProductDesc/:p_id', async (req, res) => {
    let P_id = Number(req.params.p_id);
    let query = { p_id: P_id };
    let collection = "ProductDesc";
    let output = await getData(collection, query);
    res.send(output)
})


app.get('/ProductList1/:p_id', async (req, res) => {
    let P_id = Number(req.params.p_id);
    let query = { p_id: P_id };
    let collection = "ProductDesc";
    let output = await getData(collection, query);
    res.send(output)
})


app.get('/ProductList1/:productSpec_id', async (req, res) => {
    let ProductSpec_id = Number(req.params.productSpec_id);
    let query = { productSpec_id: ProductSpec_id };
    let collection = "ProductDesc";
    let output = await getData(collection, query);
    res.send(output)
})


app.get('/details/:productSpec_id', async (req, res) => {
    let Pip_id = Number(req.params.productSpec_id);
    let query = { productSpec_id: Pip_id };
    let collection = "ProductDesc";
    let output = await getData(collection, query);
    res.send(output);
});


app.get('/filter/:productSpec_id', async (req, res) => {
    let id = req.params.id;
    let query = { size: id }
    let collection = "products"
    let output = await getData(collection, query)
    res.send(output)
})


app.get('/price/:productid', async (req, res) => {
    let productid = Number(req.params.productid);
    let lcost = Number(req.query.lcost);
    let hcost = Number(req.query.hcost);
    let query = {}
    if (lcost && hcost) {
        query = {
            "productType_id": productid,
            $and: [{ price: { $gt: lcost, $lt: hcost } }]
        }
    }
    else {
        query = {}
    }
    let collection = "product1"
    let output = await getData(collection, query)
    res.send(output)
})
// Order API
app.get('/orders', async (req, res) => {
    let query = {};
    let collection = "Order";
    let output = await getData(collection, query);
    res.send(output)
})

app.post('/PlaceOrders', async (req, res) => {
    let data = req.body;
    let collection = "Order";
    console.log(">>>", data);

    try {
        let response = await postData(collection, data);

        // Ensure the response is sent in JSON format
        res.status(200).json({ message: 'Order placed successfully', data: response });
    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).json({ message: 'Failed to place order', error: error.message });
    }
});


// app.delete('/ProductDesc/:id', async (req, res) => {
//     const { id } = req.params;
//     const collection = "ProductDesc";
//     try {
//         const output = await db.collection(collection).deleteOne({ _id: new ObjectId(id) });
//         res.send({ status: "Deleted", deletedCount: output.deletedCount });
//     } catch (error) {
//         res.status(500).send({ status: "Error", message: error.message });
//     }
// });


app.listen(port, (err) => {
    dbConnect();
    if (err) throw err;
    console.log(`Server is running on port : http://localhost:${port}`);
})