import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import './HomePageAdmin.css'
import SideBar from '../../Components/Sidebar/SideBar'
import NavBar from '../../Components/NavBar/NavBar'
import Status from '../../Components/Status/Status'
import DReport from '../../Components/DReport/DReport'
import menu from '../../Images/menu2.png'
import close from '../../Images/Close.png'


function HomePage(props) {

  const [dataMain, setDataMain] = useState([])
  const [dataCount, setDataCount] = useState([])
  const [dataSchueler, setDataSchueler] = useState([]);
  const [dataAnwesen, setDataAnwesen] = useState([]);
  const [date, setDate] = useState(new Date());
  const [goRight, setGoRight] = useState(false)
  const [hide, setHide] = useState(false)

  const handleIslandClick = () => {
    setGoRight(!goRight);
    setHide(!hide)
  }

  const fetchData = (date) => {
    axios.get('http://localhost:4000/api/main', {
      params: {
        date: date.getTime()
      }
    })
      .then((response) => {
        setDataMain(response.data);
        console.log('Data for "main":', response.data);
      })
      .catch((error) => {
        console.error('Error fetching "main" data:', error);
      });

    axios.get('http://localhost:4000/api/Student')
      .then((response) => {
        setDataSchueler(response.data);
        console.log('Data for "Student":', response.data);
      })
      .catch((error) => {
        console.error('Error fetching "Student" data:', error);
      });
    axios.get('http://localhost:4000/api/anwesenheit')
      .then((response) => {
        setDataAnwesen(response.data);
        console.log('Data for "anwesenheit":', response.data);
      })
      .catch((error) => {
        console.error('Error fetching "anwesenheit" data:', error);
      });
    axios.get('http://localhost:4000/api/count')
      .then((response) => {
        setDataCount(response.data);
        console.log('Data for "count":', response.data);
      })
      .catch((error) => {
        console.error('Error fetching "count" data:', error);
      });
  }

  dataMain.map((item) => {
    if (item.Ankunftszeit == null) {
      item.Ankunftszeit = ''
      item.Gangzeit = ''
    }
    if (item.Gangzeit == null) {
      item.Gangzeit = ''
    }
    console.log(item)
  })

  useEffect(() => {
    fetchData(date);
  }, [date]);

  useEffect(() => {
    if (dataMain.length > 0) {
      fetchData(date);
    }
  }, [dataMain]);

  const getDateYesterday = () => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() - 1);
    return newDate;
  };

  const getDateTomorrow = () => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 1);
    return newDate;
  };

  if (dataMain == '') {
    console.log('nobody home')
  }
  if (dataMain != '') {
    console.log(`This is dataMain: ${dataMain}`)
  }

  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  return (
    <>
      <div className={`hamb ${hide ? 'highlight' : ''}`}>
        <img src={menu} alt="menu icon" onClick={handleIslandClick} />
      </div>
      <div className={`close-hamb ${hide ? '' : 'highlight'}`}>
        <img src={close} alt="close icon" onClick={handleIslandClick} />
      </div>
      <div className={`left ${goRight ? 'highlight' : ''}`}>
        <SideBar />
      </div>
      <div className='content-holder'>
        <NavBar mainUsername={props.mainUsername}/>
        <Status
          dataMain={dataMain}
          dataCount={dataCount}
        />
        <DReport
          dataMain={dataMain}
          date={date}
          onDateChange={setDate}
          getDateYesterday={getDateYesterday}
          getDateTomorrow={getDateTomorrow}
        />
      </div>
    </>
  )
}

export default HomePage