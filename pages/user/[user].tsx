import { GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import { userAgent } from 'next/server'

import Router from 'next/router'

import { ArrowCircleLeft, MapPin, Pencil } from 'phosphor-react'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectUser } from '../../redux/userSlice'

import styles from '../../styles/[user].module.scss'
import Link from 'next/link'

export default function Home({ user } : any) {

  useEffect(() => {
    const json = localStorage.getItem(user.id)

    if(json != null) {
      const localUser = JSON.parse(json!)
      setUserName(localUser.name)
      setUserLocation(localUser.location)
    }
  }, []);
  
  
  const [showModal, setShowModal] = useState(false)

  const [userName, setUserName] = useState('')
  const [actualUserName, setActualUserName] = useState(userName != '' ? userName : user.name)
  const [actualUserLocation, setActualUserLocation] = useState(user.location)
  const [userLocation, setUserLocation] = useState('')

  console.log(user)
  
  const { isLogged } = useSelector(selectUser)
  console.log(isLogged)

  function handleEditUser() {
    if(isLogged === false) {
      Router.push('http://localhost:3000/signIn')
    } else {
      setShowModal(true)
    }
  }

  function handleCancelEdit() {
    setShowModal(false)
    setActualUserName(actualUserName)
  }

  function handleSaveChanges(id: number) {
    setUserName(actualUserName)
    setUserLocation(actualUserLocation)

    const userChanged = {
      name: actualUserName,
      location: actualUserLocation
    }

    localStorage.setItem(`${id}`, JSON.stringify(userChanged))

    setShowModal(false)
  }

  return (
    <div className={styles.layoutContainer}>
      <Head>
        <title>Usuário</title>
      </Head>

      <div className={styles.headerUser}>

        <Link href={'http://localhost:3000'} title='Voltar para usuários' className={styles.backLink}><ArrowCircleLeft size={40} /></Link>
        <button 
          className={styles.pencilIcon} 
          title='Editar usuário'
          onClick={(e) => handleEditUser()}  
        >
            <Pencil size={32} />
        </button>

      </div>
      <main className={styles.mainContainer}>

        <img src={user.avatar_url} alt="" />

        <div className={styles.userInfo}>
          <h3>{ userName != '' ? (userName) : user.name }</h3>
          <span>ID: {user.id}</span>
          <span>login: 
            <span 
              className={styles.login}
            >
              {user.login}
            </span>
          </span>
          { userLocation != null ? (
            <span className={styles.location}>
              <MapPin size={24} />
              { userLocation != '' ? (userLocation) : user.location }
            </span>
          ) : null }
          <div className={styles.followContainer}>
            <span><strong>{user.followers}</strong> Seguidores</span>
            <span><strong>{user.following}</strong> Seguindo</span>
          </div>
        </div>

      </main>
      
      { showModal === true ? (

        <div className={styles.modalEditUser}>
          <div className={styles.infoContainer}>
            <input type="text" value={user.id} disabled/>
            <input type="text" value={user.login} disabled/>
            <input 
              type="text" 
              value={actualUserName}
              onChange={(e) => setActualUserName(e.target.value)}/>
            <input 
              type="text" 
              value={actualUserLocation} 
              onChange={(e) => setActualUserLocation(e.target.value)}
            />
            <div className={styles.buttonContainer}>
              <button className={styles.cancel} onClick={(e) => handleCancelEdit()}>Cancelar</button>
              <button className={styles.save} onClick={(e) => handleSaveChanges(user.id)}>Salvar</button>
            </div>
          </div>
          
        </div>

      ) : null } 
      
    </div>
  
  )
}


export const getStaticPaths: GetStaticPaths = async (context) => {
  return {
    paths: [
      
    ],
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const response = await fetch(`https://api.github.com/users/${context.params!.user}`)
  
  const data = await response.json()
  
  return {
    props: {
      user: data,
      data: new Date().toISOString()
    },
    revalidate: 3600
  }
}
