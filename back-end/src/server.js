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
	console.log('GET /: Backend health check');
	res.send('Backend API is running!');
});

app.post('/api/chat', async (req, res) => {
	const { prompt } = req.body;

	console.log('POST /api/chat: Received request with prompt:', prompt);

	try {
		// Get the response directly as an object
		const rawResponse = await getChatGPTResponse(prompt);
		console.log(
			'POST /api/chat: Raw response from getChatGPTResponse:',
			rawResponse
		);

		// Check if the response is structured correctly
		if (rawResponse.success) {
			console.log('POST /api/chat: Sending success response to frontend');
			res.json(rawResponse); // Send the valid response to the frontend
		} else {
			// Handle specific errors from the API
			console.error(
				'POST /api/chat: Error in rawResponse:',
				rawResponse.message
			);
			res.status(400).json({ error: rawResponse.message });
		}
	} catch (error) {
		// Log any errors encountered during the process
		console.error('Error in /api/chat route:', error.stack || error.message);
		res.status(500).json({ error: 'Failed to fetch response from ChatGPT' });
	}
});

// Fallback for undefined API routes
app.use((req, res, next) => {
	if (req.path.startsWith('/api')) {
		console.warn(`API route not found: ${req.path}`);
		return res.status(404).json({ error: 'API route not found' });
	}
	next();
});

// Start server
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
