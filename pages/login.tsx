import Router from "next/router"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { changeUser } from "../redux/userSlice"

import styles from '../styles/login.module.scss'

export default function SigIn() {
  
  const [name, setName] = useState('')
  const dispatch = useDispatch()

  function handleLogin() {
    dispatch(changeUser(name))
    window.history.back()
  }
  
  return (
    <div className={styles.signContainer}>
      <h1>Login</h1>
      <input
        className={styles.inputLogin} 
        type="text" 
        placeholder="Nome"
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  )
}