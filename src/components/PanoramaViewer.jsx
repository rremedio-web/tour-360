import { useEffect, useRef } from "react";
import { Scene, Color, PerspectiveCamera, WebGLRenderer } from "three"


const PanoramaViewer = () => {
    const containerRef = useRef(null)
    useEffect(() => {
        const scene = new Scene();
        scene.background = new Color("#1a2b3c");
        const camera = new PerspectiveCamera(75, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
        const renderer = new WebGLRenderer();
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
        containerRef.current.appendChild(renderer.domElement);
        renderer.render(scene, camera)
        return () => {
            console.log("stop")
        };
    }, []);

    return (
        <div className="panorama-viewer" ref={containerRef}>
        </div >
    );
};

export default PanoramaViewer;