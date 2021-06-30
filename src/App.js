import './App.css';
import React from 'react';
import Module from './module/Module';



function App() {

  const [state, setState] = React.useState([])
  const [page, setPage] = React.useState([])
  const [pageNum, setPageNum] = React.useState(1)
  const [countOnPage, setCountOnPage] = React.useState()
  const countRef = React.useRef()
  

  
  const calculatePage = (state) => {
    setPage([])
    for (let i = 1; i <= Math.ceil(state.length / (countOnPage || 10)); i++) {
      setPage(prev => ([...prev.concat(i)]))
    }
  }

  const getState = (count) => {
    localStorage.count = count
    fetch('https://api.randomuser.me/?results=' + count)
      .then(res => { return res.json() })
      .then(data => {
        data.results.forEach(item => {
          item.name = getName(item.name)
          item.gender = getGender(item.gender)
        })
        localStorage.state = JSON.stringify(data.results)
        calculatePage(data.results)
        setState(data.results)
      })

  }

  const getName = (name) => {
    return name.title + " " + name.first + " " + name.last
  }

  const getGender = (gender) => {
    switch (gender) {
      case "female": {
        return "Женский"
      }
      case "male": {
        return "Мужской"
      }
      default: break
    }
  }

  React.useEffect(() => {
    getState(localStorage.count || 1)
    if (countRef.current && localStorage.count)
      countRef.current.value = localStorage.count
  }, [])


  return (
    <div className="main">
      <div className="input-group mb-3">
        <span className="input-group-text" id="basic-addon1">Пользователи</span>
        <input
          type="number"
          className="form-control"
          placeholder="Введите количество пользователей"
          ref={countRef} onChange={() => getState(countRef.current.value)}
          aria-label="Users"
          aria-describedby="basic-addon1" />
        <span className="input-group-text">Текущая страница: {pageNum}</span>
      </div>
      {state ?
        <Module
          page={page}
          calculatePage={calculatePage}
          state={state}
          setState={setState}
          pageNum={pageNum}
          setPageNum={setPageNum}
          setCountOnPage={setCountOnPage}
          countOnPage={countOnPage}
        />
        : null}
    </div>
  );
}

export default App;
