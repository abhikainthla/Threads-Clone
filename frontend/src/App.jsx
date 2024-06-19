import { Box, Container } from "@chakra-ui/react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import PostPage from "./pages/PostPage";
import Header from "./components/Header";
import Homepage from "./pages/Homepage";
import AuthPage from "./pages/AuthPage";
import { useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom";
import UpdateProfilePage from "./pages/UpdateProfilePage";
import UserPage from "./pages/UserPage";
import CreatePost from "./components/CreatePost";
import ChatPage from "./pages/ChatPage";
function App() {
	const user = useRecoilValue(userAtom);
	const { pathname } = useLocation();
	return (
		<Box position={"relative"} w='full'>
			<Container maxW={"620px"}>
				<Header />
				<Routes>
					<Route path='/' element={user ? <Homepage /> : <Navigate to='/auth' />} />
					<Route path='/auth' element={!user ? <AuthPage /> : <Navigate to='/' />} />
					<Route path='/update' element={user ? <UpdateProfilePage /> : <Navigate to='/auth' />} />
          			<Route path="/:username" element={user ? (<> <UserPage/> <CreatePost/></>) : (<UserPage/>) }/>
					<Route path='/:username/posts/:pid' element={<PostPage />} />
					<Route path='/chat' element={ user ? <ChatPage/> : <Navigate to={"/auth"}/>} />
				</Routes>
			</Container>
		</Box>
	);
}

export default App;