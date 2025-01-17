import axios from 'axios';

// Function to fetch ChatGPT responses
const fetchChatGPTResponse = async (content, website) => {
	try {
		// Use a relative URL for API calls
		const response = await axios.post('/api/chat', {
			prompt: content,
			website, // Include website parameter
		});

		// Return the processed data
		return response.data;
	} catch (error) {
		console.error(
			'Error in frontend API service:',
			error.response?.data || error.message
		);
		throw error;
	}
};

export default fetchChatGPTResponse;
