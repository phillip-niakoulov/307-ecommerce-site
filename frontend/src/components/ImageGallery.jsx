import { useState } from 'react';
import PropTypes from 'prop-types';
import '../styles/components/ImageGallery.css';

const ImageGallery = ({ imageUrls }) => {
    const [selectedImage, setSelectedImage] = useState(imageUrls[0]);

    return (
        <div className="image-gallery">
            <div className="main-image">
                <img src={selectedImage} alt="Selected product" />
            </div>
            <div className="thumbnail-gallery">
                {imageUrls.map((url, index) => (
                    <img
                        key={index}
                        src={url}
                        alt={`Thumbnail ${index + 1}`}
                        className={selectedImage === url ? 'active' : ''}
                        onClick={() => setSelectedImage(url)}
                    />
                ))}
            </div>
        </div>
    );
};

ImageGallery.propTypes = {
    imageUrls: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ImageGallery;
