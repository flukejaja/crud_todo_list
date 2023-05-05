
const { Validator } = require("express-json-validator-middleware");
const { validation_error_middleware, schema_body_update, schema_id, schema_body_add } = require('./validationErrorMiddleware');
const { validate } = new Validator();
const express = require('express')
const data = require("./data.json");
const app = express()
app.use(express.json())

app.get('/', (_, res) => {
    res.send('Hello world')
});

app.get('/users', (_, res) => {
    let sort_name = data.sort((a, b) => a.name.localeCompare(b.name))
    res.json(sort_name);
});

app.get('/users/:id', (req, res) => {
    const { id } = req.params;
    let find_data = data.find(user => parseInt(id) === user.id);
    if (!find_data) return res.status(404).send({ message: "Not found user" })
    res.json(find_data);
});


app.post('/users', validate({ body: schema_body_add }), (req, res) => {
    data.push({id :data.length + 1 , ...req.body});
    res.json(data)
});

app.put('/users', validate({ body: schema_body_update }), (req, res) => {
    const body = req.body;
    if (!data.some(user => user.id === body.id)) return res.status(404).send({ message: "Not found user" })
    data.forEach((user, index, arr) => {
        if (user.id === body.id) {
            arr[index] = {
                id: body.id,
                name: body.name,
                phone: body.phone,
                email: body.email,
                city: body.city,
                address: body.address
            }
        }
    });
    res.json(data)
});

app.delete('/users/:id', validate({ params: schema_id }), (req, res) => {
    const { id } = req.params;
    if (!data.some(user => user.id === parseInt(id))) return res.status(404).send({ message: "Not found user" })
    let index = 0;
    for (let user of data) {
        if (user.id === parseInt(id)) {
            data.splice(index, 1);
            break;
        }
        index++;
    }
    res.json(data)
});

// app.use('*', (_, res ) => {
//     res.status(404).send({ message:"Not found"})
// })

app.use(validation_error_middleware);


app.listen(5000, () => {
    console.log(`Example app listening at http://localhost:5000`);
}).on('error', (e) => {
    console.log('Error happened: ', e.message)
});