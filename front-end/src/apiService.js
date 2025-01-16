import axios from 'axios';

const fetchChatGPTResponse = async (content) => {
	try {
		const response = await axios.post('http://localhost:5505/api/chat', {
			prompt: content,
		});

		// Directly return the processed data (JSON array) from the backend
		return response.data;
	} catch (error) {
		// Log and rethrow error for the frontend to handle
		console.error(
			'Error in frontend API service:',
			error.response?.data || error.message
		);
		throw error;
	}
};

export default fetchChatGPTResponse;
