import React from 'react'
import { atom } from 'recoil'

const postAtom = atom({
    key: 'postAtom',
    default: []
})

export default postAtom