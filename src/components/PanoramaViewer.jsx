import { useEffect, useRef } from "react";
import { Scene, Color, PerspectiveCamera, WebGLRenderer, SphereGeometry, MeshBasicMaterial, SRGBColorSpace, Mesh, TextureLoader } from "three"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"

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
        camera.position.z = 0.01
        const controls = new OrbitControls(camera, renderer.domElement)
        controls.enableZoom = false
        controls.enablePan = false
        controls.rotateSpeed = -0.25
        let frameId
        function tick() {
            renderer.render(scene, camera)
            frameId = requestAnimationFrame(tick)
        }
        tick()
        return () => {
            renderer.domElement.remove()
            renderer.dispose()
            geometry.dispose()
            material.dispose()
            texture.dispose()
            controls.dispose()
            cancelAnimationFrame(frameId)

        };
    }, []);

    return (
        <div className="panorama-viewer" ref={containerRef}>
        </div >
    );
};

export default PanoramaViewer;