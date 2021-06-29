import './App.css';
import React from 'react';
import Module from './module/Module';



function App() {
  const [state, setState] = React.useState({})
  const countRef = React.useRef()
  const getState = (count) => {
    localStorage.count = count
    fetch('https://api.randomuser.me/?results=' + count).then(res => res.json()).then(data => {
      data.results.forEach(item => {
        item.gender = getGender(item.gender)
      })
      setState(data)
      localStorage.state = JSON.stringify(state.results)
    })

  }

  const getGender = (gender) => {
    switch (gender) {
      case "female": {
        return "Женский"
      }
      case "male": {
        return "Мужской"
      }
    }
  }

  React.useEffect(() => {
    getState(localStorage.count || 1)
    if (countRef.current && localStorage.count) countRef.current.value = localStorage.count
  }, [])

  return (
    <div className="main">
      <div class="input-group mb-3">
        <span class="input-group-text" id="basic-addon1">Пользователи</span>
        <input type="text" class="form-control" placeholder="Введите количество пользователей" ref={countRef} onChange={() => getState(countRef.current.value)} aria-label="Users" aria-describedby="basic-addon1" />
        <button class="btn btn-outline-dark" type="button" id="button-addon2">Фильтр</button>
      </div>
      {state ? <Module state={state} setState={setState} /> : null}
    </div>
  );
}

export default App;
