import './App.css';
import axios from 'axios';

function App() {
  const postSailor = () => {
    axios
      .post('http://localhost:3001/insertsailor', {
        sailorID: 'AUTAM6',
        name: {
          firstName: 'Anton',
          familyName: 'Messeritsch',
        },
        sailNumber: 'AUT212844',
        rig: '4.7',
        dateEntered: '18 Jun 2021',
        country: 'Austria',
      })
      .then(console.log('sailor posted'));
  };

  const getSailors = () => {
    console.log('sailors retrieved');
  }

  return (
    <div className="App">
      <button onClick={() => postSailor()}>Post Sailor</button>
      <button onClick={() => getSailors()}>Get Sailors</button>
    </div>
  );
}

export default App;
