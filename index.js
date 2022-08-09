const express = require('express');
const { sequelize, User , Post} = require('./models');


const app = express();
app.use(express.json())


app.get('/', (request, response) => {
    response.status(200).json({"name": "poonam"})
})

app.get('/users', async (request, response) => {
    const users = await User.findAll();

    response.status(200).json({"users": users})
})

app.post('/users', async (request, response) => {
    try { 
        const { firstName, lastName, email } = request.body
        const user = await User.create({ firstName: firstName, lastName: lastName, email: email });
    
        response.status(200).json({"user": user})
    } catch (error) {
        console.log(error)
        response.status(500).json({"error": "Server Error"})
    }
})

app.get('/users/:uuid', async (request, response) => {
    try { 
        const user = await User.findOne({ where : {uuid: request.params.uuid}, include: 'posts' });
    
        response.status(200).json({"user": user})
    } catch (error) {
        console.log(error)
        response.status(500).json({"error": "Server Error"})
    }
})

app.delete('/users/:uuid', async (request, response) => {
    try { 
        const user = await User.findOne({where : {uuid: request.params.uuid}});
        user.destroy();

        response.status(200).json({"user": user})
    } catch (error) {
        console.log(error)
        response.status(500).json({"error": "Server Error"})
    }
})

app.put('/users/:uuid', async (request, response) => {
    try { 
        const { firstName } = request.body
        const user = await User.findOne({ where: {uuid: request.params.uuid }});
    
        if (user) {
            user.firstName = firstName;
            user.save();
        } else {
            return response.status(200).json({"message": "user not found"})
        }

        response.status(200).json({"user": user})
    } catch (error) {
        console.log(error)
        response.status(500).json({"error": "Server Error"})
    }
})

app.post('/posts', async (request, response) => {
    try { 
        const { userId, title, description } = request.body

        const user = await User.findOne({ where: { uuid : userId} });
        const post = await Post.create({ title: title, description: description, userId: user.id });
        return response.json(post)
    } catch (error) {
        console.log(error)
        response.status(500).json({"error": "Server Error"})
    }
})


app.listen(5000, async () => {
    console.log("server listening on 5000")
    await sequelize.authenticate();

    console.log("database connected")

})