import { Box, Button, Flex, Spinner } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import useShowToast from '../hooks/useShowToast'
import Post from '../components/Post'
import { useRecoilState } from 'recoil'
import postAtom from '../atoms/postAtom'
import SuggestedUser from '../components/SuggestedUser'

const Homepage = () => {
const showToast = useShowToast()
const [posts, setPosts] = useRecoilState(postAtom);
const [loading, setLoading] = useState(true);


  useEffect(()=>{
    const getFeedPosts =async ()=>{
      setLoading(true);
      setPosts([]);
      try {
        const res = await fetch("/api/posts/feed");
        const data = await res.json()
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
  },[showToast, setPosts])

  return (

    <Flex gap={10} alignItems={"flex-start"}>
    <Box flex={70}>
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
    </Box>
    <Box flex={30}
    display={{
      base: "none",
      md: "block"
    }}
    >
      <SuggestedUser/>
    </Box>
    </Flex>
  )
}

export default Homepage