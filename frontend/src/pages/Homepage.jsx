import { Button, Flex, Spinner } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import useShowToast from '../hooks/useShowToast'
import Post from '../components/Post'

const Homepage = () => {
const showToast = useShowToast()
const [posts, setPosts] = useState([]);
const [loading, setLoading] = useState(true);


  useEffect(()=>{
    const getFeedPosts =async ()=>{
      setLoading(true);
      try {
        const res = await fetch("/api/posts/feed");
        const data = await res.json()
        console.log(data)
        if(data.error){
          showToast("Error", data.error, "error");
          return
        }
        setPosts(data)
      } catch (error) {
        showToast("Error",error.message,"error")
      }
      finally{
        setLoading(false);
      }
    }
    getFeedPosts();
  },[showToast])

  return (
    <>
    {loading &&(
      <Flex justifyContent={"center"} >
        <Spinner size={"xl"}/>
      </Flex>
    )}
    {!loading && posts.length === 0 && (
      <h1>Follow some users to see the feed</h1>
    )}
    {posts.map((posts)=>(
      <Post key={posts._id} post={posts} postedBy={posts.postedBy}/>
    ))}
    </>
  )
}

export default Homepage