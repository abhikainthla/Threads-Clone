import React, { useEffect, useState } from 'react'
import UserHeader from '../components/UserHeader'
import UserPost from '../components/UserPost'
import { useParams } from 'react-router-dom';
import useShowToast from '../hooks/useShowToast';
import { Flex, Spinner } from '@chakra-ui/react';

const UserPage = () => {
  const[user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const {username} = useParams();
  const showToast = useShowToast()
  useEffect(()=>{

    const getUser = async () =>{
      try {
        const res = await fetch(`/api/users/profile/${username}`);
        const data = await res.json();
        if(data.error){
          showToast("Error",data.error, 'error');
          return;
        }        
        setUser(data);
      } catch (error) {
        showToast("Error",error, 'error')
            }
            finally{
              setLoading(false);
            }
    }

    getUser();

  },[username, showToast])


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
    <UserPost likes={1200} replies={481} postImg="/post1.png" postTitle= "Let's talk about threads"/>
    <UserPost likes={451} replies={12} postImg="/post2.png" postTitle= "Nice Tutorial"/>
    <UserPost likes={321} replies={989} postImg="/post3.png" postTitle= "I love this guy"/>
    <UserPost likes={121} replies={51}  postTitle= "This is my first thread"/>

    </>
  )
}

export default UserPage