import React, { useState } from 'react'
import SignupCard from '../components/SignupCard'
import Login from '../components/Login'
import { useRecoilState, useRecoilValue } from 'recoil'
import authScreenAtom from '../atoms/authAtoms'

const AuthPage = () => {
    const authScreenState = useRecoilValue(authScreenAtom);
  return (
    <>
    {authScreenState === 'login' ? <Login/> : <SignupCard/>}
    </>
  )
}

export default AuthPage