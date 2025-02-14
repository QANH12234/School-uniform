// Import necessary modules and components
import React, { useEffect, useState } from 'react';
import './NewCollections.css';
import Item from '../Item/Item';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

// Define the NewCollections component
const NewCollections = ({ products: initialProducts = [] }) => {
    // State to manage collections, loading status, error, language, and view mode
    const [collections, setCollections] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [language, setLanguage] = useState('en');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

    // Set language based on document's language attribute
    useEffect(() => {
        const htmlLang = document.documentElement.lang;
        if (htmlLang) {
            setLanguage(htmlLang);
        }
    }, []);

    // Process initial products and set collections
    useEffect(() => {
        try {
            setIsLoading(true);
            const processedCollections = initialProducts.map(item => ({
                ...item,
                isNew: true
            }));
            setCollections(processedCollections);
        } catch (err) {
            setError('Error processing collections');
            console.error('Error processing collections:', err);
        } finally {
            setIsLoading(false);
        }
    }, [initialProducts]);

    // Display loading spinner if loading
    if (isLoading) {
        return (
            <div className="new-collections">
                <h1>{language === 'en' ? 'NEW COLLECTIONS' : 'BỘ SƯU TẬP MỚI'}</h1>
                <hr />
                <LoadingSpinner />
            </div>
        );
    }

    // Display error message if there's an error
    if (error) {
        return (
            <div className="new-collections">
                <h1>{language === 'en' ? 'NEW COLLECTIONS' : 'BỘ SƯU TẬP MỚI'}</h1>
                <hr />
                <div className="error">
                    <p>{language === 'en' ? 'Unable to load collections. Please try again later.' : 'Không thể tải bộ sưu tập. Vui lòng thử lại sau.'}</p>
                    <button onClick={() => window.location.reload()} className="retry-button">
                        {language === 'en' ? 'Retry' : 'Thử lại'}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="new-collections">
            <div className="collections-header">
                <h1>{language === 'en' ? 'NEW COLLECTIONS' : 'BỘ SƯU TẬP MỚI'}</h1>
                <div className="view-controls">
                    {/* Button to switch to grid view */}
                    <button 
                        className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                        onClick={() => setViewMode('grid')}
                        aria-label="Grid view"
                    >
                        <span className="icon">▤</span>
                    </button>
                    {/* Button to switch to list view */}
                    <button 
                        className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                        onClick={() => setViewMode('list')}
                        aria-label="List view"
                    >
                        <span className="icon">☰</span>
                    </button>
                </div>
            </div>
            <hr />
            
            {collections.length > 0 ? (
                <div className={`collections ${viewMode}`}>
                    {/* Map through collections and display each item */}
                    {collections.map((item) => (
                        <div key={item.id} className="collection-item-wrapper">
                            <div className="new-badge">
                                {language === 'en' ? 'NEW' : 'MỚI'}
                            </div>
                            <Item {...item} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="no-collections">
                    {language === 'en' 
                        ? 'No new collections available at the moment.'
                        : 'Hiện không có bộ sưu tập mới nào.'}
                </div>
            )}
        </div>
    );
};

// Export the NewCollections component
export default NewCollections;