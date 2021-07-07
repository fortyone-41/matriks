import React from 'react';
import './Module.css';
import filterImg from '../img/filter.png'



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
                        <img
                            style={{ width: "64px", height: "64px" }}
                            alt="IMG USER"
                            src={actualData.picture.thumbnail} />
                        <h5>Пол: {actualData.gender}</h5>
                        <h5>EMail: {actualData.email}</h5>
                        <h5>Телефон: {actualData.phone}</h5>

                    </div>
                </div>
                <div className='modal-footer'>
                    <button
                        type="button"
                        onClick={onClose}
                        className="btn btn-dark">
                        Закрыть
                    </button>
                </div>
            </div>
        </div>
    )
}

const Module = ({ state, setState, page, calculatePage, pageNum, setPageNum, setCountOnPage, countOnPage }) => {
    const [content, setContent] = React.useState()
    const [actualData, setActualData] = React.useState()
    const [nameVis, setNameVis] = React.useState('none')
    const [genderVis, setGenderVis] = React.useState('none')
    const [emailVis, setEmailVis] = React.useState('none')
    const [isModal, setModal] = React.useState(false)
    const [nameFilter, setNameFilter] = React.useState([])
    const [genderFilter, setGenderFilter] = React.useState([])
    const [emailFilter, setEmailFilter] = React.useState([])


    class filterTableClass extends React.Component {
        constructor(link, setLink, col, array) {
            super()
            this.link = link
            this.setLink = setLink
            this.col = col
            this.array = array
        }

        writeToObj(item, obj, text, num, divider = " ") {
            if (item.split(divider)[num]
                .toLowerCase()
                .includes(text.toLowerCase()))
                return obj[item.split(divider)[num]] = false
        }

        filterTable(col, text = '') {
            this.obj = {}
            state = JSON.parse(localStorage.state).sort(function (a, b) {
                if (a.name > b.name) {
                    return 1;
                }
                if (a.name < b.name) {
                    return -1;
                }
                return 0;
            });
            for (let item of state) {
                switch (col) {
                    case 'name': {
                        this.writeToObj(item[col], this.obj, text, "0")
                        break
                    }
                    case 'gender': {
                        this.writeToObj(item[col], this.obj, text, "0")
                        break
                    }
                    case 'email': {
                        this.writeToObj(item[col], this.obj, text, "1", "@")
                        break
                    }
                    default: break
                }

            }
            setContent(Object.keys(this.obj).map(item => (
                <div>
                    <input type="checkbox" style={{ display: "inline" }}
                        onLoadStart={(e) => this.array.includes(item) ? 'checked' : null}
                        onChange={(e) => {
                            if (!e.target.checked) {
                                this.array(prev => ([...prev.filter(d => d !== item)]))
                            }
                            else {
                                this.array(prev => ([...prev.concat(item)]))
                            }

                            return this.array
                        }
                        } />
                    <label> {item}</label>
                </div>)))
        }

        render() {
            return (
                <>
                    <button
                        type="button"
                        id="filterBtn"
                        onClick={() => {
                            if (this.link === "none") {
                                setNameVis('none')
                                setGenderVis('none')
                                setEmailVis('none')
                                this.setLink('block')
                            } else {
                                this.setLink('none')
                            }
                            this.filterTable(this.col)
                        }}
                        className="btn btn-secondary btn-sm"
                    >
                        <img src={filterImg} height="15px" />
                    </button>

                    <div id={"sb-search" + this.col} className="sb-search">
                        <form className="sb-search-form" style={{ display: this.link }}>
                            <div className="form-control">
                                <input
                                    id={"sb-search-input" + this.col}
                                    className="sb-search-input"
                                    onChange={(e) => this.filterTable(this.col, e.target.value)}
                                    placeholder="Что будетe искать?"
                                    type="text"
                                    name="search"
                                />
                                <div className="checkBoxs">
                                    {content}
                                </div>

                                <input
                                    type="button"
                                    className="btn btn-secondary btn-sm"
                                    onClick={() => { filterAll(); }}
                                    value="Фильтровать" />
                                <span className="sb-icon-search"></span>
                            </div>
                        </form>
                    </div>
                </>
            )
        }

    }

    const filterName = new filterTableClass(nameVis, setNameVis, 'name', setNameFilter)
    const filterGender = new filterTableClass(genderVis, setGenderVis, 'gender', setGenderFilter)
    const filterEmail = new filterTableClass(emailVis, setEmailVis, 'email', setEmailFilter)


    const onClose = () => { setModal(false); setActualData(null) }

    const filterCol = (col, array, state) => {
        return state.filter(item => {
            for (let i = 0; i < array.length; i++) {
                if (item[col].toLowerCase().includes(array[i].toLowerCase())) {
                    return true
                }
            }
            return false
        })
    }

    const filterAll = () => {
        let tempState = []
        tempState = JSON.parse(localStorage.state)
        tempState = filterCol('name', nameFilter.length === 0 ? [''] : nameFilter, tempState)
        tempState = filterCol('gender', genderFilter.length === 0 ? [''] : genderFilter, tempState)
        tempState = filterCol('email', emailFilter.length === 0 ? [''] : emailFilter, tempState)
        setState(tempState)
        calculatePage(tempState)
        setPageNum(1)
    }
    const deleteRow = (name) => {
        localStorage.state = JSON.stringify(JSON
            .parse(localStorage.state)
            .filter((d) => d.name !== name))
        setState(JSON
            .parse(localStorage.state))
        calculatePage(state)
        filterAll()
        setPageNum(1)
    }

    const sortTable = () => {
        localStorage.state = JSON
            .stringify(JSON
                .parse(localStorage.state)
                .sort(function (a, b) {
                    if (a.name > b.name) {
                        return 1;
                    }
                    if (a.name < b.name) {
                        return -1;
                    }
                    return 0;
                }));
        setState(JSON
            .parse(localStorage.state))
        filterAll()
    }

    React.useEffect(() => {
        setNameVis('none')
        setGenderVis('none')
        setEmailVis('none')
    }, [state])

    React.useEffect(() => {
        calculatePage(state);
    }, [countOnPage])

    return (
        <div className="module">
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">Имя	&#160;
                            <input
                                type="button"
                                className="btn btn-secondary btn-sm"
                                onClick={sortTable}
                                value="Сортировать &#8595;" />
                            {filterName.render()}
                        </th>
                        <th scope="col">Пол	&#160;
                            {filterGender.render()}
                        </th>
                        <th scope="col">E-Mail	&#160;
                            {filterEmail.render()}
                        </th>
                        <th scope="col">Функции</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        state.map((person, index) => {
                            if (index >= (pageNum || 1) * countOnPage - countOnPage && index < (pageNum || 1) * countOnPage)
                                return (<tr key={index}>
                                    <td>{person.name}</td>
                                    <td>{person.gender}</td>
                                    <td>{person.email}</td>
                                    <td>
                                        <input
                                            type="button"
                                            className="btn btn-light"
                                            value="&#128270;"
                                            onClick={() => { setModal(true); setActualData(person) }} />
                                        <input
                                            type="button"
                                            className="btn btn-dark"
                                            value="&#10006;"
                                            onClick={() => deleteRow(person.name)} />
                                    </td>
                                </tr>)
                        })
                    }
                </tbody>
            </table>

            <nav aria-label="..." style={{ position: "relative", marginBottom: "60px" }}>
                <ul className="pagination pagination-sm" style={{ position: "absolute", left: "50%", right: "50%", zIndex: "-1" }}>
                    {page.map(i => {
                        if (i === 1) return (
                            <>
                                <li key={i} id={"page" + i}
                                    className={i === pageNum ? "page-item active" : "page-item"}
                                    onClick={() => { setPageNum(i); }}>
                                    <a className="page-link" href="#">{i}</a>
                                </li>
                                {i + 2 >= pageNum ? null : (<li key="..."
                                    className="page-item"
                                    onClick={() => { setPageNum(pageNum - 3); }}
                                >
                                    <a className="page-link" style={{ cursor: "pointer" }}> ...</a>
                                </li>)}
                            </>
                        )
                        if (i === page.length) return (
                            <>
                                {i - 2 <= pageNum ? null : (<li key="..."
                                    className="page-item"
                                    onClick={() => { setPageNum(pageNum + 3); }}
                                >
                                    <a className="page-link" style={{ cursor: "pointer" }}> ...</a>
                                </li>)}

                                <li key={i} id={"page" + i}
                                    className={i === pageNum ? "page-item active" : "page-item"}
                                    onClick={() => { setPageNum(i); }}>
                                    <a className="page-link" href="#">{i}</a>
                                </li>
                            </>
                        )
                        if ((i + 2 < pageNum) || (i - 2 > pageNum)) return null

                        return (
                            <li key={i} id={"page" + i}
                                className={i === pageNum ? "page-item active" : "page-item"}
                                onClick={() => { setPageNum(i); }}>
                                <a className="page-link" href="#">{i}</a>
                            </li>
                        )
                    })}
                </ul>
                <div className="input-group mb-3" style={{ position: "absolute", left: "0px", width: "25%" }}>
                    <span className="input-group-text" id="basic-addon1">Количество записей:</span>
                    <select className="form-control" onChange={(e) => { setCountOnPage(Number(e.target.value)); setPageNum(1); setState(prev => ([...prev])); }}>
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </select>
                </div>
            </nav>

            <Modal
                visible={isModal}
                actualData={actualData}
                onClose={onClose}
            />

        </div>
    );
}

export default Module;
