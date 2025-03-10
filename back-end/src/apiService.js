import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const validatePrompt = (prompt) => {
	if (!prompt || prompt.trim().length === 0) {
		return { valid: false, error: 'Prompt cannot be empty.' };
	}

	const meaninglessPatterns = [/lorem ipsum/i, /dolor sit amet/i];
	if (meaninglessPatterns.some((pattern) => pattern.test(prompt))) {
		return {
			valid: false,
			error: 'Invalid input: Prompt contains meaningless text.',
		};
	}

	return { valid: true };
};

export const getChatGPTResponse = async (prompt, website) => {
	try {
		const validation = validatePrompt(prompt);
		if (!validation.valid) {
			return { success: false, message: validation.error };
		}

		const response = await axios.post(
			'https://api.openai.com/v1/chat/completions',
			{
				model: 'gpt-4o-mini',
				messages: [
					{
						role: 'system',
						content: `You are an SEO metadata expert for ${website}. Generate 5 SEO-friendly titles and descriptions for the provided content. Each title must not exceed 68 characters. Each description must be between 140 and up to 180 characters. The content you provide must be absolutely factual. Do not enhance or overstate anything. Stick to facts. Return the output strictly as a valid JSON array of objects, with each object containing "title" and "description" keys. Do not include any additional text or formatting.`,
					},
					{ role: 'user', content: prompt },
				],
			},
			{
				headers: {
					Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
				},
			}
		);

		return {
			success: true,
			data: JSON.parse(response.data.choices[0].message.content),
		};
	} catch (error) {
		console.error(
			'Error communicating with OpenAI:',
			error.response?.data || error.message
		);
		return {
			success: false,
			message: 'Failed to fetch response from OpenAI API',
		};
	}
};
