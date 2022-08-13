import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useEffect, useState } from "react"

import { PaginationComponent } from '../components/PaginationComponent'
import { PaginationSelector } from "../components/PaginationSelector"

import styles from '../styles/Home.module.scss'

interface RepositoriesProps {
  users: {
    login: string,
    id: number,
    avatar: string
  }[]
}

interface repositorie {
  login: string
  id: number
  avatar: string
}

export default function Home({ users } : RepositoriesProps) {

  console.log(users)

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

  const [search, setSearch] = useState('')
  const filteredUsers = search.length > 0
    ? currentItens.filter(user => user.login.includes(search))
    : []

  return (
    <div className={styles.homeContainter}>
      <Head>
        <title>Lista de Usuários</title>
      </Head>

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
                <a href={`http://localhost:3000/user/${user.login}`}><img src={user.avatar} alt="" /></a>
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
                <a href={`http://localhost:3000/user/${user.login}`}><img src={user.avatar} alt="" /></a>
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

export const getServerSideProps: GetServerSideProps = async () => {
  const response = await fetch('https://api.github.com/users')
  
  const gitUsers: repositorie[] = []

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
    }
  }
}
