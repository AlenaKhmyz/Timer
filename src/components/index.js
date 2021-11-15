import React, {useState, useRef, useEffect} from 'react'
import './style.css'

function Timer(){
//useRef нужен, т.к. имеем дело с js setInterval, отслеживать и останавливать при необходимости. 
// возвращает изменяемый рефобъект, возврощенный объект будет сохраняться на протяжении всего времени в жихни компонента.
// может содержать изменяемое значение в своём свойстве .current.
  const intervalRef = useRef(null);
  const [timer, setTimer] = useState('00:00:00');

//Метод Date.parse() разбирает строковое представление даты и возвращает количество миллисекунд, 
// прошедших с 1 января 1970 года 00:00:00 по UTC.
  function getTimeRemaining(endTime){
    let total = Date.parse(endTime) - Date.parse(new Date());
    let seconds = Math.floor((total / 1000) % 60);
    let minutes= Math.floor((total / 1000/60) % 60);
    let hours = Math.floor((total / 1000 * 60 * 60) % 24);
    let days = Math.floor(total / (1000 * 60 * 60 * 24) );
    return {
      total, seconds, minutes, hours, days
    }
  }
// обновляем таймер и останавливаем, когда достигает 0
  function startTimer(deadline) {
    let { total, seconds, minutes, hours, days } = getTimeRemaining(deadline) 
    if(total >= 0) {
//обновление таймера
//проверяем, если меньше 10, нам нужно добавить '0' в начала переменной
      setTimer(
        (hours > 9 ? hours : '0' + hours) + ':' + 
        (minutes > 9 ? minutes : '0' + minutes) + ':' +
        (seconds > 9 ? seconds : '0' + seconds) 
      )
    } else {
      clearInterval(intervalRef.current)
    }
  }
//сбросить таймер с самого начала, стоит 10 секунд, но можно поменять, тогда формулу endtime придется также менять next

  function clearTimer(endTime) {
//если попытаться удалить эту строку, обновление переменной таймера будет через 1000 мс или 1 секунду
    setTimer('00:00:10') 
    if(intervalRef.current) clearInterval(intervalRef.current)
    const id = setInterval(() => {
      startTimer(endTime)
    }, 1000)

    intervalRef.current = id
  }

  function getDeadlineTime() {
  //в этой функции можно изменить время интервала
    let deadline = new Date()
    deadline.setSeconds(deadline.getSeconds() + 10)
    return deadline
  }

  useEffect(() => {
    clearTimer(getDeadlineTime())
// это будет запущено, когда компонент  будет unmount
//должны быть уверены, что нет утечки памяти, иначе приложение выйдет из строя
    return () => { 
      if(intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])
  function onClickResetBtn() {
//поскольку мы не уверены, что интервал запущен, нам нужно сначала очистить его, используя
    if(intervalRef.current) clearInterval(intervalRef.current)
    clearTimer(getDeadlineTime())
  }


  return (
    <div className="container">
      <h2 className="timer">{timer}</h2>
      <button className="reset"onClick={onClickResetBtn}>Reset</button>
    </div>
  )
} 

export default Timer;

