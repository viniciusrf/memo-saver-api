const express = require('express');

// Routers
// const areaRouter = require('./domains/area/route'); - inserir as rotas

// Internal Services

// const Area = require('./domains/area/service'); - inserir os services


const createMainRouter = (dbService) => {
	const router = express.Router();

	// const areaService = new Area(dbService); - declarar o inicio dos services

	// router.use('/area', areaRouter(authService, areaService)); - definir as routes

	router.get('/', (req, res) => {
		res.send({status: true});
	});

	router.get('/ping', (req, res) => {
		res.send({pong: true});
	});

	return router;
};

module.exports = createMainRouter;
