import React, {useState, useRef, useEffect} from 'react'

const Timer = () => {
//useRef нужен, т.к. имеем дело с js setInterval, отслеживать и останавливать при необходимости. 
// возвращает изменяемый рефобъект, возврощенный объект будет сохраняться на протяжении всего времени в жихни компонента.
// может содержать изменяемое значение в своём свойстве .current.
  const intervalRef = useRef(null);
  const [timer, setTimer] = useState('00:00:00');

//Метод Date.parse() разбирает строковое представление даты и возвращает количество миллисекунд, 
// прошедших с 1 января 1970 года 00:00:00 по UTC.
  const getTimeRemaining = (endTime) => {
    let total = Date.parse(endTime) - Date.parse(new Date());
    let seconds = Math.floor((total / 1000) % 60);
    let minutes= Math.floor((total / 1000/60) % 60);
    let hours = Math.floor((total / 1000 * 60 * 60) % 24);
    let days = Math.floor(total / (1000 * 60 * 60 * 24) );
    
  }
// обновляем таймер и останавливаем, когда достигает 0
  const startTimer = (deadline) => {
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

  const clearTimer = (endTime) => {
//если попытаться удалить эту строку, обновление переменной таймера будет через 1000 мс или 1 секунду
    setTimer('00:00:10') 
    if(intervalRef.current) clearInterval(intervalRef.current)
    const id = setInterval(() => {
      startTimer(endTime)
    }, 1000)

    intervalRef.current = id
  }

  const getDeadlineTime = () => {
  //в этой функции можно изменить время интервала
    let deadline = new Date()
    deadline.setSeconds(deadline.getSeconds() + 10)
  }

  useEffect(() => {
    clearTimer(getDeadlineTime())
// это будет запущено, когда компонент  будет unmount
//должны быть уверены, что нет утечки памяти, иначе приложение выйдет из строя
    return () => { 
      if(intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])
//другой способ вызвать ClearTimer () для начала обратного отсчета - через событие действия от кнопки
  const onClickResetBtn = () => {
//поскольку мы не уверены, что интервал запущен, нам нужно сначала очистить его, используя
    if(intervalRef.current) clearInterval(intervalRef.current)
    clearTimer(getDeadlineTime())
  }


  return (
    <div className="timer">
      <h2>{timer}</h2>
      <button className="reset"onClick={onClickResetBtn}>Reset</button>
    </div>
  )
} 

export default Timer;

