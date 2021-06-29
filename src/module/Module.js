import React from 'react';
//import Modal from './Modal/Modal';
import './Module.css'



const Modal = ({
    visible = false,
    setModal,
    actualData,
    setActualData,
    onClose,
    getName
}) => {

    if (!visible) return null

    return (
        <div className='modal' onClick={onClose}>
            <div className='modal-dialog' onClick={e => e.stopPropagation()}>
                <div className='modal-header'>
                    <h3 className='modal-title'>{getName(actualData.name)}</h3>
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

    const updateState = () => {
        setState(prev => ({ ...prev }))
    }
    const getName = (name) => {
        return name.title + " " + name.first + " " + name.last
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
            if (getName(a.name) > getName(b.name)) {
                writeLS()
                updateState()
                return 1;
            }
            if (getName(a.name) < getName(b.name)) {
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

    const filterCol = (col) => {
        state.results = JSON.parse(localStorage.state)
            .filter(item => (item.gender.toLowerCase().includes(col.toLowerCase())))
        updateState()
    }

    const filterTable = (col) => {
        let obj = {}
        state.results.forEach(item => {obj[item.col] = ''})
        return Object.keys(filterTable(col)).map(item => (<option>{item}</option>))
    }

    const [isModal, setModal] = React.useState(false)

    React.useEffect(() => console.log(state.results))
    return (
        <div className="module">
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">Имя <input type="button" className="btn btn-secondary btn-sm" onClick={sortTable} value="Сортировать &#8595;" />
                            <input type="text" className="form-control" onChange={(e) => { filterCol(e.target.value) }} />
                            <button onClick={() => {setContent(filterTable('gender'))}}>ff</button>
                            <select>
                                {content}
                            </select>
                        </th>
                        <th scope="col">Пол</th>
                        <th scope="col">E-Mail</th>
                        <th scope="col">Функции</th>
                    </tr>
                </thead>
                <tbody>
                    {state.results ?
                        state.results.map((person) =>
                        (<tr>
                            <td>{getName(person.name)}</td>
                            <td>{person.gender}</td>
                            <td>{person.email}</td>
                            <td><input type="button" className="btn btn-light" value="&#128270;" onClick={() => { setModal(true); setActualData(person) }} /><input type="button" className="btn btn-dark" value="&#10006;" onClick={() => deleteRow(state.results.indexOf(person))} /></td>
                        </tr>)
                        ) : null}
                </tbody>
            </table>
            <Modal
                visible={isModal}
                setModal={setModal}
                actualData={actualData}
                setActualData={setActualData}
                onClose={onClose}
                getName={getName}
            />
        </div>
    );
}

export default Module;
