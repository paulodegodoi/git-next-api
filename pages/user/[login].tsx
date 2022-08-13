import { GetServerSideProps } from 'next'
import Head from 'next/head'

import { MapPin } from 'phosphor-react'

import styles from '../../styles/[id].module.scss'

export default function Home({ user }) {

  console.log(user)

  return (
    <div className={styles.layoutContainer}>
      <Head>
        <title>Usuário</title>
      </Head>

      <main className={styles.mainContainer}>
        <img src={user.avatar_url} alt="" />
        <div className={styles.userInfo}>
          <span>ID: {user.id}</span>
          <span>login: {user.login}</span>
          <h3>{user.name}</h3>
          <span className={styles.location}>
            <MapPin size={24} />
            {user.location}
          </span>
          <div className={styles.followContainer}>
            <span>{user.followers} Seguidores</span>
            <span>{user.following} Seguindo</span>
          </div>
        </div>
      </main>
      
      
    </div>
  
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const response = await fetch(`https://api.github.com/users/${context.params!.login}`)
  
  const data = await response.json()
  
  return {
    props: {
      user: data
    }
  }
}
