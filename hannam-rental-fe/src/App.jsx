import { Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './component/Login'
import Main from './component/Main'
import Mypage from './component/Mypage'
import SignUp from './component/Signup'
import RentalPage from './component/RentalPage'
import CollegeSelect from './component/CollegeSelect'
import Sidebar from './component/Sidebar'
import RentalApplication from './component/RentalApplication'
import { useReducer, useRef, createContext } from 'react'
import Button from './component/Button'

const mockData = [
  {
    rentalNumber: 1,
    createdDate : new Date("2025-03-01").getTime(),
    productNumber: 1,
    rentalSpace: "스마트융합대학",
  },
  {
    rentalNumber: 2,
    createdDate : new Date("2025-03-02").getTime(),
    productNumber: 1,
    rentalSpace: "공과대학",
  },
  {
    rentalNumber: 3,
    createdDate : new Date("2025-03-03").getTime(),
    productNumber: 2,
    rentalSpace: "경상대학",
  },
]

function reducer(state, action){
  switch(action.type){
    case 'RENTAL': return [action.data, ...state];
    case 'RETRIEVE':
      return state.filter(
        (item) => String(item.rentalNumber) !== String(action.rentalNumber)
      );
    default:
      return state;
  }
}

const RentalStateContext = createContext();
const RentalDispatchContext = createContext();

function App() {
  const [data, dispatch] = useReducer(reducer, mockData);
  const idRef = useRef(4)

  const onRental = (rentalNumber, createDate, productNumber, rentalSpace) =>{
    // 대여를 추가
    dispatch({
      type: "RENTAL",
      data : {
        rentalNumber: idRef.current++,
        createDate,
        productNumber,
        rentalSpace,
      },
    })
  }

  const onReturn = (rentalNumber) =>{
    dispatch({
      type: "RETRIEVE",
      rentalNumber,
    })

  }

  return (
    <div className='App'>
      <RentalStateContext.Provider value = {data}>
        <RentalDispatchContext.Provider
          value={{
            onRental,
            onReturn,
          }}
        >
          <Routes>
            <Route path = '/' element = {<Main/>} />
            <Route path = '/login' element = {<Login/>} />
            <Route path='/signup' element = {<SignUp/>} />
            <Route path = '/mypage' element = {<Mypage/>} />
            <Route path = '/rental/:id' element = {<RentalPage/>} />
            <Route path = '/college' element = {<CollegeSelect/>} />
            <Route path = '/sidebar' element = {<Sidebar/>} />
            <Route path = '/application' element = {<RentalApplication/>} />
          </Routes>
        </RentalDispatchContext.Provider>
      </RentalStateContext.Provider>
    </div>
  )
}

export default App
