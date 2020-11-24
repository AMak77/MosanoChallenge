import React, { useEffect, useState } from 'react';
import './Entries.css';

import Modal from '../components/Modal/Modal';
import Spinner from '../components/Spinner/Spinner';


const Entries = (props) => {

    const [creating, setCreating] = useState(false);
    const [entries, setEntries] = useState([]);

    const [buttonConfirmStatus, setButtonConfirmStatus] = useState(true);
    const [buttonConfirmStatusModal, setButtonConfirmStatusModal] = useState(true);

    const [isLoading, setIsLoading] = useState(false);

    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [country, setCountry] = useState('');
    const [birthday, setBirthday] = useState('');

    const [modalName, setModalName] = useState('');
    const [modalSurname, setModalSurname] = useState('');
    const [modalCountry, setModalCountry] = useState('');
    const [modalBirthday, setModalBirthday] = useState('');

    const [countries, setCountries] = useState('');

    const [idToUpdate, setIDtoUpdate] = useState();

    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchEntries();
        fetchCountries();
    },[]);

    useEffect(() => {
        if(name && surname && country && birthday){
           setButtonConfirmStatus(false);
            
        } else {
             setButtonConfirmStatus(true);
        }
    }, [name, surname, country, birthday])

    useEffect(() => {
        if(modalName && modalSurname && modalCountry && modalBirthday){
            setButtonConfirmStatusModal(false);
        } else {
            setButtonConfirmStatusModal(true);
        }
    }, [modalName, modalSurname, modalCountry, modalBirthday])

    const OpenModal = (id, name, surname, country, birthday) => {
        setCreating(true);
        setIDtoUpdate(id);
        setModalName(name);
        setModalSurname(surname);
        setModalCountry(country);
        setModalBirthday(birthday.slice(0,10));
    }

    const CloseModal = () => {
        setCreating(false);
    }

    const newPerson = () => {
        setCreating(false);
        const requestBody = {
            query: `
                mutation newPerson($name: String!, $surname: String!, $country: String!, $birthday: String!){
                    newPerson(personInput:{name: $name, surname: $surname, country: $country, birthday: $birthday}){
                        name
                        surname
                        country
                        birthday
                    }   
                }
            `,
            variables: {
                name: name,
                surname: surname,
                country: country,
                birthday: birthday
            }
        }

        const Token = props.isAuthed;

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + Token
            }
        })
        .then(res => {
            if(res.status !== 200 && res.status !== 201) {
                throw new Error('Failed');
            }
            return res.json();
        })
        .then(() => {
            fetchEntries();
            birthdayFunction(name, surname, country, birthday);
        })
        .catch(err => {
            console.log(err);
        })

    }

    const deletePerson = (id) => {
        setCreating(false);

        const requestBody = {
            query: `
                mutation {
                    deletePerson(id:"${id}"){
                        name
                        surname
                        country
                        birthday
                    }   
                }
            `
        }

        const Token = props.isAuthed;

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + Token
            }
        })
        .then(res => {
            if(res.status !== 200 && res.status !== 201) {
                throw new Error('Failed');
            }
            return res.json();
        })
        .then(() => {
            fetchEntries();
        })
        .catch(err => {
            console.log(err);
        })

    }

    const updatePerson = () => {
        setCreating(false);

        console.log(idToUpdate, modalName, modalSurname, modalCountry, modalBirthday);

        const requestBody = {
            query: `
                mutation {
                    updatePerson(id: "${idToUpdate}", name: "${modalName}", surname: "${modalSurname}", country: "${modalCountry}", birthday: "${modalBirthday}"){
                        name
                        surname
                        country
                        birthday
                    }   
                }
            `
        }

        const Token = props.isAuthed;

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + Token
            }
        })
        .then(res => {
            if(res.status !== 200 && res.status !== 201) {
                throw new Error('Failed');
            }
            return res.json();
        })
        .then(() => {
            fetchEntries();
        })
        .catch(err => {
            console.log(err);
        })

    }

    const fetchEntries = () => {
        setIsLoading(true);
        const requestBody = {
            query: `
                query {
                    persons {
                        _id
                        name
                        surname
                        country
                        birthday
                    }
                }
            `
        };

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            if(res.status !== 200 && res.status !== 201) {
                throw new Error('Failed!');
            }
            return res.json();
        })
        .then(resData => {
            setEntries(resData.data.persons)
            setIsLoading(false);
        })
        .catch(err => {
            setIsLoading(false);
            console.log(err);
        })
    }

    const birthdayFunction = (name, surname, country, date) => {
        const actual_date = new Date();
        const data = new Date(date);
        const year_now = actual_date.getFullYear();
        const month_now = actual_date.getMonth() + 1;
        const day_now = actual_date.getDate();
        const year = data.getFullYear();
        const month = data.getMonth() + 1;
        const day = data.getDate();
        const monthdate = "" + month + day;
        const monthdatenow = "" + month_now  + day_now;
        let years;
        if(parseInt(monthdatenow) < parseInt(monthdate)){
            years = year_now - year;
        } else {
            years = year_now - year + 1 ;
        }
        setMessage(`Hello ${name + ' ' + surname} from ${country} on day ${day} of month ${month} you will have ${years}.`);
        setShowMessage(true);
    }

    const fetchCountries = () => {
        fetch('http://restcountries.eu/rest/v2/all/')
            .then(res => {
                if (res.status >= 400) {
                throw new Error("Bad response from server");
                }
                return res.json();
            })
            .then(data => {
                setCountries(data);
            })
            .catch(err => {
                console.error(err);
            });
    }


    const ISO = (date) => {
        return date.slice(0,10);
    }

    useEffect(() => {
        if(showMessage){
            setTimeout(() => {
                setShowMessage(false);
            }, 5000)
        }
    }, [showMessage])

    return(
        <div className="main-entries">
            <h2 className="main-entries-title">Entries Page</h2>
            {creating && <Modal 
                title="Update Person"
                canCancel
                canConfirm
                canConfirmStatus = {buttonConfirmStatusModal}
                onCancel={() => CloseModal()}
                onConfirm={(e) => {
                    e.preventDefault();
                    updatePerson();
                }}
                confirmText="Update"
            >
                <div className="form-control">
                        <label htmlFor="modalName">Name</label>
                        <input type="text" id="modalName" value={modalName} onChange={e => setModalName(e.target.value)} />
                    </div>
                    <div className="form-control">
                        <label htmlFor="modalSurname">Surname</label>
                        <input type="text" id="modalSurname" value={modalSurname} onChange={e => setModalSurname(e.target.value)} />
                    </div>
                    <div className="form-control">
                        <label htmlFor="modalCountry">Country</label>
                        <select name="modalCountry" id="modalCountry" value={modalCountry} onChange={(e) => setModalCountry(e.target.value)}>
                                {
                                    countries && (countries.map(country => (
                                        <option key={country.name} value={country.name}>{country.name}</option>
                                     ))) 
                                }
                            </select>
                    </div>
                    <div className="form-control">
                        <label htmlFor="modalBirthday">Birthday</label>
                        <input type="date" id="modalBirthday" value={modalBirthday} onChange={e => setModalBirthday(e.target.value)} />
                    </div>
            </Modal>}
            {
                !props.isAuthed ? (
                            <>
                        
                            {
                                !entries.length ? <p>No entries to show!!</p> : (
                                    <>
                                
                                    {isLoading ? <Spinner /> : (
                                        <table>
                                        <tbody>
                                        <tr>
                                            <th>Name</th>
                                            <th>Country</th>
                                            <th>Birthday</th>
                                        </tr>
                                    {
                                    entries.map(entrie => (
                                    <tr key={entrie._id}>
                                        <td onClick={() => birthdayFunction(entrie.name, entrie.surname, entrie.country, entrie.birthday)}>{entrie.name + ' ' + entrie.surname}</td>
                                        <td onClick={() => birthdayFunction(entrie.name, entrie.surname, entrie.country, entrie.birthday)}>{entrie.country}</td>
                                        <td onClick={() => birthdayFunction(entrie.name, entrie.surname, entrie.country, entrie.birthday)}>{ISO(entrie.birthday)}</td>
                                        {
                                            props.isAuthed && (
                                                <>
                                                <td><button onClick={() => OpenModal(entrie._id, entrie.name, entrie.surname, entrie.country, entrie.birthday)}>&#9998; Edit</button></td>
                                                <td><button className="btn-remove" onClick={() => deletePerson(entrie._id)}>&#128465; Delete</button></td>
                                                </>
                                            )
                                        }
                                    </tr>
                                    ))
                                    }
                                    </tbody>
                                    </table>
                                    )}
                                    
                                
                                
                                {showMessage && (
                                    <div className="message">
                                        {message}
                                    </div>
                                    )
                                }
                                </>
                            )}
                    </>
                ) : (
                    
                    <div className="row">
                        <div className="column">
                                <form>
                                    <div className="form-control">
                                        <label htmlFor="name">Name</label>
                                        <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} />
                                    </div>
                                    <div className="form-control">
                                        <label htmlFor="surname">Surname</label>
                                        <input type="text" id="surname" value={surname} onChange={e => setSurname(e.target.value)} />
                                    </div>
                                    <div className="form-control">
                                        <label htmlFor="country">Country</label>
                                        <select name="country" id="country" value={country} onChange={(e) => setCountry(e.target.value)}>
                                            {
                                                countries && (countries.map(country => (
                                                    <option key={country.name} value={country.name}>{country.name}</option>
                                                ))) 
                                            }
                                        </select>
                                    </div>
                                    <div className="form-control">
                                        <label htmlFor="birthday">Birthday</label>
                                        <input type="date" id="birthday" value={birthday} onChange={e => setBirthday(e.target.value)} />
                                    </div>
                                    <button className="btn" disabled={buttonConfirmStatus} onClick={(e) => {
                                        e.preventDefault();
                                        newPerson();
                                    }}>&#128190; Save</button>
                                </form>

                            
                            {showMessage &&
                                <div className="message">
                                    {message}
                                </div>
                            }
                        </div>
                        
                        
                            <div className="column">
                                {
                                    !entries.length ? <p>No entries to show!!</p> : (
                                        <>                            
                                    {
                                        isLoading ? <><Spinner /> </>:  (
                                            <table>
                                                <tbody>
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Country</th>
                                                    <th>Birthday</th>
                                                </tr>
                                        {
                                        
                                        entries.map(entrie => (
                                            <tr key={entrie._id}>
                                                <td onClick={() => birthdayFunction(entrie.name, entrie.surname, entrie.country, entrie.birthday)}>{entrie.name + ' ' + entrie.surname}</td>
                                                <td onClick={() => birthdayFunction(entrie.name, entrie.surname, entrie.country, entrie.birthday)}>{entrie.country}</td>
                                                <td onClick={() => birthdayFunction(entrie.name, entrie.surname, entrie.country, entrie.birthday)}>{ISO(entrie.birthday)}</td>
                                                {
                                                    props.isAuthed && (
                                                        <>
                                                        <td><button onClick={() => OpenModal(entrie._id, entrie.name, entrie.surname, entrie.country, entrie.birthday)}>&#9998; Edit</button></td>
                                                        <td><button onClick={() => deletePerson(entrie._id)}>&#128465; Delete</button></td>
                                                        </>
                                                    )
                                                }
                                            </tr>
                                        ))
                                        }
                                            </tbody>
                                        </table>
                                        )
                                    }
                                </>
                            )}
                            </div>
                        </div>
                    )
            }
                    
                    
            </div>
        
    )
}

export default Entries;