import express from 'express'
import pg from 'pg'

const {Client} = pg;
const client = new Client({
    user: 'test',
    password: 'testpw',
    host: 'localhost',
    port: 5432,
    database: 'nodejs',
});

await client.connect();

const getAllUsers = async () => {
    const res = await client.query('SELECT * FROM users;');
    return res.rows
}
const getById = async (id) => {
    const res = await client.query('SELECT * FROM users WHERE id = $1', [id]);
    return res.rows[0]
}

const addUser = async ({ name, email, age }) => {
    const res = await client.query('INSERT INTO users (name, email, age) VALUES ($1, $2, $3) RETURNING *', [name, email, age]);
    return res.rows[0];
}

const refUser = async (id, { name, email, age }) => {
    const res = await client.query('UPDATE users SET name = $2, email = $3, age = $4 WHERE id = $1 RETURNING *', [id, name, email, age]);
    return res.rows[0];
}

const delById = async (id) => {
    const res = await client.query('DELETE FROM users WHERE id = $1', [id]);
    return res.rows[0]
}


const PORT = 3000;

const app = express()

app.use(express.json())

app.get('/users', async (req, res) => {
    const users = await getAllUsers()
    res.status(200).json(users)
})

app.get('/users/:id', async (req, res) =>{
    const userId = req.params.id
    const userById = await getById(userId)
    res.status(200).json(userById)
})

app.post('/users', async (req, res) => {
    const userInfo = req.body;
    const newUser = await addUser(userInfo);
    res.status(200).json(newUser)
})

app.put('/users/:id', async (req, res) => {
    const userId = req.params.id;
    const userInfo = req.body;
    const remarkUser = await refUser(userId, userInfo);
    res.status(200).json(remarkUser)
})

app.delete('/users/:id', async (req, res) =>{
    const userId = req.params.id
    const userById = await delById(userId)
    res.status(200).json(userById)
})


app.listen(PORT, ()=> {
    console.log(`http://localhost:${PORT}`)
})
