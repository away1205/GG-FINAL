import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const DATABASE_URL = import.meta.env.VITE_DATABASE;

function useComment() {
  const { id } = useParams();
  const [commentDatabase, setCommentDatabase] = useState([]);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(
    function () {
      async function fecthCommentList() {
        try {
          setComments([]);
          setIsLoading(true);
          const res = await axios.get(`${DATABASE_URL}/${id}/comment`);
          setCommentDatabase(res.data?.list_comments);
        } catch (error) {
          console.log(error);
          setCommentDatabase([]);
        } finally {
          setIsLoading(false);
        }
      }
      fecthCommentList();
    },
    [id]
  );

  useEffect(() => {
    const eventSource = new EventSource(`${DATABASE_URL}/${id}/comment/sse`);

    eventSource.onmessage = (event) => {
      const sseData = JSON.parse(event.data);
      if (sseData.newComment.video === id) {
        setComments((prevComment) => [...prevComment, sseData.newComment]);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE Error:', error);
    };

    return () => {
      eventSource.close();
    };
  }, [id]);

  return { commentDatabase, comments, isLoading };
}

export default useComment;
