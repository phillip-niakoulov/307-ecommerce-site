import '../styles/components/ImageGallery.css';
import PropTypes from 'prop-types';

const ImageGallery = ({ imageUrls }) => {
    return (
        <div className="imageGallery">
            {imageUrls.map((url, index) => (
                <img
                    key={index}
                    src={url}
                    alt={`${url}`}
                    className="imageGalleryImage"
                />
            ))}
        </div>
    );
};

ImageGallery.propTypes = {
    imageUrls: PropTypes.array,
};

export default ImageGallery;
