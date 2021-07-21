import React from 'react'
import { Link } from 'react-router-dom';
import Axios from 'axios';

const NotFound = () => {

  

  return (
    <div>
      <h1>404 Not Found</h1>
      <Link to="/">Return to Home</Link>
    </div>
  )
}

export default NotFound
