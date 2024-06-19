import React, { useEffect, useState } from 'react'
import UserHeader from '../components/UserHeader'
import { useParams } from 'react-router-dom';
import useShowToast from '../hooks/useShowToast';
import { Flex, Spinner } from '@chakra-ui/react';
import Post from '../components/Post';
import useGetUserProfile from '../hooks/useGetUserProfile';
import { useRecoilState } from 'recoil';
import postAtom from '../atoms/postAtom';

const UserPage = () => {
  const {user, loading} =useGetUserProfile();
  const {username} = useParams();
  const [posts, setPosts] = useRecoilState(postAtom);
  const [fecthingPosts, setFetchingPosts] = useState(true)
  const showToast = useShowToast()
  useEffect(()=>{
    

    const getPosts = async ()=>{
      setFetchingPosts(true);
      try {
        const res = await fetch(`api/posts/user/${username}`)
        const data = await res.json();
        console.log(data)
        if(data.error){
          showToast("Error", data.error, "error")
          return;
        }
        setPosts(data)
      } catch (error) {
        showToast("Error", error, "error")
        setPosts([]);
      }
      finally{
        setFetchingPosts(false);
      }
    }

    getPosts()

  },[username, showToast, setPosts])






  if(!user && loading){
    return(
      <Flex justifyContent={"center"}>
         <Spinner size={"xl"} />
      </Flex>
    )
  }
  if(!user && !loading){
    return <h1>User Not Found</h1>
  }

  if(!user){
    return null;
  }

  return (
    <>
    <UserHeader user={user}/>

    {!fecthingPosts && posts.length === 0 &&(
      <h1>User has no posts.</h1>
    )}
    {fecthingPosts && (
      <Flex justifyContent={"center"} my={12}>
        <Spinner size={"xl"}/>
        </Flex>
    )}

    {posts.map((post)=>(
    <Post key={posts._id} post={post} postedBy={post.postedBy} />
    ))}
    </>
  )
}

export default UserPage