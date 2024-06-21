
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  Center,
} from '@chakra-ui/react'
import { useRef, useState } from 'react'
import { useRecoilState } from 'recoil'
import userAtom from '../atoms/userAtom'
import usePreviewImg from '../hooks/usePreviewImg'
import useShowToast from '../hooks/useShowToast'

export default function UserProfilePage() {
    const [user, setUser] = useRecoilState(userAtom)
    const { handleImageChange, imgUrl } = usePreviewImg();
    const fileRef = useRef(null)
    const [updating, setUpdating] = useState(false);

    const [inputs, setInputs] = useState({
        name: user.name,
        email: user.email,
        username: user.username,
        bio: user.bio,
        profilePic: user.profilePic,
        password: ''
    })
    const showToast = useShowToast()

    const handleSubmit = async (e)=>{
        e.preventDefault();
        if(updating){
            return
        }
        setUpdating(true)
        try {
            const res = await fetch(`/api/users/update/${user._id}`,{
                method: "PUT",
                headers:{
                    "Content-Type": "application/json"
                    },
                    body: JSON.stringify({...inputs, profilePic:imgUrl})
            })
            const data = await res.json();
            if(data.error){
                showToast("Error",data.error, "error");
                return;
            }
            showToast("Success","Profile updated successfully", 'success');
            setUser(data);
            localStorage.setItem("user-threads", JSON.stringify(data));

        } catch (error) {
            showToast("Error", error, "error")
        }
        finally{
            setUpdating(false)
        }
    }
  return (
    <form onSubmit={handleSubmit}>
    <Flex
      align={'center'}
      justify={'center'}
      my={6}
    >
      <Stack
        spacing={4}
        w={'full'}
        maxW={'md'}
        bg={useColorModeValue('white', 'gray.dark')}
        rounded={'xl'}
        boxShadow={'lg'}
        p={6}
        >
        <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
          User Profile Edit
        </Heading>
        <FormControl id="userName">
          <Stack direction={['column', 'row']} spacing={6}>
            <Center>
              <Avatar size="xl" boxShadow={"md"} src={imgUrl || user.profilePic} />
            </Center>
            <Center w="full">
              <Button w="full" onClick={() => fileRef.current.click()}>Change Avatar</Button>
              <input type="file" hidden ref={fileRef} onChange={handleImageChange}/>
            </Center>
          </Stack>
        </FormControl>
        <FormControl>
          <FormLabel>Full Name</FormLabel>
          <Input
            placeholder="Your Name"
            _placeholder={{ color: 'gray.500' }}
            type="text"
            value={inputs.name}
            onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
          />
        </FormControl>
        <FormControl >
          <FormLabel>User name</FormLabel>
          <Input
            placeholder="UserName"
            _placeholder={{ color: 'gray.500' }}
            type="text"
            value={inputs.username}
            onChange={(e) => setInputs({ ...inputs, username: e.target.value })}

          />
        </FormControl>
        <FormControl >
          <FormLabel>Email address</FormLabel>
          <Input
            placeholder="your-email@example.com"
            _placeholder={{ color: 'gray.500' }}
            type="email"
            value={inputs.email}
            onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
          />
        </FormControl>
        <FormControl >
          <FormLabel>Bio</FormLabel>
          <Input
            placeholder="Your bio"
            _placeholder={{ color: 'gray.500' }}
            type="text"
            value={inputs.bio}
            onChange={(e) => setInputs({ ...inputs, bio: e.target.value })}

          />
        </FormControl>

        <Stack spacing={6} direction={['column', 'row']}>
          <Button
            bg={'red.400'}
            color={'white'}
            w="full"
            _hover={{
              bg: 'red.500',
            }}>
            Cancel
          </Button>
          <Button type='submit'
            bg={'green.400'}
            color={'white'}
            w="full"
            _hover={{
              bg: 'green.500',
            }} isLoading={updating}>
            Submit
          </Button>
        </Stack>
      </Stack>
    </Flex>
    </form>
  )
}