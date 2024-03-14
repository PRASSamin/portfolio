import styled from 'styled-components'

const CVCheck = () => {
  return (
    <CvCheck>
    <i class="fa-solid fa-triangle-exclamation"></i>
    <div>
      <h1>CV Not Uploaded Yet</h1>
    </div>
  </CvCheck>
  );
};

export default CVCheck


const CvCheck = styled.div`
background-color: rgba(255, 0, 0, 0.914);
    border: 3px solid rgba(118, 0, 0, 0.914);
    color: white;
    padding-right: 20px;
    height: 55px;
    position: absolute;
    top: 2%;
    left: 50%;
    transform: translate(-50%, 0%);
    border-radius: 30px;
    display: flex;
    flex-direction: row;
    align-items: center;


    .fa-triangle-exclamation {
      font-size: 25px;
      margin: 0px 15px;
    }

`;