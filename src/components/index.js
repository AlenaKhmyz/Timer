import React, {useState, useRef, useEffect} from 'react'
import './style.css'

function Timer(){
//useRef нужен, т.к. имеем дело с js setInterval, отслеживать и останавливать при необходимости. 
// возвращает изменяемый рефобъект, возврощенный объект будет сохраняться на протяжении всего времени в жихни компонента.
// может содержать изменяемое значение в своём свойстве .current.
  const intervalRef = useRef(null);
  const [timer, setTimer] = useState(10000)

//Метод Date.parse() разбирает строковое представление даты и возвращает количество миллисекунд, 
// прошедших с 1 января 1970 года 00:00:00 по UTC.
 const getTimeRemaining = () => {
    let seconds = Math.floor((timer / 1000) % 60);
    let minutes= Math.floor((timer / 1000/60) % 60);
    let hours = Math.floor((timer / 1000 * 60 * 60) % 24);
    let days = Math.floor(timer / (1000 * 60 * 60 * 24) );
    return {
       seconds, minutes, hours, days
    }
  }
  
// обновляем таймер и останавливаем, когда достигает 0
  
  function startTimer() {
    
//обновление таймера
//проверяем, если меньше 10, нам нужно добавить '0' в начала переменной
    setTimer(
      (timer) => {
        console.log(timer)
        if(timer <= 0) {
          clearInterval(intervalRef.current)
          return 0
        }
        return timer - 1000
      }
    )
    console.log(timer) 
  }
//сбросить таймер с самого начала, стоит 10 секунд, но можно поменять, тогда формулу endtime придется также менять next

  const updatingTimer = () => {
    let { hours, minutes, seconds} = getTimeRemaining()
    let time = `${hours} : ${minutes} : ${seconds}`
    return time
  }
  function clearTimer() {
//если попытаться удалить эту строку, обновление переменной таймера будет через 1000 мс или 1 секунду
    setTimer(10000) 
    if(intervalRef.current) clearInterval(intervalRef.current)
    const id = setInterval(() => {
      startTimer()
    }, 1000)

    intervalRef.current = id
  }
  // //в этой функции можно изменить время интервала


  useEffect(() => {
    clearTimer()
// это будет запущено, когда компонент  будет unmount
//должны быть уверены, что нет утечки памяти, иначе приложение выйдет из строя
    return () => { 
      if(intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])
  function onClickResetBtn() {
//поскольку мы не уверены, что интервал запущен, нам нужно сначала очистить его, используя
    if(intervalRef.current) clearInterval(intervalRef.current)
    clearTimer()
  }


  return (
    <div className="container">
      <h2 className="timer">{updatingTimer(timer)}</h2>
      <button className="reset"onClick={onClickResetBtn}>Reset</button>
    </div>
  )
} 

export default Timer;

