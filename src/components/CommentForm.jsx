import { Button, Flex, Input } from '@chakra-ui/react';
import { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const DATABASE_URL = import.meta.env.VITE_DATABASE;

function CommentForm() {
  const [comment, setComment] = useState('');
  const [username, setUsername] = useState('');
  const { id } = useParams();

  const newComment = new URLSearchParams();
  newComment.append('username', capitalize(username));
  newComment.append('comment', comment);

  function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  async function handlePostComment(ev) {
    ev.preventDefault();

    try {
      await axios.post(`${DATABASE_URL}/${id}/comment`, newComment.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      setComment('');
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  return (
    <form onSubmit={handlePostComment}>
      <Flex mt='auto' flexDir={'column'} gap={4}>
        <Input
          value={username}
          onChange={(ev) => setUsername(ev.target.value)}
          placeholder='username'
        />

        <Input
          value={comment}
          onChange={(ev) => setComment(ev.target.value)}
          placeholder='comment'
        />

        <Button type='submit' colorScheme='blue'>
          Add
        </Button>
      </Flex>
    </form>
  );
}

export default CommentForm;
