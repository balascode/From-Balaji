import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Button, 
  Typography, 
  Container, 
  Box, 
  IconButton,
  createTheme, 
  ThemeProvider,
  CssBaseline
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Particles } from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import WebFont from 'webfontloader';
import { useCallback } from 'react';

function App() {
  const [stage, setStage] = useState('welcome');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [mode, setMode] = useState('dark'); 
  const [particlesConfig, setParticlesConfig] = useState(null);
  const particlesRef = useRef(null);

  const seriousQuestions = [
    "Do you REALLY want to miss this?",
    "Are you absolutely certain?",
    "This is getting serious...",
    "Last warning before missing out!",
    "Seriously, are you sure?"
  ];

  // Load futuristic font
  useEffect(() => {
    WebFont.load({
      google: {
        families: ['Orbitron:700'] // Keeping Orbitron for "Sorry, Friend"
      }
    });
  }, []);

  // Theme configuration with futuristic font
  const theme = useMemo(
    () => createTheme({
      palette: {
        mode: mode,
        primary: {
          main: mode === 'dark' ? '#1976d2' : '#1565c0',
        },
        background: {
          default: mode === 'dark' ? '#121212' : '#f4f4f4',
          paper: mode === 'dark' ? '#1E1E1E' : '#ffffff',
        },
      },
      typography: {
        fontFamily: 'Roboto, Arial, sans-serif', // Default for most text
        h1: {
          fontFamily: 'Orbitron, sans-serif', // Best futuristic font for "Sorry, Friend"
          fontWeight: 700,
        },
      },
    }),
    [mode]
  );

  // Styled components
  const AnimatedBox = styled(Box)(({ theme }) => ({
    background: theme.palette.mode === 'dark' 
      ? 'linear-gradient(45deg, #1E1E1E, #333333)' 
      : 'linear-gradient(45deg, #e0e0e0, #ffffff)',
    borderRadius: '16px',
    padding: theme.spacing(4),
    textAlign: 'center',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 8px 32px 0 rgba(31, 38, 135, 0.37)' 
      : '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(4px)',
  }));

// Particles Configuration Generator
const createParticlesConfig = useCallback((mode, stage) => {
  const isSorryStage = stage === 'sorry';
  const isQuestionStage = stage === 'questions';
  return {
    background: {
      color: theme.palette.background.default,
    },
    fpsLimit: 120,
    interactivity: {
      events: {
        onClick: {
          enable: !isSorryStage,
          mode: "push",
        },
        onHover: {
          enable: true,
          mode: isSorryStage ? "connect" : "repulse",
        },
        resize: true,
      },
      modes: {
        push: {
          quantity: 4,
        },
        repulse: {
          distance: 200,
          duration: 0.4,
        },
        connect: {
          distance: 80,
          links: {
            opacity: 0.5,
          },
        },
      },
    },
    particles: {
      color: {
        value: mode === 'dark' ? (isSorryStage ? '#4287f5' : '#ffffff') : (isSorryStage ? '#1565c0' : '#000000'),
      },
      links: {
        color: mode === 'dark' ? (isSorryStage ? '#4287f5' : '#ffffff') : (isSorryStage ? '#1565c0' : '#000000'),
        distance: 150,
        enable: true,
        opacity: isSorryStage ? 0 : 0.3,
        width: 1,
      },
      collisions: {
        enable: true,
      },
      move: {
        direction: "none",
        enable: true,
        outModes: {
          default: "bounce",
        },
        random: isSorryStage,
        speed: isSorryStage ? 0.5 : 1,
        straight: false,
      },
      number: {
        density: {
          enable: true,
          area: 800,
        },
        value: isSorryStage ? 300 : isQuestionStage ? 200 : 80,
      },
      opacity: {
        value: isSorryStage ? 0.5 : 0.3,
      },
      shape: {
        type: "circle",
      },
      size: {
        value: isSorryStage ? { min: 1, max: 3 } : { min: 1, max: 5 },
      },
    },
    detectRetina: true,
  };
}, [theme]);

  const handleParticlesInit = async (engine) => {
    await loadSlim(engine);
  };

  const toggleMode = () => {
    setMode(prevMode => prevMode === 'dark' ? 'light' : 'dark');
  };

  const handleYes = () => {
    setStage('sorry');
    setParticlesConfig(createParticlesConfig(mode, 'sorry'));
  };
  
  const handleNo = () => {
    if (stage === 'welcome') {
      setStage('questions');
      setQuestionIndex(0);
      setParticlesConfig(createParticlesConfig(mode, 'questions'));
    } else if (stage === 'questions') {
      const nextIndex = questionIndex + 1;
      if (nextIndex < seriousQuestions.length) {
        setQuestionIndex(nextIndex);
      } else {
        setStage('final');
      }
    }
  };
  
  const handleBack = () => {
    setStage('questions');
    setParticlesConfig(createParticlesConfig(mode, 'questions'));
  };
  
  const handleStartOver = () => {
    setStage('welcome');
    setQuestionIndex(0);
    setParticlesConfig(createParticlesConfig(mode, 'welcome'));
  };

// Update particles config based on mode and stage
useEffect(() => {
  setParticlesConfig(createParticlesConfig(mode, stage));
}, [mode, stage, createParticlesConfig]);

  const renderContent = () => {
    switch(stage) {
      case 'welcome':
        return (
          <Container 
            maxWidth="sm"
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              minHeight: '100vh',
              position: 'relative',
              zIndex: 10
            }}
          >
            <AnimatedBox>
              <Typography 
                variant="h4" 
                gutterBottom 
                sx={{ 
                  color: theme.palette.text.primary, 
                  mb: 4, 
                  fontWeight: 'bold' 
                }}
              >
                Do you want to know what Balaji wants to say?
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Button variant="contained" color="success" size="large" onClick={handleYes}>
                  Yes
                </Button>
                <Button variant="contained" color="error" size="large" onClick={handleNo}>
                  No
                </Button>
              </Box>
            </AnimatedBox>
          </Container>
        );
      
      case 'questions':
        return (
          <Container 
            maxWidth="sm"
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              minHeight: '100vh',
              position: 'relative',
              zIndex: 10
            }}
          >
            <AnimatedBox>
              <Typography 
                variant="h4" 
                gutterBottom 
                sx={{ 
                  color: theme.palette.text.primary, 
                  mb: 4, 
                  fontWeight: 'bold' 
                }}
              >
                {seriousQuestions[questionIndex]}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Button variant="contained" color="success" size="large" onClick={handleYes}>
                  Yes
                </Button>
                <Button variant="contained" color="error" size="large" onClick={handleNo}>
                  No
                </Button>
              </Box>
            </AnimatedBox>
          </Container>
        );
      
        case 'sorry':
          return (
            <Container 
              maxWidth="md"
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                minHeight: '100vh',
                position: 'relative',
                zIndex: 10
              }}
            >
              <Box sx={{ position: 'relative', textAlign: 'center', width: '100%', height: '100%' }}>
                <Typography 
                  variant="h1" 
                  sx={{ 
                    color: theme.palette.text.primary, 
                    fontSize: { xs: '4rem', md: '8rem' },
                    animation: 'float 3s ease-in-out infinite',
                    '@keyframes float': {
                      '0%': { transform: 'translateY(0px)' },
                      '50%': { transform: 'translateY(-20px)' },
                      '100%': { transform: 'translateY(0px)' },
                    },
                    textShadow: mode === 'dark' 
                      ? '0 0 10px #4287f5, 0 0 20px #4287f5, 0 0 30px #4287f5' 
                      : '0 0 10px #1565c0, 0 0 20px #1565c0, 0 0 30px #1565c0',
                    position: 'relative',
                    zIndex: 20,
                  }}
                >
                  Sorry, Nanna
                </Typography>
                {/* Spacious, Floating Crying Emojis */}
                <Typography 
                  sx={{ 
                    position: 'absolute', 
                    top: '2%', 
                    left: '2%', 
                    fontSize: { xs: '2rem', md: '4rem' }, 
                    zIndex: 15,
                    animation: 'floatEmoji 4s ease-in-out infinite',
                    '@keyframes floatEmoji': {
                      '0%': { transform: 'translateY(0px)' },
                      '50%': { transform: 'translateY(-15px)' },
                      '100%': { transform: 'translateY(0px)' },
                    },
                  }}
                >😢</Typography>
                <Typography 
                  sx={{ 
                    position: 'absolute', 
                    top: '5%', 
                    right: '5%', 
                    fontSize: { xs: '2rem', md: '4rem' }, 
                    zIndex: 15,
                    animation: 'floatEmoji 4.2s ease-in-out infinite',
                    '@keyframes floatEmoji': {
                      '0%': { transform: 'translateY(0px)' },
                      '50%': { transform: 'translateY(-15px)' },
                      '100%': { transform: 'translateY(0px)' },
                    },
                  }}
                >😢</Typography>
                <Typography 
                  sx={{ 
                    position: 'absolute', 
                    bottom: '5%', 
                    left: '10%', 
                    fontSize: { xs: '2rem', md: '4rem' }, 
                    zIndex: 15,
                    animation: 'floatEmoji 4.4s ease-in-out infinite',
                    '@keyframes floatEmoji': {
                      '0%': { transform: 'translateY(0px)' },
                      '50%': { transform: 'translateY(-15px)' },
                      '100%': { transform: 'translateY(0px)' },
                    },
                  }}
                >😢</Typography>
                <Typography 
                  sx={{ 
                    position: 'absolute', 
                    bottom: '10%', 
                    right: '10%', 
                    fontSize: { xs: '2rem', md: '4rem' }, 
                    zIndex: 15,
                    animation: 'floatEmoji 4.6s ease-in-out infinite',
                    '@keyframes floatEmoji': {
                      '0%': { transform: 'translateY(0px)' },
                      '50%': { transform: 'translateY(-15px)' },
                      '100%': { transform: 'translateY(0px)' },
                    },
                  }}
                >😢</Typography>
                <Typography 
                  sx={{ 
                    position: 'absolute', 
                    top: '20%', 
                    left: '20%', 
                    fontSize: { xs: '2rem', md: '4rem' }, 
                    zIndex: 15,
                    animation: 'floatEmoji 4.8s ease-in-out infinite',
                    '@keyframes floatEmoji': {
                      '0%': { transform: 'translateY(0px)' },
                      '50%': { transform: 'translateY(-15px)' },
                      '100%': { transform: 'translateY(0px)' },
                    },
                  }}
                >😢</Typography>
                <Typography 
                  sx={{ 
                    position: 'absolute', 
                    top: '25%', 
                    right: '25%', 
                    fontSize: { xs: '2rem', md: '4rem' }, 
                    zIndex: 15,
                    animation: 'floatEmoji 5s ease-in-out infinite',
                    '@keyframes floatEmoji': {
                      '0%': { transform: 'translateY(0px)' },
                      '50%': { transform: 'translateY(-15px)' },
                      '100%': { transform: 'translateY(0px)' },
                    },
                  }}
                >😢</Typography>
                <Typography 
                  sx={{ 
                    position: 'absolute', 
                    bottom: '20%', 
                    left: '25%', 
                    fontSize: { xs: '2rem', md: '4rem' }, 
                    zIndex: 15,
                    animation: 'floatEmoji 5.2s ease-in-out infinite',
                    '@keyframes floatEmoji': {
                      '0%': { transform: 'translateY(0px)' },
                      '50%': { transform: 'translateY(-15px)' },
                      '100%': { transform: 'translateY(0px)' },
                    },
                  }}
                >😢</Typography>
                <Typography 
                  sx={{ 
                    position: 'absolute', 
                    bottom: '25%', 
                    right: '20%', 
                    fontSize: { xs: '2rem', md: '4rem' }, 
                    zIndex: 15,
                    animation: 'floatEmoji 5.4s ease-in-out infinite',
                    '@keyframes floatEmoji': {
                      '0%': { transform: 'translateY(0px)' },
                      '50%': { transform: 'translateY(-15px)' },
                      '100%': { transform: 'translateY(0px)' },
                    },
                  }}
                >😢</Typography>
                <Typography 
                  sx={{ 
                    position: 'absolute', 
                    top: '40%', 
                    left: '5%', 
                    fontSize: { xs: '2rem', md: '4rem' }, 
                    zIndex: 15,
                    animation: 'floatEmoji 5.6s ease-in-out infinite',
                    '@keyframes floatEmoji': {
                      '0%': { transform: 'translateY(0px)' },
                      '50%': { transform: 'translateY(-15px)' },
                      '100%': { transform: 'translateY(0px)' },
                    },
                  }}
                >😢</Typography>
                <Typography 
                  sx={{ 
                    position: 'absolute', 
                    top: '45%', 
                    right: '5%', 
                    fontSize: { xs: '2rem', md: '4rem' }, 
                    zIndex: 15,
                    animation: 'floatEmoji 5.8s ease-in-out infinite',
                    '@keyframes floatEmoji': {
                      '0%': { transform: 'translateY(0px)' },
                      '50%': { transform: 'translateY(-15px)' },
                      '100%': { transform: 'translateY(0px)' },
                    },
                  }}
                >😢</Typography>
                {/* Back Button */}
                <IconButton 
                  onClick={handleBack} 
                  color="inherit"
                  sx={{ position: 'absolute', top: -60, right: 60, zIndex: 20 }}
                >
                  <ArrowBackIcon />
                </IconButton>
              </Box>
            </Container>
          );
      
      case 'final':
        return (
          <Container 
            maxWidth="sm"
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              minHeight: '100vh',
              position: 'relative',
              zIndex: 10
            }}
          >
            <Typography 
              variant="h3" 
              sx={{ color: theme.palette.text.primary, textAlign: 'center', mb: 4 }}
            >
              Fine, your loss! 😄
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              size="large" 
              onClick={handleStartOver}
            >
              Start from First
            </Button>
          </Container>
        );
      
      default:
        return null;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {particlesConfig && (
        <Particles
          id="tsparticles"
          ref={particlesRef}
          init={handleParticlesInit}
          options={particlesConfig}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1
          }}
        />
      )}
      <Box sx={{ backgroundColor: 'transparent', minHeight: '100vh', position: 'relative' }}>
        <IconButton 
          onClick={toggleMode} 
          color="inherit"
          sx={{ position: 'absolute', top: 16, right: 16, zIndex: 20 }}
        >
          {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
        {renderContent()}
      </Box>
    </ThemeProvider>
  );
}

export default App;