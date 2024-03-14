import React, { useState, useEffect, useRef } from 'react';
import DevImg from '../../../assets/images/texture-dev.png';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Intro = () => {
  const [isVisible, setIsVisible] = useState(false);
  const aboutTextRef = useRef(null);
  const aboutImgRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const aboutTextTop = aboutTextRef.current.getBoundingClientRect().top;
      const aboutImgTop = aboutImgRef.current.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      if (aboutTextTop < windowHeight) {
        setIsVisible(true);
      }

      if (aboutImgTop < windowHeight) {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <IntroContainer className="container mx-auto flex flex-row-reverse gap-10 py-32 items-center">
      <AboutText
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 100 }}
        transition={{ duration: 1 }}
        className="w-1/2 select-none"
        ref={aboutTextRef}
      >
        <h2 className="mb-1 text-lg font-bold">My Intro</h2>
        <h1 className="mb-2 text-4xl font-bold">About Me</h1>
        <p className="text-lg mb-5">
          Hey There. I'm <a target='_blank' href='https://github.com/PRASSamin'  className='font-bold'>PRAS Samin</a>, a versatile Web Developer with a fervent
          passion for Flutter Development. With nearly 3 years of experience,
          I've successfully managed a wide array of development projects,
          leveraging technologies like Node.js, React.js, Express.js, and more
          to deliver exceptional results. My expertise extends to crafting
          sleek and responsive interfaces using Tailwind CSS and Bootstrap.
          Committed to exceeding expectations, my goal is to ensure 100%
          client satisfaction with each project. When I'm not coding, you'll
          find me exploring the latest trends in technology, gaming, and
          enjoying quality time with friends.
        </p>
        <div className="text-lg flex flex-col gap-3" style={{ margin: '10px 0' }}>
          <div className="flex items-center">
            <i className="fa fa-user mr-1"></i>
            <h3 className="font-semibold" style={{ margin: '0 10px' }}>
              PRAS Samin
            </h3>
          </div>
          <div className="flex items-center">
            <i className="fa fa-envelope  mr-1"></i>
            <h3 className="font-semibold" style={{ margin: '0 10px' }}>
              <a href="mailto:prassamin@gmail.com?subject=From%20Portfolio%3A%20">prassamin@gmail.com</a>
            </h3>
          </div>
          <div className="flex items-center">
            <i className="mr-1 fa-brands fa-whatsapp text-2xl"></i>
            <h3 className="font-semibold" style={{ margin: '0 10px' }}>
              <a target='_blank' href='https://wa.link/ufzysh'>+880 1725-314886</a>
            </h3>
          </div>
        </div>
        <h4 className="text-lg font-bold my-6">My Interests</h4>
        <div className="flex font-medium gap-10 text-lg">
          <div className="flex items-center">
            <i className="fa fa-film mr-2"></i>
            <h5>Movie</h5>
          </div>
          <div className="flex items-center">
            <i className="fa fa-music mr-2"></i>
            <h5>Music</h5>
          </div>
          <div className="flex items-center">
            <i className="fa fa-gamepad mr-2"></i>
            <h5>Game</h5>
          </div>
          <div className="flex items-center">
            <i className="fa-brands fa-discord mr-2"></i>
            <h5>Talk</h5>
          </div>
        </div>
      </AboutText>
      <AboutImg
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -100 }}
        transition={{ duration: 1 }}
        className="w-1/2 select-none"
        ref={aboutImgRef}
      >
        <motion.img src={DevImg} alt="Developer" />
      </AboutImg>
    <div class="progress-bar">
    <div class="progress progress-seventy">100</div>
</div>
    </IntroContainer>
  );
};

const IntroContainer = styled.section`
  @media (max-width: 768px) {
    flex-direction: column;


    .progress-bar {
        width: 200px;
        height: 20px;
        border-radius: 10px;
        background: #ddd; 
        overflow: hidden; 
    }

    .progress {
        height: 100%;
        background: linear-gradient(to right, #4CAF50 0%, #4CAF50 50%, #ddd 50%, #ddd 100%);
        transition: width 0.5s ease-in-out; 
    }

    .progress-seventy {
        width: 70%;
    }
  }
`;

const AboutText = styled(motion.div)`
  @media (max-width: 768px) {
    text-align: center;
  }
`;

const AboutImg = styled(motion.div)`
  @media (max-width: 768px) {
    order: -1;
    margin-bottom: 2rem;
  }
`;

export default Intro;
