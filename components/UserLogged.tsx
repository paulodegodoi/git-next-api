import React, { useState } from 'react'

import { UserCircle } from 'phosphor-react'
import { useDispatch } from 'react-redux'
import { logout, selectUser } from '../redux/userSlice'

import styles from '../styles/UserLogged.module.scss'
import { useSelector } from 'react-redux'

export const UserLogged = () => {

  const { name } = useSelector(selectUser)

  const dispatch = useDispatch()

  const [showList, setShowList] = useState(false)

  function handleLogout() {
    dispatch(logout())
  }

  function handleShowList() {
    setShowList(!showList)
  }
  
  return (
    <div className={styles.container}>
      <button onClick={handleShowList}>
        <UserCircle size={32} />       
      </button>
      {showList && (
        <ul>
          <li>{name}</li>
          <li onClick={handleLogout}>Sair</li>
        </ul>
      )}
    </div>
  )
}