import React from 'react';
import { GiBrain } from 'react-icons/gi'; // Import the icon

const Header = () => (
	<header className='flex justify-center items-center py-4 mb-4 bg-base-200 sticky top-0 z-50 w-full'>
		<h1 className='text-3xl font-bold flex items-center'>
			<GiBrain className='mr-2 text-primary text-3xl' />
			SEO Title & Description Maker
		</h1>
	</header>
);

export default Header;