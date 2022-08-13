import Router from "next/router"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { changeUser } from "../redux/userSlice"

export default function SigIn() {
  
  const [name, setName] = useState('')
  const dispatch = useDispatch()

  function handleLogin() {
    dispatch(changeUser(name))
    window.history.back()
  }
  
  return (
    <div>
      <h1>Login</h1>
        <input 
          type="text" 
          placeholder="Nome"
          onChange={(e) => setName(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
    </div>
  )
}