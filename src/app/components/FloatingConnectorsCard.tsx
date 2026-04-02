import React, { useRef, useState } from 'react';
import { motion, useSpring } from 'motion/react';
import { MovableBlock } from './LayoutEditor';

interface ConnectorPiece {
  id: number;
  x: number;
  y: number;
  z: number;
  rotation: { x: number; y: number; z: number };
  scale: number;
  color: 'blue' | 'white';
}

export function FloatingConnectorsCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Spring physics for smooth cursor tracking
  const mouseX = useSpring(0, { stiffness: 80, damping: 75 });
  const mouseY = useSpring(0, { stiffness: 80, damping: 75 });

  // Generate random floating connector pieces
  const connectors: ConnectorPiece[] = React.useMemo(() => {
    const pieces: ConnectorPiece[] = [];
    for (let i = 0; i < 18; i++) {
      pieces.push({
        id: i,
        x: Math.random() * 100 - 50,
        y: Math.random() * 100 - 50,
        z: Math.random() * 200 - 100,
        rotation: {
          x: Math.random() * 360,
          y: Math.random() * 360,
          z: Math.random() * 360,
        },
        scale: 0.6 + Math.random() * 0.8,
        color: Math.random() > 0.5 ? 'blue' : 'white',
      });
    }
    return pieces;
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    
    mouseX.set(x);
    mouseY.set(y);
    setMousePosition({ x, y });
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setMousePosition({ x: 0, y: 0 });
  };

  return (
    <div className="flex items-center justify-center p-8 bg-gradient-to-br from-slate-900 to-slate-950">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative overflow-hidden rounded-2xl cursor-none"
        style={{
          width: '760px',
          height: '520px',
          background: '#080C14',
          perspective: '1200px',
        }}
      >
        {/* 3D Scene Container */}
        <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
          {/* Floating Connector Pieces */}
          {connectors.map((piece, index) => {
            const depth = (piece.z + 100) / 200; // 0 to 1, closer = larger value
            const parallaxStrength = 1 - depth * 0.5; // Closer pieces move more
            
            return (
              <motion.div
                key={piece.id}
                className="absolute"
                style={{
                  left: `calc(50% + ${piece.x}%)`,
                  top: `calc(50% + ${piece.y}%)`,
                  transform: 'translate(-50%, -50%)',
                  transformStyle: 'preserve-3d',
                }}
                animate={{
                  x: -mousePosition.x * 40 * parallaxStrength,
                  y: -mousePosition.y * 40 * parallaxStrength,
                  scale: 1 + (depth > 0.7 ? 0.04 : 0), // Pop effect for foreground pieces
                  rotateX: mousePosition.y * 10 * parallaxStrength,
                  rotateY: mousePosition.x * 10 * parallaxStrength,
                  rotateZ: piece.rotation.z + mousePosition.x * 5,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 80,
                  damping: 75,
                  delay: index * 0.008,
                }}
              >
                {/* Cross-shaped connector piece */}
                <ConnectorCross 
                  color={piece.color} 
                  scale={piece.scale * (0.8 + depth * 0.6)}
                  rotation={piece.rotation}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Center "L" Letterform Overlay */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <MovableBlock id="floating-card-center-letter" className="pointer-events-none">
            <motion.div
              className="text-[240px] font-black leading-none text-white"
              style={{
                fontFamily: 'Impact, "Arial Black", sans-serif',
                letterSpacing: '-0.05em',
                textShadow: '0 4px 20px rgba(0,0,0,0.5)',
              }}
              animate={{
                scale: 1 + Math.abs(mousePosition.x) * 0.02,
              }}
              transition={{
                type: 'spring',
                stiffness: 100,
                damping: 30,
              }}
            >
              L
            </motion.div>
          </MovableBlock>
        </div>

        {/* Cursor follower */}
        {mousePosition.x !== 0 && (
          <motion.div
            className="absolute w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm pointer-events-none border border-white/40"
            style={{
              left: 0,
              top: 0,
            }}
            animate={{
              x: (mousePosition.x * 0.5 + 0.5) * 760 - 12,
              y: (mousePosition.y * 0.5 + 0.5) * 520 - 12,
            }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 20,
            }}
          />
        )}
      </motion.div>
    </div>
  );
}

// Cross-shaped connector component
function ConnectorCross({ 
  color, 
  scale, 
  rotation 
}: { 
  color: 'blue' | 'white'; 
  scale: number;
  rotation: { x: number; y: number; z: number };
}) {
  const baseSize = 40 * scale;
  const thickness = 12 * scale;
  
  const colorStyles = color === 'blue' 
    ? 'bg-[#2B4BFF]' 
    : 'bg-gradient-to-br from-white/80 to-gray-300/60';
  
  return (
    <div
      className="relative"
      style={{
        width: baseSize,
        height: baseSize,
        transformStyle: 'preserve-3d',
        transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) rotateZ(${rotation.z}deg)`,
      }}
    >
      {/* Horizontal bar */}
      <div
        className={`absolute ${colorStyles} rounded-sm`}
        style={{
          width: baseSize,
          height: thickness,
          top: '50%',
          left: 0,
          transform: 'translateY(-50%)',
          boxShadow: color === 'blue' 
            ? '0 2px 8px rgba(43, 75, 255, 0.4)' 
            : '0 2px 8px rgba(255, 255, 255, 0.3)',
        }}
      />
      
      {/* Vertical bar */}
      <div
        className={`absolute ${colorStyles} rounded-sm`}
        style={{
          width: thickness,
          height: baseSize,
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          boxShadow: color === 'blue' 
            ? '0 2px 8px rgba(43, 75, 255, 0.4)' 
            : '0 2px 8px rgba(255, 255, 255, 0.3)',
        }}
      />
      
      {/* Depth piece - creates 3D junction effect */}
      <div
        className={`absolute ${colorStyles} rounded-sm`}
        style={{
          width: thickness,
          height: thickness,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) translateZ(6px)',
          boxShadow: color === 'blue' 
            ? '0 0 12px rgba(43, 75, 255, 0.6)' 
            : '0 0 12px rgba(255, 255, 255, 0.4)',
        }}
      />
    </div>
  );
}
