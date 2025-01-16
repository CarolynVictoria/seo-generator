import express from 'express';
import { getChatGPTResponse } from './apiService.js';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5505;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.get('/', (req, res) => {
	res.send('Backend API is running!');
});

app.post('/api/chat', async (req, res) => {
	const { prompt } = req.body;

	try {
		// Get the response directly as an object
		const rawResponse = await getChatGPTResponse(prompt);

		// Check if the response is structured correctly
		if (rawResponse.success) {
			res.json(rawResponse); // Send the valid response to the frontend
		} else {
			// Handle specific errors from the API
			res.status(400).json({ error: rawResponse.message });
		}
	} catch (error) {
		console.error('Error in /api/chat route:', error.message);
		res.status(500).json({ error: 'Failed to fetch response from ChatGPT' });
	}
});

// Start server
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
