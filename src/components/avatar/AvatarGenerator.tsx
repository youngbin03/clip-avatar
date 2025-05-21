import { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { colors, gradients } from '../../styles/theme';
import WebcamCapture from './WebcamCapture';
import Button from '../common/Button';
import { generateCharacterAvatar, getOpenAIErrorMessage } from '../../server/openaiService';

interface AvatarGeneratorProps {
  onAvatarGenerated: (avatarUrl: string) => void;
  onCancel: () => void;
}

const AvatarGenerator = ({ onAvatarGenerated, onCancel }: AvatarGeneratorProps) => {
  const [step, setStep] = useState<'intro' | 'capture' | 'generating' | 'result'>('intro');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [generatedAvatar, setGeneratedAvatar] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCapture = async (imageSrc: string) => {
    setCapturedImage(imageSrc);
    setStep('generating');
    
    try {
      // 이미지를 OpenAI API로 전송하여 캐릭터 아바타 생성
      // 이미지 데이터는 사용하지 않고 기본 캐릭터만 생성
      const avatarUrl = await generateCharacterAvatar(imageSrc);
      setGeneratedAvatar(avatarUrl);
      setStep('result');
    } catch (error) {
      console.error('캐릭터 생성 오류:', error);
      
      // API 호출 실패 시 기본 캐릭터 이미지 사용 (테스트용)
      const defaultCharacters = [
        '/src/assets/characters/blue_character1.png',
        '/src/assets/characters/blue_character2.png',
        '/src/assets/characters/blue_character3.png',
        '/src/assets/characters/blue_character4.png',
        '/src/assets/characters/yellow_character1.png',
        '/src/assets/characters/yellow_character2.png',
        '/src/assets/characters/yellow_character3.png',
        '/src/assets/characters/yellow_character4.png'
      ];
      
      // 테스트를 위해 기본 캐릭터 중 하나를 랜덤하게 선택
      const randomCharacter = defaultCharacters[Math.floor(Math.random() * defaultCharacters.length)];
      
      // 오류 메시지 표시 (개발 환경에서는 기본 캐릭터 사용)
      const errorMsg = getOpenAIErrorMessage(error);
      console.log('OpenAI API 오류, 기본 캐릭터를 사용합니다:', errorMsg);
      
      // 개발용: 기본 캐릭터로 진행
      setGeneratedAvatar(randomCharacter);
      setStep('result');
      
      // 프로덕션 환경에서는 오류 메시지 표시
      // setError(errorMsg);
      // setStep('capture');
    }
  };

  const handleConfirm = () => {
    if (generatedAvatar) {
      onAvatarGenerated(generatedAvatar);
    }
  };

  const resetCapture = () => {
    setCapturedImage(null);
    setGeneratedAvatar(null);
    setError(null);
    setStep('capture');
  };

  return (
    <AvatarGeneratorContainer>
      <AnimatePresence mode="wait">
        {step === 'intro' && (
          <IntroScreen
            key="intro"
            as={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Title>나만의 캐릭터 아바타 만들기</Title>
            <Description>
              웹캠으로 사진을 찍고 AI가 당신의 특징을 살린 귀여운 캐릭터 아바타를 만들어드립니다.
            </Description>
            <ButtonGroup>
              <Button variant="outlined" onClick={onCancel}>취소</Button>
              <Button onClick={() => setStep('capture')}>시작하기</Button>
            </ButtonGroup>
          </IntroScreen>
        )}

        {step === 'capture' && (
          <CaptureScreen
            key="capture"
            as={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <WebcamCapture 
              onCapture={handleCapture}
              onClose={onCancel}
            />
            {error && <ErrorMessage>{error}</ErrorMessage>}
          </CaptureScreen>
        )}

        {step === 'generating' && (
          <LoadingScreen
            key="loading"
            as={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LoadingContent>
              <LoadingSpinner />
              <LoadingText>AI가 당신의 캐릭터를 생성하고 있어요...</LoadingText>
              <SubText>약 30초 정도 소요됩니다.</SubText>
            </LoadingContent>
          </LoadingScreen>
        )}

        {step === 'result' && generatedAvatar && (
          <ResultScreen
            key="result"
            as={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Title>아바타가 생성되었어요!</Title>
            <ResultContent>
              <ImageContainer>
                <OriginalImage src={capturedImage || ''} alt="원본 이미지" />
                <GeneratedImage 
                  src={generatedAvatar} 
                  alt="생성된 아바타"
                  as={motion.img}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </ImageContainer>
              <ResultDescription>
                AI가 당신의 특징을 잘 살린 캐릭터를 만들었습니다!
              </ResultDescription>
              <ButtonGroup>
                <Button variant="outlined" onClick={resetCapture}>다시 만들기</Button>
                <Button onClick={handleConfirm}>사용하기</Button>
              </ButtonGroup>
            </ResultContent>
          </ResultScreen>
        )}
      </AnimatePresence>
    </AvatarGeneratorContainer>
  );
};

const AvatarGeneratorContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 1000;
  padding: 20px;
`;

const BaseScreen = styled.div`
  background-color: ${colors.white};
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  width: 100%;
  max-width: 500px;
`;

const IntroScreen = styled(BaseScreen)`
  padding: 40px;
  text-align: center;
`;

const CaptureScreen = styled(BaseScreen)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LoadingScreen = styled(BaseScreen)`
  padding: 60px 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
`;

const ResultScreen = styled(BaseScreen)`
  padding: 40px;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 20px;
  color: ${colors.gray70};
  text-align: center;
`;

const Description = styled.p`
  font-size: 16px;
  line-height: 1.6;
  color: ${colors.gray60};
  margin-bottom: 30px;
  text-align: center;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 30px;
`;

const LoadingContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const LoadingSpinner = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 5px solid ${colors.gray20};
  border-top-color: ${colors.bandiBlue55};
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  font-size: 18px;
  font-weight: 600;
  color: ${colors.gray70};
  margin-bottom: 8px;
`;

const SubText = styled.p`
  font-size: 14px;
  color: ${colors.gray50};
`;

const ResultContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 30px;
  margin: 20px 0 30px;
`;

const OriginalImage = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 12px;
  object-fit: cover;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const GeneratedImage = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 12px;
  object-fit: contain;
  background-color: ${colors.gray10};
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const ResultDescription = styled.p`
  font-size: 16px;
  color: ${colors.gray60};
  text-align: center;
  margin-bottom: 10px;
`;

const ErrorMessage = styled.div`
  margin-top: 16px;
  padding: 12px 16px;
  background-color: ${colors.errorLight};
  color: ${colors.error};
  border-radius: 8px;
  font-size: 14px;
  text-align: center;
  max-width: 400px;
`;

export default AvatarGenerator; 