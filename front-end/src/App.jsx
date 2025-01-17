import React, { useState } from 'react';
import fetchChatGPTResponse from './apiService.js';
import Header from './Header.jsx';
import Footer from './Footer';
import { MdContentCopy } from 'react-icons/md'; // Correct icon for copying

const App = () => {
	const [prompt, setPrompt] = useState('');
	const [responses, setResponses] = useState([]);
	const [selectedWebsite, setSelectedWebsite] = useState(
		'www.insidephilanthropy.com'
	); // Default website
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [wordLimitExceeded, setWordLimitExceeded] = useState(false);
	const [textTooShort, setTextTooShort] = useState(false);

	const websites = [
		'www.insidephilanthropy.com',
		'www.bluetent.us',
		'www.peopleshouse.us',
	];

	const countWords = (text) => {
		return text.trim().length > 0 ? text.trim().split(/\s+/).length : 0;
	};

const hasExcessiveRepetition = (text) => {
	const words = text.trim().toLowerCase().split(/\s+/);
	const repetitionThreshold = 5; // Define the threshold for excessive repetition
	let consecutiveCount = 1;

	for (let i = 1; i < words.length; i++) {
		if (words[i] === words[i - 1]) {
			consecutiveCount++;
			if (consecutiveCount >= repetitionThreshold) {
				return true;
			}
		} else {
			consecutiveCount = 1;
		}
	}
	return false;
};

	const handleWebsiteChange = (e) => {
		setSelectedWebsite(e.target.value);
	};

	const handleInputChange = (e) => {
		const text = e.target.value;
		const wordCount = countWords(text);

		setPrompt(text);
		setWordLimitExceeded(wordCount > 5000);
		setTextTooShort(wordCount < 100);

		const repetitive = hasExcessiveRepetition(text);
		if (repetitive) {
			setError(
				'Your input contains too much repetition. Please make it more unique.'
			);
		} else {
			setError('');
		}
	};

	const handleSubmit = async () => {
		if (!prompt.trim()) {
			setError('Prompt cannot be empty.');
			return;
		}

		if (error || wordLimitExceeded || textTooShort) {
			return;
		}

		setLoading(true);
		setError('');
		setResponses([]);

		try {
			const result = await fetchChatGPTResponse(prompt, selectedWebsite);
			if (result.success) {
				setResponses(result.data);
			} else {
				setError(result.message || 'An unknown error occurred.');
			}
		} catch (err) {
			console.error('Error fetching response:', err);
			setError('Failed to generate SEO suggestions. Please try again.');
		} finally {
			setLoading(false);
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
			<div className='mb-8 w-full max-w-3xl'>
				<label
					className='block w-full font-bold text-sm max-w-3xl p-2'
					htmlFor='website-select'
				>
					Choose a site:
				</label>

				<select
					className='select w-full focus:outline-none focus:ring-0'
					value={selectedWebsite}
					onChange={handleWebsiteChange}
				>
					{websites.map((site) => (
						<option key={site} value={site}>
							{site}
						</option>
					))}
				</select>
			</div>

			<div className='relative w-full max-w-3xl mb-4'>
				<label
					className='block w-full font-bold text-sm max-w-3xl p-2'
					htmlFor='article-content'
				>
					Paste article content:
				</label>
				<div className='relative'>
					<textarea
						id='article-content'
						className='textarea w-full h-60 pr-20 pl-10 py-10 focus:outline-none focus:ring-0 focus:border-base-400'
						value={prompt}
						onChange={handleInputChange}
						placeholder='What content would you like to evaluate?'
					/>
					<div className='absolute top-2 right-4 text-gray-400 text-xs'>
						{countWords(prompt)} words
					</div>
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
				<div className='text-purple-800 mb-4'>
					<strong>Please note:</strong> {error}
				</div>
			)}

			{responses.length > 0 && (
				<div className='w-full max-w-3xl bg-base-100 p-10 mb-4 rounded-xl'>
					<h2 className='text-lg font-bold mb-4'>SEO Title & Description Suggestions</h2>
					<ul className='space-y-4'>
						{responses.map((res, index) => (
							<li key={index} className='bg-base-200 p-4 rounded-md shadow-sm'>
								<div className='flex justify-between items-start'>
									<div className='w-full'>
										<h3 className='font-semibold flex justify-between items-start'>
											{res.title}
											<button
												className='btn btn-xs btn-ghost ml-2'
												onClick={() => navigator.clipboard.writeText(res.title)}
											>
												<MdContentCopy size={14} className='text-gray-500' />
											</button>
										</h3>
										<p className='text-sm text-gray-700 flex justify-between items-start'>
											{res.description}
											<button
												className='btn btn-xs btn-ghost ml-2'
												onClick={() =>
													navigator.clipboard.writeText(res.description)
												}
											>
												<MdContentCopy size={14} className='text-gray-500' />
											</button>
										</p>
									</div>
								</div>
							</li>
						))}
					</ul>
				</div>
			)}

			<Footer />
		</div>
	);
};

export default App;
