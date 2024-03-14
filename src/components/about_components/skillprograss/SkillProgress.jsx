import React from 'react'
import ProgressTemplate from './ProgressTemplate';

const SkillProgress = () => {
    const [progress, setProgress] = useState(0);


    const updateProgress = () => {
      setProgress(70); 
    };
  
    return (
      <div>
        <ProgressTemplate progress={progress} />
        <button onClick={updateProgress}>Update Progress</button>
      </div>
    );
}

export default SkillProgress