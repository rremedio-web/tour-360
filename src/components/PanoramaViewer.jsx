import { useEffect, useRef } from "react";
import { Scene, Color, PerspectiveCamera, WebGLRenderer, SphereGeometry, MeshBasicMaterial, SRGBColorSpace, Mesh, TextureLoader } from "three"


const PanoramaViewer = () => {
    const containerRef = useRef(null)
    useEffect(() => {
        const scene = new Scene();
        scene.background = new Color("#1a2b3c");
        const geometry = new SphereGeometry(500, 60, 40);
        geometry.scale(-1, 1, 1)

        const camera = new PerspectiveCamera(75,
            containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
        const renderer = new WebGLRenderer();
        const texture = new TextureLoader().load("/panoramas/lounge.jpg", () => {
        })
        texture.colorSpace = SRGBColorSpace
        const material = new MeshBasicMaterial({ map: texture })
        const mesh = new Mesh(geometry, material);
        scene.add(mesh);
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
        containerRef.current.appendChild(renderer.domElement);
        let frameId
        function tick() {
            renderer.render(scene, camera)  // do one frame's work
            frameId = requestAnimationFrame(tick)
            camera.rotation.y += 0.002                // book the next frame
        }
        tick()
        return () => {
            renderer.domElement.remove()
            renderer.dispose()
            geometry.dispose()
            material.dispose()
            texture.dispose()
            cancelAnimationFrame(frameId)                            // stop it

        };
    }, []);

    return (
        <div className="panorama-viewer" ref={containerRef}>
        </div >
    );
};

export default PanoramaViewer;