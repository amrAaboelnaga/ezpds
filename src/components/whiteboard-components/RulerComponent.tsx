import React, { useRef, useEffect, useState } from 'react';
import Ruler from '@scena/react-ruler';
import { position } from 'html2canvas/dist/types/css/property-descriptors/position';

const RulerComponent: React.FC = () => {
    const parentRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

    const horizontalRulerRef = useRef<Ruler>(null);
    const verticalRulerRef = useRef<Ruler>(null);

    // Update dimensions on mount and resize
    useEffect(() => {
        const updateDimensions = () => {
            if (parentRef.current) {
                const { offsetWidth, offsetHeight } = parentRef.current;
                setDimensions({ width: offsetWidth, height: offsetHeight });
            }
        };

        updateDimensions(); // Initial dimension update
        window.addEventListener('resize', updateDimensions); // Update on resize

        return () => {
            window.removeEventListener('resize', updateDimensions);
        };
    }, []);

    // Resize rulers when dimensions change
    useEffect(() => {
        if (horizontalRulerRef.current) {
            horizontalRulerRef.current.resize();
        }
        if (verticalRulerRef.current) {
            verticalRulerRef.current.resize();
        }
    }, [dimensions]);

    return (
        <div ref={parentRef} style={{ position: 'absolute', width: '100%', height: '100%' }}>
            {/* Horizontal Ruler */}
            <Ruler
                style={{
                    position: 'absolute',
                    width: '100%',
                    height: '30px',
                    top: '-40px'
                }}
                backgroundColor={'transparent'}
                unit={1}
                zoom={37.7952}
                textColor='black'
            />
            <Ruler
                type='vertical'
                style={{
                    position: 'absolute',
                    width: '30px',
                    height: '100%',
                    left: '-40px'
                }}
                backgroundColor={'transparent'}
                unit={1}
                zoom={37.7952}
                textColor='black'
            />

        </div>
    );
};

export default RulerComponent;
