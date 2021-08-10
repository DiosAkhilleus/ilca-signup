import React from 'react'
import { useParams } from 'react-router-dom';

const ViewEvent = () => {

  const { ilcaNum } = useParams();
  return (
    <div>
      {ilcaNum}
    </div>
  )
}

export default ViewEvent
