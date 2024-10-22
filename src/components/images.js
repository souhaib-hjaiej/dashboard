import React, { useState } from 'react';
import { Box, Button, Card, CardMedia, Typography } from '@mui/material';

const ImageCarousel = ({ imageUrls }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === imageUrls.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? imageUrls.length - 1 : prevIndex - 1
    );
  };

  return (
    <Box sx={{maxWidth: 600, width: '100%', margin: 'auto', textAlign: 'center' }}>
      <Card>
        <CardMedia
          component="img"
          image={imageUrls[currentIndex]}
          alt={`Image ${currentIndex + 1}`}
          sx={{ height: 400 }}
        />
        <Typography variant="caption" sx={{ mt: 2 }}>
          {`Image ${currentIndex + 1} of ${imageUrls.length}`}
        </Typography>
      </Card>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handlePrev}
          sx={{ mr: 2 }}
        >
          Previous
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleNext}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default ImageCarousel;