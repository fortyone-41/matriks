import React from 'react';
import './Module.css'



const Modal = ({
    visible = false,
    actualData,
    onClose
}) => {

    if (!visible) return null

    return (
        <div className='modal' onClick={onClose}>
            <div className='modal-dialog' onClick={e => e.stopPropagation()}>
                <div className='modal-header'>
                    <h3 className='modal-title'>{actualData.name}</h3>
                    <span className='modal-close' onClick={onClose}>
                        &times;
                    </span>
                </div>
                <div className='modal-body'>

                    <div className='modal-content'>
                        <img style={{ width: "64px", height: "64px" }} src={actualData.picture.thumbnail} />
                        <h5>Пол: {actualData.gender}</h5>
                        <h5>EMail: {actualData.email}</h5>
                        <h5>Телефон: {actualData.phone}</h5>

                    </div>
                </div>
                <div className='modal-footer'><button type="button" onClick={onClose} class="btn btn-dark">Закрыть</button></div>
            </div>
        </div>
    )
}

const Module = ({ state, setState }) => {
    const [content, setContent] = React.useState()
    const [actualData, setActualData] = React.useState()
    const [nameVis, setNameVis] = React.useState('none')
    const [genderVis, setGenderVis] = React.useState('none')
    const [emailVis, setEmailVis] = React.useState('none')
    const [arrayFilter, setArrayFilter] = React.useState({})

    const updateState = () => {
        setState(prev => ({ ...prev }))
    }


    const deleteRow = (id) => {
        state.results.splice(id, 1);
        writeLS()
        updateState()
    }

    const writeLS = () => {
        localStorage.state = JSON.stringify(state.results)
    }

    const sortTable = () => {
        state.results.sort(function (a, b) {
            if (a.name > b.name) {
                writeLS()
                updateState()
                return 1;
            }
            if (a.name < b.name) {
                writeLS()
                updateState()
                return -1;
            }
            writeLS()
            updateState()
            return 0;
        });
    }

    const onClose = () => { setModal(false); setActualData(null) }

    React.useEffect(() => {
        console.log(arrayFilter)
    }, [arrayFilter])
    const filterCol = (col) => {
        //state.results = JSON.parse(localStorage.state)
        state.results.filter(item => {
            for (let i = 0; i < arrayFilter.length; i++) {
                if (item[col].toLowerCase().includes(arrayFilter[i].toLowerCase())) {
                    return true
                }
            }
            return false
        })
        updateState()
    }

    const filterForm = (link, setLink, col) => {
       return (<><button type="button" id="filterBtn" onClick={() => {
            if (link === "none") {
    
                setNameVis('none')
                setGenderVis('none')
                setEmailVis('none')
                setLink('block')
            } else {
    
                setLink('none')
            }
            filterTable(col)
        }} className="btn btn-secondary btn-sm">
            &#9660;
        </button>
            <div id="sb-search" class="sb-search">
                <form className="sb-search-form" style={{ display: link }}>
                    <div className="form-control">
                        <input class="sb-search-input"
                            onChange={(e) => filterTable(col, e.target.value)}
                            placeholder="Что будет искать?"
                            type="text"
                            name="search"
                            id="search" />
                        <div className="checkBoxs">
                            {content}
                        </div>
                        <input type="button" className="btn btn-secondary btn-sm" onClick={() => { filterCol(col); }} value="Фильтровать" />
                        <span class="sb-icon-search"></span>
                    </div>
                </form>
            </div></>)
    }
    

    const filterTable = (col, text = '') => {
        let obj = {}

        for (let item of state.results) {
            if (item[col].toLowerCase().includes(text.toLowerCase())) obj[item[col]] = false


        }

        setContent(Object.keys(obj).map(item => (<div><input type="checkbox" style={{ display: "inline" }} onChange={() => {
            if (arrayFilter[item] === true) {
                debugger
                setArrayFilter(prev => ({...prev, [item]: false}))
            }
            else {
                debugger
                setArrayFilter(prev => ({...prev, [item]: true}))
            }
        }
        } /><label> {item}</label></div>)))
    }

    const [isModal, setModal] = React.useState(false)

    React.useEffect(() => console.log(state.results))
    return (
        <div className="module">
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">Имя <input type="button" className="btn btn-secondary btn-sm" onClick={sortTable} value="Сортировать &#8595;" />
                            {filterForm(nameVis, setNameVis, 'name')}
                        </th>
                        <th scope="col">Пол
                            {filterForm(genderVis, setGenderVis, 'gender')}
                        </th>
                        <th scope="col">E-Mail
                            {filterForm(emailVis, setEmailVis, 'email')}
                        </th>
                        <th scope="col">Функции</th>
                    </tr>
                </thead>
                <tbody>
                    {state.results ?
                        state.results.map((person) =>
                        (<tr>
                            <td>{person.name}</td>
                            <td>{person.gender}</td>
                            <td>{person.email}</td>
                            <td><input type="button" className="btn btn-light" value="&#128270;" onClick={() => { setModal(true); setActualData(person) }} /><input type="button" className="btn btn-dark" value="&#10006;" onClick={() => deleteRow(state.results.indexOf(person))} /></td>
                        </tr>)
                        ) : null}
                </tbody>
            </table>
            <Modal
                visible={isModal}
                actualData={actualData}
                onClose={onClose}
            />
        </div>
    );
}

export default Module;
