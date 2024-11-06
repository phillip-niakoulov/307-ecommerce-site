import '../styles/components/ImageGallery.css';

const ImageGallery = ({ imageUrls }) => {
    return (
        <div className="imageGallery">
            {imageUrls.map((url, index) => (
                <img
                    key={index}
                    src={url}
                    alt={`Image ${url}`}
                    className="imageGalleryImage"
                />
            ))}
        </div>
    );
};

export default ImageGallery;
