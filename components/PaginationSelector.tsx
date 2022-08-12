import React from "react"

interface PaginationComponentProps {
  itemsPerPage: number
  setItemsPerPage: (Number: number) => void
}

export const PaginationSelector = ({itemsPerPage, setItemsPerPage} : PaginationComponentProps) => {
    return (
      <div>
        <span>Itens por página:</span>
        <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))}>
          <option value={5}>5</option>
          <option value={15}>10</option>
          <option value={20}>20</option>
        </select>
      </div>
    )
}