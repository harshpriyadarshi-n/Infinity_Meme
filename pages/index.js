import { Fragment, useState, useEffect } from 'react';
import Image from 'next/image';
import logo from '../public/logo.png';
import { fetchRedditData } from '../components/RedditData';
import { Filter } from '../components/Filter';
import { NextButton, PreviousButton, navigateToNext, navigateToPrevious } from '../components/Navigation';
import styles from './styles.module.css';

export default function Home({ initialPosts, initialAfter }) {
  const [posts, setPosts] = useState(initialPosts || []);
  const [after, setAfter] = useState(initialAfter || null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadInitialMemes() {
      const { posts: initialPosts, after: initialAfter } = await fetchRedditData(null);
      setPosts(initialPosts);
      setAfter(initialAfter);
    }

    loadInitialMemes();
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [after]);

  const handleScroll = () => {
    const threshold = 100;
    const distanceFromBottom =
      document.documentElement.offsetHeight - (window.innerHeight + document.documentElement.scrollTop);

    if (distanceFromBottom <= threshold && !loading) {
      Filter.loadMore(loading, setLoading, fetchRedditData, after, setPosts, setAfter, posts);
    }
  };

  const handleNavigateToNext = () => {
    setSelectedIndex(navigateToNext(selectedIndex, posts, setSelectedImage));
  };

  const handleNavigateToPrevious = () => {
    setSelectedIndex(navigateToPrevious(selectedIndex, posts, setSelectedImage));
  };

  return (
    <Fragment>
      <div className={styles.greenBar}>
        <div className={styles.logoContainer}>
          <a href="https://www.reddit.com/r/memes/">
            <Image src={logo} alt="r/memes from Reddit" height={310} width={310} />
          </a>
        </div>
      </div>
      <div className={styles.background}>
        <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <div className="grid grid-cols-3 gap-x-2 gap-y-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 xl:gap-x-2">
            {posts.map((post, index) => (
              <Fragment key={post.url}>
                {Filter.isPostValid(post) ? (
                  <a className="group">
                    <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-white xl:aspect-h-8 xl:aspect-w-7"
                    style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
                      <Image
                        height={100}
                        width={100}
                        loading="lazy"
                        key={post.key}
                        src={post.thumbnail}
                        alt={post.title}
                        onClick={() => {
                          Filter.openImage(post.url, setSelectedImage);
                          setSelectedIndex(index);
                        }}
                        style={{ cursor: 'pointer' }}
                        className="h-full w-full object-cover object-center group-hover:opacity-75"
                      />
                    </div>
                  </a>
                ) : (
                  <Fragment>
                    {/* Placeholder for unwanted posts */}
                  </Fragment>
                )}
              </Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Full Resolution Image */}
      {selectedImage && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <span className={styles.close} onClick={() => Filter.closeImage(setSelectedImage)}>
              &times;
            </span>
            <img src={selectedImage} alt="Full Resolution" />
            <PreviousButton navigateToPreviousImage={handleNavigateToPrevious} selectedIndex={selectedIndex} />
            <NextButton navigateToNextImage={handleNavigateToNext} />
          </div>
        </div>
      )}

      {loading && (<div style={{ textAlign: 'center', fontFamily: 'Gilroy, Gilroy'}}><p>Hold Up! Stealing more memes...</p></div>)}

      <div className={styles.GithubButton}>
        <a href="https://github.com/harshpriyadarshi-n/Infinity_Meme">
          <button>GitHub</button>
        </a>
      </div>
    </Fragment>
  );
}

export async function getStaticProps() {
  const { posts: initialPosts, after: initialAfter } = await fetchRedditData(null);

  return {
    props: { initialPosts, initialAfter },
    revalidate: 60,
  };
}