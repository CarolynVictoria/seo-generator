import React from 'react';
import { GiBrain } from 'react-icons/gi'; // Import the icon

const Footer = () => (
	<footer className='flex flex-col justify-center items-center py-4 bg-base-200 w-full '>
		<div className='max-w-screen-sm w-full text-center px-4'>
			<p className='text-xs mb-2'>
				This app uses ChatGPT model{' '}
				<a
					href='https://openai.com/index/gpt-4o-mini-advancing-cost-efficient-intelligence/'
					className='text-blue-500 hover:underline'
					target='_blank'
					rel='noopener noreferrer'
				>
					gpt-4o-mini
				</a>{' '}
				to generate meta tag solutions based on your content.
			</p>
			<h5 className='text-sm flex justify-center items-center'>
				<GiBrain className='mr-2 text-primary text-xl' />
				SEO Title & Description Maker
			</h5>
		</div>
	</footer>
);

export default Footer;
