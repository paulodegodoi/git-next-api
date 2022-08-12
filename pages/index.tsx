import { GetServerSideProps } from "next"
import { useEffect, useState } from "react"

import { PaginationComponent } from '../components/PaginationComponent'
import { PaginationSelector } from "../components/PaginationSelector"

interface RepositoriesProps {
  users: {
    login: string,
    id: number
  }[]
}

interface repositorie {
  login: string
  id: number
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

  return (
    <div>
      <PaginationSelector itemsPerPage={itemsPerPage} setItemsPerPage={setItemsPerPage}/>

      <ul>
        {currentItens.map(repo => (
          <li>{repo.login}</li>
        ))}
      </ul>
      
      <PaginationComponent pages={pages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </div>
  
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const response = await fetch('https://api.github.com/users')
  
  const gitUsers: repositorie[] = []

  const data = await response.json()
  data.forEach((item: { login: string, id: number }) => gitUsers.push(
    {'login': item.login, 'id': item.id}
  ))
  
  return {
    props: {
      users: gitUsers
    }
  }
}
