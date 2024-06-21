import { SearchIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Input, Skeleton, SkeletonCircle, Text, useColorModeValue } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {GiConversation} from 'react-icons/gi'
import Conversation from "../components/Conversation";
import MessageContainer from "../components/MessageContainer";
import useShowToast from "../hooks/useShowToast";
import { useRecoilState, useRecoilValue } from "recoil";
import { conversationsAtom, selectedConversationAtom } from "../atoms/messagesAtom";
import userAtom from "../atoms/userAtom";
import { useSocket } from "../context/SocketContext";
const ChatPage = () => {

const showToast = useShowToast();
const [loading, setLoading] = useState(true);
const [conversations, setConversations] = useRecoilState(conversationsAtom);
const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom);
const [searchUser, setSearchUser] = useState('');
const [searchingUser, setSearchingUser] = useState(false)
const currentUser = useRecoilValue(userAtom)
const {socket, onlineUsers} = useSocket();


  const handleConvoSearch = async(e) =>{
    e.preventDefault()
    if(searchingUser) return;
    setSearchingUser(true)
    try {
      const res = await fetch(`/api/users/profile/${searchUser}`)
      const data = await res.json();
      if(data.error){
        showToast("Error", data.error, "error")
        return
      }
      if(data._id === currentUser._id){
        showToast("Error", "You cannot message yourself", "error");
        return;
      }

      if(conversations.find(conversations => conversations.participants[0]._id === data._id)){
        setSelectedConversation({
          _id : conversations.find(conversations => conversations.participants[0]._id === data._id)._id,
          userId: data._id,
          userProfilePic: data.profilePic,
          username: data.username
        })
        return;
      }

      const mockConvo = {
        mock:true,
        lastMessage:{
          text:"",
          sender:"",
        },
        _id:Date.now(),
        participants:[

          {
          _id: data._id,
          username: data.username,
          profilePic: data.profilePic
          } 
        ]
      }
      setConversations((prev) => [...prev, mockConvo]);
      
    } catch (error) {
      showToast("Error", error.message, "error")
      
    }
    finally{
      setSearchingUser(false);
    }

  }

  useEffect(()=>{

    socket?.on("messageSeen",({conversationId})=>{
      setConversations(prev=>{
        const updatedConversations = prev.map(conversations =>{
          if(conversations._id === conversationId){
            return{
              ...conversations,
              lastMessage:{
                ...conversations.lastMessage,
                seen:true
                }
            }
          }
          return conversations
        })
        return updatedConversations
      })
    })

  },[socket, setConversations])


    useEffect(()=>{
        const getConversations = async()=>{

            try {
                const res = await fetch("/api/messages/conversations");
                const data = await res.json();
                if(data.error){
                    showToast("Error",data.error,"error");
                    return;
                }
                setConversations(data);

            } catch (error) {
                showToast("Error",error.message,"error")
            }
            finally{
                setLoading(false);
            }
        }
        getConversations();
    },[showToast, setConversations])

  return (
    <Box
      position={"absolute"}
      left={"50%"}
      transform={"translateX(-50%)"}
      w={{ base: "100%", md: "80%", lg: "750px" }}
      p={4}
    >
      <Flex
        gap={4}
        flexDirection={{ base: "column", md: "row" }}
        maxW={{ sm: "400px", md: "100%" }}
        mx={"auto"}
      >
        <Flex
          flex={30}
          gap={2}
          flexDirection={"column"}
          maxW={{ sm: "250px", md: "full" }}
          mx={"auto"}
        >
          <Text fontWeight={700} color={useColorModeValue("gray.600", "gray.400")}>
            Your Conversations
          </Text>
          <form onSubmit={handleConvoSearch}>
            <Flex alignItems={"center"} gap={2}>
              <Input placeholder="Search user" value={searchUser} onChange={(e)=> setSearchUser(e.target.value)}/>
              <Button size={"sm"} onClick={handleConvoSearch} isLoading={searchingUser}>
                <SearchIcon />
              </Button>
            </Flex>
          </form>

          {loading && (
            [0,1,2,3,4].map((_, i)=>(
                <Flex key={i} gap={4} alignItems={"center"} p={"1"} borderRadius={"md"}>
                    <Box>
                        <SkeletonCircle size={"10"}/>
                    </Box>
                    <Flex w={"full"} flexDirection={"column"} gap={3}>
                        <Skeleton h={"10px"} w={"80px"}/>
                        <Skeleton h={"8px"} w={"90%"}/>
                    </Flex>
                </Flex>
            ))
          
          )}

          {!loading && (
            conversations.map(conversations =>(
                <Conversation key={conversations._id} conversation={conversations} isOnline={onlineUsers.includes(conversations.participants[0]._id)}/>
            ))
          )}


        </Flex>
        {!selectedConversation._id && (
          <Flex flex={70} borderRadius={"md"} p={2} flexDirection={"column"} alignItems={"center"} justifyContent={"center"} height={"400px"}>
          <GiConversation size={100}/>
          <Text fontSize={20} >
              Select a conversation to start messaging
          </Text>
      </Flex>
        )}
        {selectedConversation._id &&(
        <MessageContainer/>

        )}

      </Flex>
    </Box>
  );
};

export default ChatPage;
