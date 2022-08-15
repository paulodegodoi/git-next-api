import { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import Router from 'next/router'

import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectUser } from '../../redux/userSlice'

import { UserLogged } from '../../components/UserLogged'

import { ArrowCircleLeft, MapPin, Pencil } from 'phosphor-react'
import styles from '../../styles/[user].module.scss'
import { baseUrl, gitHubApi } from '../../lib/connect'

export default function Home({ user } : any) {

  useEffect(() => {
    const json = localStorage.getItem(user.id)

    if(json != null) {
      const localUser = JSON.parse(json!)
      setUserName(localUser.name)
      setUserLocation(localUser.location)
    }
  }, []);
  
  const userLogged = useSelector(selectUser)

  const [showModal, setShowModal] = useState(false)

  const [userName, setUserName] = useState('')
  const [actualUserName, setActualUserName] = useState(userName != '' ? userName : user.name)
  const [actualUserLocation, setActualUserLocation] = useState(user.location)
  const [userLocation, setUserLocation] = useState('')
  
  const { isLogged } = useSelector(selectUser)

  function handleEditUser() {
    if(isLogged === false) {
      Router.push(`${baseUrl}/login`)
    } else {
      setActualUserName(document.getElementById('userName')?.innerText!)
      setActualUserLocation(document.getElementById('userLocation')?.innerText!)

      setShowModal(true)
    }
  }

  function handleCancelEdit() {
    setShowModal(false)
  }

  function handleSaveChanges(id: number) {
    setUserName(actualUserName)
    setUserLocation(actualUserLocation)

    // Save changes on LocalStorage
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
        <title>{user.name}</title>
      </Head>

      { userLogged.isLogged != false && 
        <UserLogged />
      }

      <div className={styles.headerUser}>

        <Link 
          href={baseUrl} 
          title='Voltar para usuários' 
          className={styles.backLink}
        >
          <button className={styles.arrowBackButton}>
            <ArrowCircleLeft size={40} />
          </button>
        </Link>
        <button 
          className={styles.pencilButton} 
          title='Editar usuário'
          onClick={(e) => handleEditUser()}  
        >
            <Pencil size={32} />
        </button>

      </div>
      
      <main className={styles.mainContainer}>

        <img src={user.avatar_url} alt="" />

        <div className={styles.userInfo}>
          <h3 id='userName'>{ userName != '' ? (userName) : user.name }</h3>
          <span>ID: 
            <strong>{user.id}</strong>
          </span>
          <span>login: 
            <span 
              className={styles.login}
            >
              <strong>
                {user.login}
              </strong>
            </span>
          </span>
          { userLocation != null ? (
            <span id='userLocation' className={styles.location}>
              <MapPin size={24} />
              <strong>{ userLocation != '' ? (userLocation) : user.location }</strong>
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
            <h1>Editar Usuário</h1>
            <label>ID</label>
            <input type="text" value={user.id} disabled/>
            <label>username</label>
            <input type="text" value={user.login} disabled/>
            <label htmlFor="">Nome</label>
            <input 
              type="text" 
              value={actualUserName}
              onChange={(e) => setActualUserName(e.target.value)}/>
            <label htmlFor="">Localização</label>
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


export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const response = await fetch(`${gitHubApi}/${context.params!.user}`)
  
  const data = await response.json()
  
  return {
    props: {
      user: data,
      data: new Date().toISOString()
    },
    revalidate: 3600
  }
}
