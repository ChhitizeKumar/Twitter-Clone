import React, { useState } from 'react';
import TweetForm from './TweetForm';
import TweetFeed from './TweetFeed';

const MiddleContent = () => {

    return (
        <div className="w-2/4 p-4 space-y-4">
            {/* Post Tweet Form */}
            <div className="bg-white p-4 rounded-lg shadow-md">
                <TweetForm />
                <TweetFeed />
            </div>

            {/* Tweet Feed */}
            
        </div>
    );
};

export default MiddleContent;
