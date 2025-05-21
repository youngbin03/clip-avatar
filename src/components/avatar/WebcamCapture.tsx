import { useState, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Webcam from 'react-webcam';
import Button from '../common/Button';
import { colors, gradients } from '../../styles/theme';

interface WebcamCaptureProps {
  onCapture: (imageSrc: string) => void;
  onClose: () => void;
}

const WebcamCapture = ({ onCapture, onClose }: WebcamCaptureProps) => {
  const webcamRef = useRef<Webcam>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);

  const videoConstraints = {
    width: 400,
    height: 400,
    facingMode: "user"
  };

  const capturePhoto = useCallback(() => {
    setIsCapturing(true);
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
    }
    setIsCapturing(false);
  }, [webcamRef]);

  const retakePhoto = () => {
    setCapturedImage(null);
  };

  const confirmPhoto = () => {
    if (capturedImage) {
      onCapture(capturedImage);
    }
  };

  return (
    <WebcamContainer
      as={motion.div}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <WebcamHeader>
        <Title>프로필 사진 촬영</Title>
        <CloseButton onClick={onClose}>✕</CloseButton>
      </WebcamHeader>

      <WebcamContent>
        {!capturedImage ? (
          <>
            <WebcamView>
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                mirrored={true}
              />
              <CaptureOverlay />
            </WebcamView>
            <CaptureButton 
              onClick={capturePhoto} 
              disabled={isCapturing}
            >
              {isCapturing ? '촬영 중...' : '촬영하기'}
            </CaptureButton>
          </>
        ) : (
          <>
            <CapturedImageContainer>
              <CapturedImage src={capturedImage} alt="캡처된 이미지" />
            </CapturedImageContainer>
            <ButtonGroup>
              <Button variant="outlined" onClick={retakePhoto}>다시 촬영</Button>
              <Button onClick={confirmPhoto}>확인</Button>
            </ButtonGroup>
          </>
        )}
      </WebcamContent>

      <WebcamGuide>
        <GuideText>
          📸 정면을 바라보고 얼굴이 잘 보이도록 위치시켜 주세요.
        </GuideText>
      </WebcamGuide>
    </WebcamContainer>
  );
};

const WebcamContainer = styled.div`
  width: 450px;
  background-color: ${colors.white};
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  overflow: hidden;
`;

const WebcamHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid ${colors.gray20};
`;

const Title = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${colors.gray70};
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${colors.gray50};
  font-size: 20px;
  cursor: pointer;
  padding: 4px;
  
  &:hover {
    color: ${colors.gray70};
  }
`;

const WebcamContent = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const WebcamView = styled.div`
  position: relative;
  width: 400px;
  height: 400px;
  margin-bottom: 20px;
  border-radius: 12px;
  overflow: hidden;
  
  video {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
`;

const CaptureOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 2px solid ${colors.bandiBlue35};
  border-radius: 12px;
  box-shadow: inset 0 0 0 3px rgba(255, 255, 255, 0.2);
`;

const CaptureButton = styled.button`
  background: ${gradients.bandiGra3};
  color: white;
  border: none;
  border-radius: 50%;
  width: 80px;
  height: 80px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const CapturedImageContainer = styled.div`
  width: 400px;
  height: 400px;
  margin-bottom: 20px;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid ${colors.bandiBlue35};
`;

const CapturedImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
`;

const WebcamGuide = styled.div`
  background-color: ${colors.gray10};
  padding: 16px 20px;
  border-top: 1px solid ${colors.gray20};
`;

const GuideText = styled.p`
  margin: 0;
  font-size: 14px;
  color: ${colors.gray60};
  text-align: center;
`;

export default WebcamCapture; 