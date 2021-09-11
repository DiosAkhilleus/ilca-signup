import React from 'react'
import { Link } from 'react-router-dom';

const NotFound = () => { // 404 Page
  return (
    <div>
      <h1>404 Not Found</h1>
      <Link to="/ilca-signup">Return to Home</Link>
    </div>
  )
}

export default NotFound
