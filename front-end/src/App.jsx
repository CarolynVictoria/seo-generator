import React, { useState } from 'react';
import { MdContentCopy } from 'react-icons/md';
import fetchChatGPTResponse from './apiService.js';
import Header from './Header.jsx';
import Footer from './Footer';

const App = () => {
	const [prompt, setPrompt] = useState('');
	const [responses, setResponses] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [wordLimitExceeded, setWordLimitExceeded] = useState(false);
	const [textTooShort, setTextTooShort] = useState(false);

	// Utility function to count words
	const countWords = (text) => {
		return text.trim().length > 0 ? text.trim().split(/\s+/).length : 0;
	};

	// Utility function to check for repetitive content
	const hasExcessiveRepetition = (text) => {
		const words = text.trim().toLowerCase().split(/\s+/);
		const wordCount = words.length;
		const uniqueWords = new Set(words).size;

		// Example threshold: Unique words should be at least 50% of total words
		return uniqueWords / wordCount < 0.5;
	};

	// Handle input change
	const handleInputChange = (e) => {
		const text = e.target.value;
		const wordCount = countWords(text);

		setPrompt(text);
		setWordLimitExceeded(wordCount > 5000);
		setTextTooShort(wordCount < 100);

		// Validate for repetitive content
		const repetitive = hasExcessiveRepetition(text);
		if (repetitive) {
			setError(
				'Your input contains too much repetition. Please make it more unique.'
			);
		} else {
			setError(''); // Clear the error if validation passes
		}
	};

	// Handle form submission
	const handleSubmit = async () => {
		// Check for an empty prompt
		if (!prompt.trim()) {
			setError('Prompt cannot be empty.');
			return; // Prevent submission if the prompt is empty
		}

		// Prevent submission if there are other validation errors
		if (error || wordLimitExceeded || textTooShort) {
			return;
		}

		setLoading(true);
		setError(''); // Clear previous errors
		setResponses([]); // Clear previous responses

		try {
			// Fetch the response from the API
			const result = await fetchChatGPTResponse(prompt);
			console.log('Received response:', result);

			if (result.success) {
				setResponses(result.data); // Process successful response
			} else {
				// Explicitly handle backend errors
				setError(result.error || 'An unknown error occurred.');
			}
		} catch (err) {
			// Handle frontend or Axios-related errors
			console.error('Error fetching response:', err);
			if (err.response?.status === 400) {
				setError(
					err.response.data.error || 'Invalid request. Please check your input.'
				);
			} else {
				setError('Failed to generate SEO suggestions. Please try again.');
			}
		} finally {
			setLoading(false); // Reset loading state
		}
	};


	const handleClear = () => {
		setPrompt('');
		setResponses([]);
		setError('');
		setWordLimitExceeded(false);
		setTextTooShort(false);
	};

	return (
		<div className='min-h-screen bg-base-200 text-base-content flex flex-col items-center p-4'>
			<Header />
			<h2 className='relative w-full text-lg max-w-3xl mb-0 p-4'>
				Your article content:
			</h2>

			<div className='relative w-full max-w-3xl mb-4'>
				<textarea
					className='textarea w-full h-60 pr-20 pl-10 py-10 focus:outline-none focus:ring-0 focus:border-base-400'
					value={prompt}
					onChange={handleInputChange}
					placeholder='What content would you like to evaluate?'
				/>
				<div className='absolute top-2 right-4 text-gray-400 text-xs'>
					{countWords(prompt)} words
				</div>
			</div>

			{wordLimitExceeded && (
				<div className='text-red-500 mb-4'>
					Input exceeds limit of 5000 words. Please reduce the word count.
				</div>
			)}

			{textTooShort && (
				<div className='text-gray-400 mb-4'>
					Input must contain at least 100 words to analyze properly.
				</div>
			)}

			<div className='flex space-x-4 mt-2 mb-10'>
				<button
					className='btn btn-primary '
					onClick={handleSubmit}
					disabled={loading || wordLimitExceeded || textTooShort}
				>
					Suggest SEO Meta Content
				</button>
				<button
					className='btn bg-blue-500 hover:bg-blue-600 text-white'
					onClick={handleClear}
					disabled={loading}
				>
					Clear
				</button>
			</div>

			{loading && (
				<div className='flex justify-center items-center'>
					<div className='spinner-border animate-spin inline-block w-6 h-6 border-4 border-blue-500 rounded-full border-t-transparent'></div>
				</div>
			)}

			{error && (
				<div className='text-red-500 mb-4'>
					<strong>Error:</strong> {error}
				</div>
			)}

			{responses.length > 0 && (
				<div className='w-full max-w-3xl bg-base-100 p-10 mb-4 rounded-xl'>
					<div className='mb-6'>
						<h2 className='text-lg font-bold text-blue-500 mb-2'>
							SEO Title Suggestions
						</h2>
						<div className='space-y-4'>
							{responses.map((res, index) => (
								<div
									key={`title-${index}`}
									className='space-y-1 bg-base-200 p-3 rounded-md'
								>
									<div className='flex justify-between'>
										<p
											className='mr-2 flex-1'
											style={{
												textIndent: '-1.2em',
												paddingLeft: '1.5em',
											}}
										>
											<strong className='text-gray-500'>{index + 1}.</strong>{' '}
											{res.title}{' '}
											<span className='text-xs text-gray-500'>
												({res.title.length} characters)
											</span>
										</p>
										<button
											className='btn btn-xs btn-ghost self-start'
											onClick={() => navigator.clipboard.writeText(res.title)}
										>
											<MdContentCopy className='text-lg' />
										</button>
									</div>
								</div>
							))}
						</div>
					</div>

					<div>
						<h2 className='text-lg font-bold text-blue-500 mb-2 mt-10'>
							SEO Description Suggestions
						</h2>
						<div className='space-y-4'>
							{responses.map((res, index) => (
								<div
									key={`description-${index}`}
									className='space-y-1 bg-base-200 p-3 rounded-md'
								>
									<div className='flex justify-between'>
										<p
											className='mr-2 flex-1'
											style={{
												textIndent: '-1.2em',
												paddingLeft: '1.5em',
											}}
										>
											<strong className='text-gray-500'>{index + 1}.</strong>{' '}
											{res.description}{' '}
											<span className='text-xs text-gray-500'>
												({res.description.length} characters)
											</span>
										</p>
										<button
											className='btn btn-xs btn-ghost self-start'
											onClick={() =>
												navigator.clipboard.writeText(res.description)
											}
										>
											<MdContentCopy className='text-lg' />
										</button>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			)}
			<Footer />
		</div>
	);
};

export default App;
