import express from 'express';
//import { config } from 'dotenv';
//config();
import { PrismaClient } from '@prisma/client';
import bodyParser from 'body-parser';
import cors from 'cors';

const prisma = new PrismaClient();

const app = express();

app.use(bodyParser.json());
app.use(
    cors({
        origin: 'https://todo-list-manan.vercel.app',
    })
);

app.get('/', async (req, res) => {
    try {
        const todolist = await prisma.todo.findMany({});
        return res.status(200).json({
            err: false,
            data: todolist,
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            err: true,
            reason: 'something wents wrong!',
        });
    }
})
    .post('/', async (req, res) => {
        try {
            const name = req.body.name;
            const description = req.body.description;

            if (
                !name ||
                name.length === 0 ||
                !description ||
                description.length === 0
            ) {
                return res.status(400).json({
                    err: true,
                    reason: 'name and description is empty',
                });
            }

            const response = await prisma.todo.create({
                data: {
                    name,
                    description,
                },
            });

            if (!response) {
                return res.status(400).json({
                    err: true,
                    reason: 'bad request',
                });
            }

            return res.status(200).json({
                err: false,
                data: 'craeted!',
                // data: response,
            });
        } catch (e) {
            console.log(e);
            return res.status(500).json({
                err: true,
                reason: 'something wents wrong!',
            });
        }
    })
    .patch('/', async (req, res) => {
        try {
            const id = req.body.id;
            const name = req.body.name;
            const description = req.body.description;

            if (
                !id ||
                id.length === 0 ||
                !name ||
                name.length === 0 ||
                !description ||
                description.length === 0
            ) {
                return res.status(400).json({
                    err: true,
                    reason: 'name, id and description is empty',
                });
            }

            const response = await prisma.todo.update({
                where: {
                    id,
                },
                data: {
                    name,
                    description,
                },
            });

            if (!response) {
                return res.status(400).json({
                    err: true,
                    reason: 'bad request',
                });
            }

            return res.status(200).json({
                err: false,
                data: 'updated!',
            });
        } catch (e) {
            console.log(e);
            return res.status(500).json({
                err: true,
                reason: 'something wents wrong!',
            });
        }
    })
    .delete('/', async (req, res) => {
        try {
            const id = req.body.id;

            if (!id || id.length === 0) {
                return res.status(400).json({
                    err: true,
                    reason: 'id is empty',
                });
            }

            const response = await prisma.todo.delete({
                where: {
                    id,
                },
            });

            if (!response) {
                return res.status(400).json({
                    err: true,
                    reason: 'bad request',
                });
            }

            return res.status(200).json({
                err: false,
                data: 'deleted!',
            });
        } catch (e) {
            console.log(e);
            return res.status(500).json({
                err: true,
                reason: 'something wents wrong!',
            });
        }
    });

app.use('*', (req, res, next) => {
    return res.status(404).send({
        err: true,
        message: '404 not found!',
    });
});

app.use((err, req, res, next) => {
    try {
        return res.status(err.status || 500).send({
            err: err.status || 500,
            message: err.message || 'Something went wrong!',
        });
    } catch {
        return res.status(500).send({
            err: true,
            message: 'Something went wrong!',
        });
    }
});

app.listen(1337, () => {
    console.log(`🎉server is running 1337`);
});
