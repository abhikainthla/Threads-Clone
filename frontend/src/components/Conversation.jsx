import { Avatar, AvatarBadge, Flex, Stack, Text, Image, WrapItem, useColorModeValue } from "@chakra-ui/react";
import React from "react";
import { useRecoilValue } from "recoil";
import  userAtom  from "../atoms/userAtom";
import {BsCheck2All, BsDot} from "react-icons/bs"

const Conversation = ({conversations}) => {
    const user = conversations.participants[0];
    const currentUser = useRecoilValue(userAtom);
    const lastMessage = conversations.lastMessage;
  return (
  <Flex 
  gap={4}
  alignItems={"center"}
  p={"1"}
  _hover={{
    cursor: "pointer",
    bg: useColorModeValue("gray.600", "gray.dark"),
    color:"white"
  }}
  borderRadius={"md"}
  >
    <WrapItem>
        <Avatar size={{
            base: "xs",
            sm: "sm",
            md: "md",

        }} src={user.profilePic}>
        <AvatarBadge boxSize="1em" bg="green.500"/>

        </Avatar>

    </WrapItem>

        <Stack direction={"column"} fontSize={"sm"}>
            <Text fontWeight={"700"} display={"flex"} alignItems={"center"}>
                {user.username} <Image src='/verified.png' w={4} h={4} ml={1} />
            </Text>
            <Text fontSize={"xs"} display={"flex"} alignItems={"center"} gap={1}>
                {currentUser._id === lastMessage.sender ? <BsCheck2All  size={16}/> : <BsDot size={16}/> }

                {lastMessage.text.length > 18 ? lastMessage.text.substring(0,18) +"..." : lastMessage.text}

            </Text>
        </Stack>

</Flex>
  )
};

export default Conversation;
