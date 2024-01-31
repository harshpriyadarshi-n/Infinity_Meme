export const Filter = {
    openImage: (imageUrl, setSelectedImage) => {
      setSelectedImage(imageUrl);
    },
  
    closeImage: (setSelectedImage) => {
      setSelectedImage(null);
    },
  
    isPostValid: (post) => {
      return (
        (!post.over_18 || post.over_18 === false) &&
        (!post.spoiler || post.spoiler === false) &&
        (post.post_hint === 'image' || post.post_hint === 'rich:video')
      );
    },
  
    loadMore: async (loading, setLoading, fetchRedditData, after, setPosts, setAfter, posts) => {
      if (loading) return;
  
      try {
        setLoading(true);
        const { posts: newPosts, after: newAfter } = await fetchRedditData(after);
  
        const newData = newPosts.filter((post) => !posts.some((p) => p.url === post.url && Filter.isPostValid(post)));
  
        setPosts((prevPosts) => [...prevPosts, ...newData]);
        setAfter(newAfter);
      } finally {
        setLoading(false);
      }
    },
  };  