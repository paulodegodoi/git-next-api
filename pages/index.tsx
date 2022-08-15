import { GetStaticProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'

import { useEffect, useState } from "react"
import { useSelector } from 'react-redux'
import { selectUser } from '../redux/userSlice'

import { UserLogged } from '../components/UserLogged'
import { PaginationComponent } from '../components/PaginationComponent'
import { PaginationSelector } from "../components/PaginationSelector"

import { baseUrl, gitHubApi } from '../lib/connect'

import styles from '../styles/Home.module.scss'

interface RepositoriesProps {
  users: {
    login: string,
    id: number,
    avatar: string
  }[],
  date: string
}

interface repositorie {
  login: string
  id: number
  avatar: string
}

export default function Home({ users } : RepositoriesProps) {

  const userLogged = useSelector(selectUser)

  // Pagination
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [currentPage, setCurrentPage] = useState(0)

  const pages = Math.ceil(users.length / itemsPerPage)
  const startIndex = currentPage * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentItens = users.slice(startIndex, endIndex)

  useEffect(() => {
    setCurrentPage(0)
  }, [itemsPerPage])

  // SeachFilter
  const [search, setSearch] = useState('')
  const filteredUsers = search.length > 0
    ? currentItens.filter(user => user.login.includes(search))
    : []

  return (
    
    <div className={styles.homeContainter}>

      <Head>
        <title>Lista de Usuários</title>
      </Head>

      <h1>Usuários GitHub</h1>

      { userLogged.isLogged != false && 
        <UserLogged />
      }

      <div className={styles.paginationContainer}>
        <PaginationSelector itemsPerPage={itemsPerPage} setItemsPerPage={setItemsPerPage}/>
        <PaginationComponent pages={pages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
      </div>

      <input 
        className={styles.inputSearch}
        type="text"
        placeholder="Buscar" 
        onChange={(e) => setSearch(e.target.value)}
        value={search}
      />

      <main className={styles.mainContainer}>
        
        { search.length > 0 ? (
          <ul>
            {filteredUsers.map(user => (
              <li key={user.id}>
                <Link href={`${baseUrl}/user/${user.login}`}>
                  <a><img src={user.avatar} alt="" /></a>
                </Link>
                <div className={styles.userInfo}>
                  <span>ID: {user.id}</span>
                  <span>{user.login}</span>
                 
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <ul>
            {currentItens.map(user => (
              <li key={user.id}>
                <Link href={`${baseUrl}/user/${user.login}`}>
                  <a><img src={user.avatar} alt="" /></a>
                </Link>
                <div className={styles.userInfo}>
                  <span>ID: {user.id}</span>
                  <span>{user.login}</span>
                </div>
              </li>
            ))}
          </ul>
        )}

      </main>
      
    </div>
  
  )
}

export const getStaticProps: GetStaticProps = async () => {
  
  const gitUsers: repositorie[] = []
  
  const response = await fetch(gitHubApi)
  const data = await response.json()

  data.forEach((item: { login: string, id: number, avatar_url: string }) => gitUsers.push(
    {
      'login': item.login, 
      'id': item.id,
      'avatar': item.avatar_url
    }
  ))
  
  return {
    props: {
      users: gitUsers
    },
    revalidate: 3600
  }
}
