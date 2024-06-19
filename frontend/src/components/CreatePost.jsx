import { AddIcon } from '@chakra-ui/icons'
import { Button, FormControl, Modal, ModalBody, Text, Input, Image, ModalFooter, ModalHeader, ModalOverlay, Textarea, useColorModeValue, useDisclosure, ModalContent, ModalCloseButton, Flex, CloseButton } from '@chakra-ui/react'
import React, { useRef, useState } from 'react'
import usePreviewImg from '../hooks/usePreviewImg';
import { BsFillImageFill } from 'react-icons/bs';
import useShowToast from '../hooks/useShowToast';
import { useRecoilState, useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import postAtom from '../atoms/postAtom';
import { useParams } from 'react-router-dom';

const CreatePost = () => {
    const MAX_CHAR=500
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [postText, setPostText] = useState("");
    const [remaining, setRemaining] = useState(MAX_CHAR);
    const [updating, setUpdating] = useState(false);
    const [posts, setPosts] = useRecoilState(postAtom)
    const username = useParams();

    const showToast = useShowToast();
    const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
    const user = useRecoilValue(userAtom);
    const imageRef = useRef(null)
    const handleTextChange = (e)=>{
        const inputText = e.target.value
        if(inputText.length> MAX_CHAR){
            const truncateText = inputText.slice(0,MAX_CHAR);
            setPostText(truncateText);
            setRemaining(0);
            
        }
        else{
            setPostText(inputText);
            setRemaining(MAX_CHAR - inputText.length);
        }
    }
    const handelCreatePost = async()=>{
        if(updating){
            return
        }
        setUpdating(true);
        try {
            const res = await fetch("/api/posts/create",{
                method:"POST",
                headers:{
                    "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        postedBy:user._id,
                        text:postText,
                        img:imgUrl
                    })
            })
            const data = await res.json();
            if(data.error){
                showToast("Error",data.error,"error");
                return
            }
            showToast("Success","Post created successfully", "success")
            if(username === user.username){
                setPosts([data, ...posts]);
            }
            onClose()
            setPostText('');
            setImgUrl('');
            
        } catch (error) {
            showToast("Error", error, "error");
        }
        finally{
            setUpdating(false)
        }
    }


  return (
    <>
    <Button position={"fixed"} bottom={10} right={5}  bg={useColorModeValue("gray.300", "gray.dark")} onClick={onOpen} size={{base: "sm", sm: "md"}}><AddIcon/></Button>

    <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>

            <FormControl>
                <Textarea placeholder='Post conrent goes here'
                onChange={handleTextChange}
                value={postText}
               />
               <Text fontSize={"xs"} fontWeight={"bold"} textAlign={"right"} margin={1} color={"gray.800"}>{remaining}/500</Text>

               <Input
               type="file"
               hidden
               ref={imageRef}
               onChange={handleImageChange}
               />

                <BsFillImageFill style={{marginLeft:"5px", cursor:"pointer"}} size={16} onClick={() => imageRef.current.click()}/>

            </FormControl>

            {imgUrl && (
                <Flex mt={5} w={"full"} position={"relative"}>
                    <Image src={imgUrl} alt='Selected img'/>
                    <CloseButton
                    onClick={()=>{setImgUrl("")}}
                    bg={"gray.800"}
                    position={"absolute"}
                    top={2}
                    right={2}
                    />
                </Flex>
            )}

          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={handelCreatePost} isLoading={updating}>
                Post
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default CreatePost