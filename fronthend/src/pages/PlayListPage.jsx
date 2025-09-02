import React from 'react'
import { useParams } from 'react-router-dom'

const PlayListPage = () => {
    const { PlayListId } = useParams();


  return (
      <div>PlayListPage{" " + PlayListId}</div>
  )
}

export default PlayListPage