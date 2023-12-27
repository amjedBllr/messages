

function Person(props) {
  const { id, changePerson} = props;
  const {name , type , pfp} = props.person

  return (
    <div
      onClick={() => changePerson(id)}
      className='person-container'
    >
      <div className="person">
        {/*!! ki tzid les pfps fl user dir src={pfp}  brk*/}
        <img src={pfp} alt="images\pfps-alt.webp" className="person-pfp" />
        <div className="person-info">
          <p className="person-name">{name}</p>
          <p className="person-type">{type}</p>
        </div>
      </div>
    </div>
  );
}

export default Person;
