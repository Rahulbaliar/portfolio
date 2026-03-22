import React, { useEffect, useRef } from 'react';

const CircularGallery = ({
  bend = 3,
  textColor = "#ffffff",
  borderRadius = 0.05,
  scrollEase = 0.02,
  scrollSpeed = 2,
  items = []
}) => {
  const galleryRef = useRef(null);
  const itemsRef = useRef([]);

  useEffect(() => {
    const gallery = galleryRef.current;
    if (!gallery) return;

    const itemElements = Array.from(gallery.children);
    itemsRef.current = itemElements;

    let angle = 0;
    let lastTime = 0;

    const animate = (currentTime) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      angle += scrollSpeed * deltaTime * 0.001;

      itemElements.forEach((item, index) => {
        const itemAngle = (angle + (index / itemElements.length) * Math.PI * 2) % (Math.PI * 2);
        const radius = 200;
        const x = Math.cos(itemAngle) * radius;
        const z = Math.sin(itemAngle) * radius * bend;

        item.style.transform = `translate3d(${x}px, 0, ${z}px) rotateY(${itemAngle}rad)`;
        item.style.opacity = Math.max(0, 1 - Math.abs(z) / (radius * bend));
      });

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);

    // Mouse interaction
    const handleMouseMove = (e) => {
      const rect = gallery.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const mouseX = e.clientX;
      const deltaX = (mouseX - centerX) / rect.width;
      angle += deltaX * scrollEase;
    };

    gallery.addEventListener('mousemove', handleMouseMove);

    return () => {
      gallery.removeEventListener('mousemove', handleMouseMove);
    };
  }, [bend, scrollEase, scrollSpeed]);

  return (
    <div
      ref={galleryRef}
      className="circular-gallery"
      style={{
        position: 'relative',
        width: '100%',
        height: '400px',
        perspective: '1000px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      {items.length > 0 ? items.map((item, i) => (
        <div
          key={i}
          className="gallery-item"
          style={{
            position: 'absolute',
            width: '200px',
            height: '250px',
            background: item.background || `linear-gradient(45deg, hsl(${i * 45}, 70%, 60%), hsl(${i * 45 + 60}, 70%, 40%))`,
            borderRadius: `${borderRadius * 100}%`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: textColor,
            fontSize: '16px',
            fontWeight: 'bold',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            transition: 'transform 0.3s ease',
            padding: '20px',
            textAlign: 'center'
          }}
        >
          {item.icon && <span style={{fontSize: '2rem', marginBottom: '10px'}}>{item.icon}</span>}
          <div style={{fontSize: '1.2rem', marginBottom: '10px'}}>{item.title}</div>
          <div style={{fontSize: '0.9rem', opacity: 0.8}}>{item.desc}</div>
        </div>
      )) : (
        // Default items if no items provided
        Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            className="gallery-item"
            style={{
              position: 'absolute',
              width: '150px',
              height: '200px',
              background: `linear-gradient(45deg, hsl(${i * 45}, 70%, 60%), hsl(${i * 45 + 60}, 70%, 40%))`,
              borderRadius: `${borderRadius * 100}%`,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: textColor,
              fontSize: '18px',
              fontWeight: 'bold',
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
              transition: 'transform 0.3s ease'
            }}
          >
            Item {i + 1}
          </div>
        ))
      )}
    </div>
  );
};

export default CircularGallery;