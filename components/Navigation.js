import { Filter } from './Filter';
import styles from '../pages/styles.module.css';

export const NextButton = ({ navigateToNextImage }) => (
  <span className={`${styles.navigationButton} ${styles.nextButton}`} onClick={navigateToNextImage}>
    &#8250;
  </span>
);

export const PreviousButton = ({ navigateToPreviousImage, selectedIndex }) => (
  <>
    {selectedIndex > 1 && (
      <span className={`${styles.navigationButton} ${styles.previousButton}`} onClick={navigateToPreviousImage}>
        &#8249;
      </span>
    )}
  </>
);

export const navigateToNext = (selectedIndex, posts, setSelectedImage) => {
  const nextIndex = (selectedIndex + 1) % posts.length;
  Filter.openImage(posts[nextIndex].url, setSelectedImage);
  return nextIndex;
};

export const navigateToPrevious = (selectedIndex, posts, setSelectedImage) => {
  const nextIndex = (selectedIndex - 1 + posts.length) % posts.length;
  Filter.openImage(posts[nextIndex].url, setSelectedImage);
  return nextIndex;
};
