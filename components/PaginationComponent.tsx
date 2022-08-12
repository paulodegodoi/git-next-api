import React from "react"

interface PaginationComponentProps {
  pages: number
  currentPage: number
  setCurrentPage: (Number: number) => void
}

export const PaginationComponent = ({pages, currentPage, setCurrentPage} : PaginationComponentProps) => {
    return (
      <div>
        {Array.from(Array(pages), (item, index) => {
          return (
            <button 
              style={index === currentPage ? { backgroundColor: "gray"} : undefined}
              value={index} 
              onClick={(e) => setCurrentPage(Number((e.target as HTMLTextAreaElement).value))}>{index + 1}
            </button>
        )})}
      </div>
    )
}