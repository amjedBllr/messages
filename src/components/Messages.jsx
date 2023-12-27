
import Person from './person'
import Chat from './Chat'
import { useEffect , useState , createContext} from 'react';

    const user = window.prompt('what is your user id ?');

    
function Messages(){

    
    const [people , setPeople] = useState([]);
    const [peopleProf , setPeopleProf] = useState([]);
    const [person,setPerson] = useState();
    
     //? Fetching the rooms of the user so we can swap between them
     const fetchPeople = async () => {
        try {
          const response = await fetch(`http://localhost:3000/api/getUserPeople?user=${user}`)
          if (!response.ok) {
            throw new Error('Network response was not ok')
          }
          let userPeople = await response.json()
          const userPeopleArr = []
          userPeople = userPeople.map((person)=>{
              userPeopleArr.push(person.person)
          })
          setPeople(userPeopleArr)
        } catch (error) {
          console.error('Error fetching user people , ', error)
        }
      };
      //?fethcing the information of each person (name and pfp...)
      const fetchpeopleProf = async ()=>{
        try{
        const response = await fetch(`http://localhost:3000/api/getPeopleProf?people=${people}`)
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        let peopleProf = await response.json()
        setPeopleProf(peopleProf)
      } catch(error) {
        console.error('Error fetching people profiles ', error)
      }
    }

    //?so we can change the state of the person
    function changePerson(person){
        console.log(`we going to change :`+ person)
        setPerson(person)
    }


    //?mapping the people
      const peopleElements = peopleProf.map((p) => (
        <>
        <Person
          id = {p.user_id}
          changePerson = {changePerson}
          key={p.user_id}
          person={{ pfp:`/images/${p.pfp}` , name: p.name, type: p.type }}
        />
        </>
      ));
      
      
      useEffect(() => {
          fetchPeople();
        }, []);

      useEffect(
        ()=>{
            fetchpeopleProf();
            setPerson(people[0])
            }
        ,[people])

    return(
        <main className="messages-countainer">
            <div className="messages">

                <div className="people">
                    {peopleElements}
                </div>
                
                  <Chat user={user} person={person}/>
                
            </div> 
        </main>
    )
}

export default Messages